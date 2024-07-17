/**
 *
 * Main export code based on code by `jake-figma`
 * https://github.com/jake-figma/figma-token-json
 *
 */
import { useFigmaToDTCG } from '@tfk-samf/figma-to-dtcg';
import type { TokenType } from '@tfk-samf/figma-to-dtcg';

console.clear();
console.log('------------------- Console cleared by Design Tokens (W3C) Export -------------------');

figma.showUI(__html__);

/**
 * Exports generated files to .zip
 *
 * Takes a tree of design tokens, split is up by collection and mode
 * and generates a file structure that is send to a .zip file.
 *
 * The generated structure is as follows, which is send to the front-end for download.
 *
 * ```
 * {
 *   [collection].[mode].json: json_content,
 *   ...
 * }
 * ```
 *
 */
async function exportFiles() {
  const { tokens } = await useFigmaToDTCG({
    api: 'plugin',
    client: figma,
  });
  const collections = Object.keys(tokens) as TokenType[];

  type FileName = string
  const zipContent: Record<FileName, string> = {};

  collections.forEach((collection) => {
    const fileName = `${collection}.json`;
    const content = JSON.stringify(tokens[collection], null, 2);
    zipContent[fileName] = content;
  });

  figma.ui.postMessage({
    type: 'download-zip',
    contents: zipContent,
    raw: JSON.stringify(tokens, null, 2),
  });
}

exportFiles();
