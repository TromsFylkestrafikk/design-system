/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  RGB, RGBA,
  LocalVariableCollection, VariableValue, LocalVariable, VariableAlias, GetLocalVariablesResponse,
} from '@figma/rest-api-spec';

/**
 * Configure this package for the Figma Variables Rest API.
 *
 * @example
 * {
 *    // The API used
 *    api
 *    // Response from Figma Variables Rest API /v1/files/:file_key/variables/* endpoint
 *    response
 * }
 */
export type RestAPIProps = {
  api?: 'rest'
  response: GetLocalVariablesResponse
}

/**
 * Configure this package for the Figma Plugin API.
 *
 * @example
 * {
 *    // The API used
 *    api
 *    // Pass in Figma Plugin API client
 *    client: figma
 * }
 */
export type PluginAPIProps = {
  api?: 'plugin',
  client: PluginAPI
}

export type Options<Collection> = {
  verbosity?: 'silent' | 'verbose',
  typeMap?: Record<FigmaTokenType, (category: Collection) => string>
}

type OptionalExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>
export type DesignTokenType = 'color' | 'number' | 'fontFamily' | 'boolean'
export type FigmaTokenType = LocalVariable['resolvedType']
export type DesignToken = {
  type: DesignTokenType
  value: string | number | boolean | RGB | CompositeToken
  prefix: string
}
export interface CompositeToken { [key: string]: DesignToken['value'] }
export type Token = DesignToken | CompositeToken

export type Tree = Token | { [key: string]: Tree };
export type Node = Exclude<Tree, Token>

export type Tokens<
  Themes extends string,
  Variants extends string,
  SharedCollections extends string,
  InvariantCollections extends string,
  VariantCollections extends string
> = {
  [sc in SharedCollections]?: Tree } & {
  [ic in InvariantCollections]?: { [theme in Themes]?: Tree } } & {
  [vc in VariantCollections]?: { [theme in `${Themes}_${Variants}`]?: Tree }
}

let globalOptions: Required<Options<any>>;
const defaultOptions: typeof globalOptions = {
  verbosity: 'silent',
  typeMap: {
    COLOR: () => 'color',
    FLOAT: () => 'number',
    STRING: () => 'fontFamily',
    BOOLEAN: () => 'boolean',
  },
};
const isVerbose = () => globalOptions.verbosity === 'verbose';

let getVariableById: (id: string) => Promise<LocalVariable>;

/**
 * Converts an RGB(a) value to HEX
 *
 * @param color Color in RGB(a) format
 * @returns Color in HEX format
 */
function rgbToHex({
  r, g, b, a,
}: RGBA) {
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };

  const hex = [toHex(r), toHex(g), toHex(b)];
  if (a !== 1) {
    hex.push(toHex(a));
  }
  return `#${hex.join('')}`;
}

/**
 * Cleans the name of a variable according to Design Token (W3C) standard
 *
 * @param name Name of a variable
 * @returns Name trimmed and snake_case
 */
function sanitizeName(name: string) {
  return name
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/^ +/, '')
    .replace(/ +$/, '')
    .replace(/ +/g, '_')
    .toLowerCase();
}

/**
 * Checks if the name of a collection, group or variable is private.
 *
 * @param collection Name of the collection
 * @returns True if private
 */
function isPrivate(collection: string) {
  return collection.startsWith('_');
}

/**
 * Map Figma ids to names of variables and collections
 *
 * @param nodesWithNames Collection of variables
 * @param idKey The key of the id in the `nodesWithNames` parameter
 * @returns Functions that map from id to name and back
 */
function uniqueKeyIdMaps<T extends OptionalExcept<LocalVariableCollection, 'name'>, K extends keyof T, F extends T[K] &(string | number | symbol)>(nodesWithNames: T[], idKey: K) {
  const idToKey: Record<F, string> = {} as Record<F, string>;
  const keyToId: Record<string, T[K]> = {};

  nodesWithNames.forEach((node) => {
    const key = sanitizeName(node.name);
    let int = 2;
    let uniqueKey = key;
    while (keyToId[uniqueKey]) {
      uniqueKey = `${key}_${int}`;
      int += 1;
    }
    keyToId[uniqueKey] = node[idKey];
    idToKey[node[idKey] as F] = uniqueKey;
  });

  return { idToKey, keyToId };
}

/**
 * Convert single variable to Design Token (W3C) standard
 *
 * @param name Name of the current variable
 * @param value Value of the current variable
 * @param type Type of current variable
 * @returns Value of the variable in Design Token (W3C) standard
 */
async function valueToJSON(
  name: string,
  value: VariableValue,
  type: LocalVariable['resolvedType'],
): Promise<DesignToken['value'] | undefined> {
  const isAlias = (
    v: VariableValue,
  ): v is VariableAlias => !!(v as VariableAlias).type && !!(v as VariableAlias).id;

  const isForeground = (
    { name: _name }: LocalVariable,
  ): boolean => !!_name.match(/^Foreground\/([\w\s]+)\/(Primary|Secondary|Disabled)$/);

  const isColorPalette = (
    { name: _name }: LocalVariable,
  ): boolean => !!_name.match(/^[A-Za-z]+\/\d+\/Background$/);

  let _value: DesignToken['value'];

  // If the variable is a reference to another variable
  if (isAlias(value)) {
    // Get the referenced variable
    const variable = (await getVariableById(value.id));
    if (!variable) {
      if (isVerbose()) {
        console.warn(`Missing alias definiton for ${name}. Your Figma file might contain variables with a definition outside of the file. Skipping...`);
      }
      return undefined;
    }

    const alias = `{${variable.name.replace(/\//g, '.')}}`;

    _value = alias;

    // Expand the referenced variable if it is a foreground variable
    if (isForeground(variable)) {
      _value = {
        Primary: alias,
        Secondary: alias.replace('Primary', 'Secondary'),
        Disabled: alias.replace('Primary', 'Disabled'),
      };
    }

    // Expand the referenced variable if it is a reference to the color palette
    // If the current variable is a foreground color, do not expand it to avoid circular references
    if (isColorPalette(variable) && !isForeground({ name } as LocalVariable)) {
      _value = {
        Background: alias,
        Foreground: alias.replace('Background', 'Foreground'),
      };
    }
  } else {
    // Return an actual value if the variable is not a reference
    _value = type === 'COLOR' ? rgbToHex(value as RGBA) : value as string;
  }

  return _value;
}

