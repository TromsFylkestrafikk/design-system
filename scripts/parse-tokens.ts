/**
 * Using Style Dictionary, design tokens from the ../tokens folder (exported from Figma Variables)
 * are parsed into the `theme.ts` file that is bundled in this package.
 *
 * Mutations of the tokens are necessary to keep the same naming and layout
 * of the `theme.ts` file as before. Suggested modifications in the future are marked with `TODO`.
 */
import StyleDictionary, { TransformedToken } from 'style-dictionary';
import type { Config } from 'style-dictionary/types';

import * as path from 'path';

const srcDir = 'tokens';
const outDir = 'dist';

type ColorPalette = 'atb' | 'fram' | 'innlandet' | 'nfk' | 'troms'
const palettes: ColorPalette[] = ['atb'];

type Mode = 'light' | 'dark'
const modes: Mode[] = ['light'];

StyleDictionary.registerTransform({
  type: 'name',
  name: 'expand-foreground',
  transform: (token: TransformedToken) => {
    console.log(token.name);
    return token.name;
  },
});

StyleDictionary.registerFilter({
  name: 'filter-palette',
  filter: (token: TransformedToken) => token.isSource,
});

/**
 * Configures where the file should be output
 * and what the name should be for each theme for each organisation
*/
const getDestination = ({ palette, mode }: { palette: ColorPalette, mode: Mode}): string => path.join(outDir, `${palette}/${mode}/`);

const getStyleDictionaryConfig = (palette: ColorPalette, mode: Mode): Config => {
  const destination = getDestination({ palette, mode });

  return {
    log: {
      warnings: 'warn', // 'warn' | 'error' | 'disabled'
      verbosity: 'verbose', // 'default' | 'silent' | 'verbose'
    },
    include: [`${srcDir}/**/*.${palette}.json`],
    source: [`${srcDir}/**/*.${palette}_${mode}.json`, `${srcDir}/**/(border|spacing|typography)*.json`],
    platforms: {
      css: {
        buildPath: destination,
        expand: (token) => token.isSource,
        transformGroup: 'css',
        transforms: ['expand-foreground'],
        files: [
          {
            format: 'css/variables',
            destination: 'variables.css',
            filter: 'filter-palette',
          },
        ],
      },
      js: {
        buildPath: destination,
        expand: false,
        transformGroup: 'js',
        files: [
          {
            format: 'javascript/es6',
            destination: 'variables.js',
            filter: 'filter-palette',
          },
        ],
      },
      // css: {},
      // cssModule: {}
    },
  };
};

for (const palette of palettes) {
  await Promise.all(
    modes.map((mode) => {
      console.log(`\n👷 Building ${palette} ${mode} tokens`);
      return new StyleDictionary(getStyleDictionaryConfig(palette, mode)).buildPlatform('css');
    }),
  );
}
