/**
 * Using Style Dictionary, design tokens from the ../tokens folder (exported from Figma Variables)
 * are parsed into variables that can be consumed by CSS and TypeScript.
 */
import StyleDictionary from 'style-dictionary';
import type { Config, DesignTokens, TransformedToken } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';
import type { Organization, Mode, Tokens } from '@tfk-samf/figma-to-dtcg';

import path from 'path';
import border from '../raw/border.json';
import colorPalette from '../raw/color_palette.json';
import spacing from '../raw/spacing.json';
import theme from '../raw/theme.json';
import typography from '../raw/typography.json';

const srcDir = 'raw';
const outDir = 'dist';

const organizations: Organization[] = ['svipper'];
const modes: Mode[] = ['light', 'dark'];

const toUpperFirstCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

const makeTokens = (organization: Organization, mode: Mode) => ({
  ...(theme as Tokens['theme'])?.[`${organization}_${mode}`],
  ...(colorPalette as Tokens['color_palette'])?.[organization],
  ...border,
  ...typography,
  ...spacing,
} as DesignTokens);

/**
 * Appends the name of the collection to the file path, such that
 * it is prepended to the name of the variable (e.g., COLOR-background-neutral-...).
 */
StyleDictionary.registerTransform({
  name: 'attribute/append-type',
  type: 'attribute',
  transform: (token: TransformedToken) => {
    const originalPath = token.path;

    if (!token.prefix) return token;

    // Append the CamelCased type to the path
    Object.assign(originalPath, [toUpperFirstCase(token.prefix), ...token.path]);

    return token;
  },
});

/**
 * Contents of the main CSS file linking the themes
 */
const cssIndex = `/* Import dark mode */
@import url('dark.css') layer(theme.dark);
/* Import light mode */
@import url('light.css') layer(theme.light);
/* Override light mode if the user prefers the dark color scheme */
@import url('dark.css') layer(theme.dark-override) (prefers-color-scheme: dark);
`;

/**
 * Contents of the main TypeScript file linking the themes
 */
const tsIndex = `import Light from "./light"
import Dark from "./dark"

export const themes = {
  Light,
  Dark
}`;

/**
 * Outputs a string to a file. Used for generated
 * linking files defined above.
 */
StyleDictionary.registerFormat({
  name: 'index',
  format: async ({ file, options }) => {
    const header = await fileHeader({ file });
    return (
      header
      + options.content
    );
  },
});

/**
 * Generates a nested JSON object using the path of each token as key.
 *
 * ["Color", "Background", "Neutral", "0"] becomes
 * {
 *   "Color": {
 *     "Background": {
 *       "Neutral": {
 *         "0": value
 *       }
 *     }
 *   }
 * }
 *
 * @param tokens Flat list of design tokens
 * @returns Nested object based on the path of each token
 */
const expandToNestedObject = (tokens: TransformedToken[]) => {
  interface NestedObj {
    [key: string]: string | NestedObj
  }
  const result: NestedObj = {};
  tokens.forEach((token) => {
    let current = result;
    token.path.forEach((element, index) => {
      if (index === token.path.length - 1) current[element] = token.value;
      else {
        current[element] = current[element] || {};
        current = current[element] as NestedObj;
      }
    });
  });
  return result;
};

/**
 * Generates the nested JSON object and unquotes its keys.
 */
StyleDictionary.registerFormat({
  name: 'typescript/obj',
  format: async ({ dictionary, file }) => (`${await fileHeader({ file })
  }export default ${
    JSON.stringify(expandToNestedObject(dictionary.allTokens), null, 2).replace(/"([^"]+)":/g, '$1:')
  };\n`),
});

/**
 * Configures where the file should be output in accordance with the organization.
 *
 * @param organization Name of the organization
 * @returns Output folder
 */
const getDestination = (organization: Organization): string => path.join(outDir, `${organization}/`);

/**
 * @param organization Name of the organization
 * @param mode Theme mode
 * @returns Style Dictionary config for the org-mode combination
 */
const getStyleDictionaryConfig = (organization: Organization, mode: Mode): Config => {
  const destination = getDestination(organization);

  return {
    log: {
      verbosity: 'silent',
    },
    include: [`${srcDir}/**/*.${organization}.json`],
    source: [`${srcDir}/**/*.${organization}_${mode}.json`, `${srcDir}/**/@(border|spacing|typography)*.json`],
    tokens: makeTokens(organization, mode),
    platforms: {
      css: {
        buildPath: destination,
        expand: true,
        // `css` transformGroup with `attribbute/append-type` prepended
        transforms: ['attribute/append-type', 'attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/css', 'asset/url', 'fontFamily/css', 'cubicBezier/css', 'strokeStyle/css/shorthand', 'border/css/shorthand', 'typography/css/shorthand', 'transition/css/shorthand', 'shadow/css/shorthand'],
        files: [
          {
            format: 'css/variables',
            options: {
              selector: `:root[data-theme="${mode}"], :root[data-theme="auto"] { color-scheme: ${mode}; } \n:root[data-theme="${mode}"], :root[data-theme="auto"]`,
            },
            destination: `css/${mode}.css`,
          },
          {
            format: 'index',
            options: {
              content: cssIndex,
            },
            destination: 'css/index.css',
          },
        ],
      },
      ts: {
        buildPath: destination,
        expand: true,
        // `js` transformGroup with `attribbute/append-type` prepended
        transforms: ['attribute/append-type', 'attribute/cti', 'name/pascal', 'size/rem', 'color/hex'],
        files: [
          {
            format: 'typescript/obj',
            destination: `ts/${mode}.ts`,
          },
          {
            format: 'index',
            options: {
              content: tsIndex,
            },
            destination: 'ts/index.ts',
          },
        ],
      },
      // cssModule: {}
    },
  };
};

// Generate files for each organization-mode combination
for (const organization of organizations) {
  console.info(`\n👷  Built ${toUpperFirstCase(organization)} tokens      | 🌙 & 🌞 |`);
  await Promise.all(
    modes.map((mode) => new StyleDictionary(
      getStyleDictionaryConfig(organization, mode),
    ).buildAllPlatforms()),
  );
}

console.log('\n');