/**
 * Creates the prefix for a specific collection. Design tokens will be prefixed with this.
 *
 * @param collection Name of the current collection
 * @returns Sanitized name of the collection to be prefixed on the variable name
 */
function makePrefix(
  collection: string,
) {
  const prefix = sanitizeName(collection);
  return prefix === 'theme' ? 'color' : prefix;
}

/**
 * Converts a collection to Design Token (W3C) standard
 *
 * @param collection The variable collection to export
 * @returns The collection in the Design Token (W3C) format
 */
async function collectionAsJSON(
  { name: collectionName, modes, variableIds }: LocalVariableCollection,
) {
  const collection: Record<string, Tree> = {};
  const { idToKey, keyToId } = uniqueKeyIdMaps(modes, 'modeId');
  const modeKeys = Object.values(idToKey);
  const isMultiMode = modeKeys.length > 1;
  const collectionPrefix = makePrefix(collectionName);

  // Add nesting for each mode if we have multiple
  if (isMultiMode) {
    modeKeys.forEach((mode: string) => {
      collection[mode] = collection[mode] || {};
    });
  }

  variables: for (const variableId of variableIds) {
    const {
      name,
      resolvedType,
      valuesByMode,
      remote,
    } = (await getVariableById(variableId))!;

    if (remote) {
      if (isVerbose()) {
        console.warn(`Skipping remote variable ${name}`);
      }
      continue;
    }

    for (const mode of modeKeys) {
      // Do not nest if there is only one mode
      let obj = isMultiMode ? collection[mode] : collection;
      const value = valuesByMode[keyToId[mode]];

      if (value !== undefined && ['COLOR', 'FLOAT', 'STRING'].includes(resolvedType)) {
        const groups = name.split('/');
        const objValue = await valueToJSON(name, value, resolvedType);

        if (
          groups.some((group) => isPrivate(group))
          || !objValue
        ) {
          continue variables;
        }

        groups.forEach((groupName) => {
          obj = obj as Node;
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName];
        });

        obj.value = objValue;
        obj.type = globalOptions.typeMap[resolvedType](sanitizeName(collectionName));
        obj.prefix = collectionPrefix;
      }
    }
  }
  return collection;
}

/**
 * Provides Design Tokens from a given Figma instance
 * using either Figma Variables Rest API or the Plugin API.
 *
 * **Typing of the returned Tokens object using generics**
 *
 * 1. Themes = keys of the available themes
 *
 * Example: type Themes = "normal" | "halloween" | "easter"
 *
 * 2. Variants = keys of variants for each theme
 *
 * Example: type Variants = "light" | "dark"
 *
 * 3. SharedCollections = Keys of collections that do not change across themes
 *
 * example: "border" | "spacing"
 *
 * 4. InvariantCollections = Keys of collections that do not change according to variant of a theme,
 * but change across themes
 *
 * Example: "color_palette"
 *
 * 5. VariantCollections = Keys of collections that change according to theme variant
 *
 * Example: "themes"
 *
 * @param props
 * @returns `{ tokens }` Design Tokens in W3C spec
 */
async function useFigmaToDTCG<
  Themes extends string = any,
  Variants extends string = any,
  SharedCollections extends string = any,
  InvariantCollections extends string = any,
  VariantCollections extends string = any
>(
  props: RestAPIProps | PluginAPIProps,
  options?: Options<SharedCollections | InvariantCollections | VariantCollections>,
) {
  globalOptions = {
    ...defaultOptions,
    ...options,
  } as Required<Options<SharedCollections | InvariantCollections | VariantCollections>>;

  const isRestApiEnv = (p: typeof props): p is RestAPIProps => p.api === 'rest';

  getVariableById = isRestApiEnv(props)
    ? (id: string) => Promise.resolve(props.response.meta.variables[id])
    : (id: string) => props.client.variables.getVariableByIdAsync(id) as Promise<LocalVariable>;
  const collections = isRestApiEnv(props)
    ? Object.values(props.response.meta.variableCollections)
    : await props.client.variables.getLocalVariableCollectionsAsync();

  const tree: Tree = {};

  for (const collection of collections) {
    if (collection.remote) {
      if (isVerbose()) console.warn(`Skipping remote collection ${collection.name}`);
      continue;
    }

    const name = sanitizeName(collection.name);

    // Skip this collection if private
    if (isPrivate(name)) continue;

    tree[name] = await collectionAsJSON(collection);
  }

  return {
    tokens: tree as Tokens<
      Themes,
      Variants,
      SharedCollections,
      InvariantCollections,
      VariantCollections
    >,
  };
}

export { useFigmaToDTCG };
