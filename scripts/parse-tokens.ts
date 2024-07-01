/**
 * Using Style Dictionary, design tokens from the ../tokens folder (exported from Figma Variables)
 * are parsed into variables that can be consumed by CSS and TypeScript.
 */
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';

import path from 'path';

const srcDir = 'tokens';
const outDir = 'dist';

type ColorPalette = 'atb' | 'fram' | 'innlandet' | 'nfk' | 'troms'
const organizations: ColorPalette[] = ['atb'];

type Mode = 'light' | 'dark'
const modes: Mode[] = ['light', 'dark'];

const toUpperFirstCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

/**
 * Appends the name of the collection to the file path, such that
 * it is prepended to the name of the variable (e.g., COLOR-background-neutral-...).
 */
StyleDictionary.registerTransform({
  name: 'attribute/append-type',
  type: 'attribute',
  transform: (token: TransformedToken) => {
    const originalPath = token.path;
    // Extract the collection name from the filename
    let type = token.filePath.match(/([^/]+?)(?=\.)/)?.[0];

    if (!type) return token;
    // "theme" should be called "color" in variables
    if (type === 'theme') type = 'color';

    //
    const generatedPath = [toUpperFirstCase(type), ...token.path];
    return Object.assign(originalPath, generatedPath);
  },
});

/**
 * Removes the base colors (color palette) from the final output.
 */
StyleDictionary.registerFilter({
  name: 'filter-palette',
  filter: (token: TransformedToken) => token.isSource,
});

/**
 * Contents of the main CSS file linking the themes
 */
const cssIndex = `
@import url('dark.css') layer(theme.dark);
@import url('light.css') layer(theme.light);

.dark {
  @layer theme.light, theme.dark;
}

@media (prefers-color-scheme: dark) {
  @layer theme.light, theme.dark;

  .light:not(.override-light) {
    @layer theme.dark, theme.light;
  }
}`;

/**
 * Contents of the main TypeScript file linking the themes
 */
const tsIndex = `
import Light from "./light.ts"
import Dark from "./dark.ts"

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
  const result = {};
  tokens.forEach((token) => {
    let current = result;
    token.path.forEach((element, index) => {
      if (index === token.path.length - 1) current[element] = token.value;
      else {
        current[element] = current[element] || {};
        current = current[element];
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
const getDestination = (organization: ColorPalette): string => path.join(outDir, `${organization}/`);

/**
 * @param organization Name of the organization
 * @param mode Theme mode
 * @returns Style Dictionary config for the org-mode combination
 */
const getStyleDictionaryConfig = (organization: ColorPalette, mode: Mode): Config => {
  const destination = getDestination(organization);

  return {
    include: [`${srcDir}/**/*.${organization}.json`],
    source: [`${srcDir}/**/*.${organization}_${mode}.json`, `${srcDir}/**/@(border|spacing|typography)*.json`],
    platforms: {
      css: {
        buildPath: destination,
        expand: true,
        // `css` transformGroup with `attribbute/append-type` prepended
        transforms: ['attribute/append-type', 'attribute/cti', 'name/kebab', 'time/seconds', 'html/icon', 'size/rem', 'color/css', 'asset/url', 'fontFamily/css', 'cubicBezier/css', 'strokeStyle/css/shorthand', 'border/css/shorthand', 'typography/css/shorthand', 'transition/css/shorthand', 'shadow/css/shorthand'],
        options: {
          selector: `.${mode}`,
        },
        files: [
          {
            format: 'css/variables',
            destination: `css/${mode}.css`,
            filter: 'filter-palette',
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
            filter: 'filter-palette',
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
  await Promise.all(
    modes.map((mode) => {
      console.log(`\n👷 Building ${organization} ${mode} tokens`);
      return new StyleDictionary(getStyleDictionaryConfig(organization, mode)).buildAllPlatforms();
    }),
  );
}
