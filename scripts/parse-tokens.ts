/**
 * Using Style Dictionary, design tokens from the ../tokens folder (exported from Figma Variables)
 * are parsed into the `theme.ts` file that is bundled in this package.
 *
 * Mutations of the tokens are necessary to keep the same naming and layout
 * of the `theme.ts` file as before. Suggested modifications in the future are marked with `TODO`.
 */
import StyleDictionary from 'style-dictionary';
import type { Config, TransformedToken } from 'style-dictionary/types';
import { fileHeader } from 'style-dictionary/utils';

import * as path from 'path';

const srcDir = 'tokens';
const outDir = 'dist';

type ColorPalette = 'atb' | 'fram' | 'innlandet' | 'nfk' | 'troms'
const palettes: ColorPalette[] = ['atb'];

type Mode = 'light' | 'dark'
const modes: Mode[] = ['light', 'dark'];

StyleDictionary.registerTransform({
  name: 'attribute/append-type',
  type: 'attribute',
  transform: (token: TransformedToken) => {
    const originalPath = token.path;
    let type = token.filePath?.match(/([^/]+?)(?=\.)/)?.[0];

    if (!type) return token;
    if (type === 'theme') type = 'color';

    const generatedPath = [type.charAt(0).toUpperCase() + type.slice(1), ...token.path];
    return Object.assign(originalPath, generatedPath);
  },
});

StyleDictionary.registerFilter({
  name: 'filter-palette',
  filter: (token: TransformedToken) => token.isSource,
});

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

const tsIndex = `
import Light from "./light.ts"
import Dark from "./dark.ts"

export const themes = {
  Light,
  Dark
}`;

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

StyleDictionary.registerFormat({
  name: 'typescript/obj',
  // format: async ({ dictionary, file }) => (await fileHeader({file}) +
  // 'export default ' +
  // JSON.stringify(simplifyNode(dictionary.tokens), null, 2).replace(/"([^"]+)":/g, '$1:') +
  // ';\n')
  format: async ({ dictionary, file }) => (`${await fileHeader({ file })
  }export default ${
    JSON.stringify(expandToNestedObject(dictionary.allTokens), null, 2).replace(/"([^"]+)":/g, '$1:')
  };\n`),
});

/**
 * Configures where the file should be output
 * and what the name should be for each theme for each organisation
*/
const getDestination = ({ palette }: { palette: ColorPalette, mode: Mode}): string => path.join(outDir, `${palette}/`);

const getStyleDictionaryConfig = (palette: ColorPalette, mode: Mode): Config => {
  const destination = getDestination({ palette, mode });

  return {
    log: {
      warnings: 'warn', // 'warn' | 'error' | 'disabled'
      verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
    },
    include: [`${srcDir}/**/*.${palette}.json`],
    source: [`${srcDir}/**/*.${palette}_${mode}.json`, `${srcDir}/**/@(border|spacing|typography)*.json`],
    platforms: {
      css: {
        buildPath: destination,
        expand: true,
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

for (const palette of palettes) {
  await Promise.all(
    modes.map((mode) => {
      console.log(`\n👷 Building ${palette} ${mode} tokens`);
      return new StyleDictionary(getStyleDictionaryConfig(palette, mode)).buildAllPlatforms();
    }),
  );
}
