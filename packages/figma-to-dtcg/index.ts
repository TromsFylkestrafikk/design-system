/**
 *
 * Main export code based on code by `jake-figma`
 * https://github.com/jake-figma/figma-token-json
 *
 */
import {
  RGB, RGBA,
  LocalVariableCollection, VariableValue, LocalVariable, VariableAlias, GetLocalVariablesResponse,
} from '@figma/rest-api-spec';

let getVariableById: (id: string) => Promise<LocalVariable>;

const KEY_PREFIX_COLLECTION = '';

export type RestAPIProps = {
  api?: 'rest'
  response: GetLocalVariablesResponse
}

export type PluginAPIProps = {
api?: 'plugin'
}

type OptionalExcept<T, K extends keyof T> = Pick<T, K> & Partial<T>
export type DesignTokenType = 'color' | 'number'
export type DesignToken = {
  type: DesignTokenType
  value: string | number | boolean | RGB | CompositeToken
  }
export interface CompositeToken { [key: string]: DesignToken['value'] }
export type Token = DesignToken | CompositeToken

export type Tree = Token | { [key: string]: Tree };
export type Node = Exclude<Tree, Token>

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
 * @param prefix If names should be prefixed
 * @returns Functions that map from id to name and back
 */
function uniqueKeyIdMaps<T extends OptionalExcept<LocalVariableCollection, 'name'>, K extends keyof T, F extends T[K] &(string | number | symbol)>(nodesWithNames: T[], idKey: K, prefix = '') {
  const idToKey: Record<F, string> = {} as Record<F, string>;
  const keyToId: Record<string, T[K]> = {};
  nodesWithNames.forEach((node) => {
    const key = sanitizeName(node.name);
    let int = 2;
    let uniqueKey = `${prefix}${key}`;
    while (keyToId[uniqueKey]) {
      uniqueKey = `${prefix}${key}_${int}`;
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
): Promise<DesignToken['value']> {
  const isAlias = (
    v: VariableValue,
  ): v is VariableAlias => !!(v as VariableAlias).type && !!(v as VariableAlias).id;

  const isForeground = (
    { name: _name }: LocalVariable,
  ): boolean => !!_name.match(/^Foreground\/(Dark|Light)\/(Primary|Secondary|Disabled)$/);

  const isColorPalette = (
    { name: _name }: LocalVariable,
  ): boolean => !!_name.match(/^[A-Za-z]+\/\d+\/Background$/);

  let _value: DesignToken['value'];

  // If the variable is a reference to another variable
  if (isAlias(value)) {
    // Get the referenced variable
    const variable = (await getVariableById(value.id))!;
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
 * Converts collection to Design Token (W3C) standard
 *
 * @param collection The variable collection to export
 * @returns The collection in the Design Token (W3C) format
 */
async function collectionAsJSON(
  { modes, variableIds }: LocalVariableCollection,
) {
  const collection: Record<string, Tree> = {};
  const { idToKey, keyToId } = uniqueKeyIdMaps(modes, 'modeId');
  const modeKeys = Object.values(idToKey);

  modeKeys.forEach((mode: string) => {
    collection[mode] = collection[mode] || {};
  });

  variables: for (const variableId of variableIds) {
    const {
      name,
      resolvedType,
      valuesByMode,
    } = (await getVariableById(variableId))!;

    for (const mode of modeKeys) {
      let obj = collection[mode];
      const value = valuesByMode[keyToId[mode]];

      if (value !== undefined && ['COLOR', 'FLOAT'].includes(resolvedType)) {
        const groups = name.split('/');
        if (groups.some((group) => isPrivate(group))) continue variables;

        groups.forEach((groupName) => {
          obj = obj as Node;
          obj[groupName] = obj[groupName] || {};
          obj = obj[groupName];
        });

        obj.value = await valueToJSON(name, value, resolvedType);
        obj.type = (resolvedType === 'COLOR' ? 'color' : 'number') as DesignTokenType;
      }
    }
  }
  return collection;
}

async function useFigmaToDTCG(props: RestAPIProps | PluginAPIProps = { api: 'plugin' }) {
  const isRestApiEnv = (p: typeof props): p is RestAPIProps => p.api === 'rest';

  getVariableById = isRestApiEnv(props)
    ? (id: string) => Promise.resolve(props.response.meta.variables[id])
    : (id: string) => figma.variables.getVariableByIdAsync(id) as Promise<LocalVariable>;
  const collections = isRestApiEnv(props)
    ? Object.values(props.response.meta.variableCollections)
    : await figma.variables.getLocalVariableCollectionsAsync();

  const tree: Tree = {};
  const { idToKey } = uniqueKeyIdMaps(collections, 'id', KEY_PREFIX_COLLECTION);

  for (const collection of collections) {
    const name = idToKey[collection.id];

    // Skip this collection if private
    if (isPrivate(name)) continue;

    tree[name] = await collectionAsJSON(collection);
  }

  return {
    tokens: tree,
  };
}

export { useFigmaToDTCG };
