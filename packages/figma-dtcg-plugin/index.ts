/**
 *
 * Main export code based on code by `jake-figma`
 * https://github.com/jake-figma/figma-token-json
 *
 */
import { useFigmaToDTCG } from '@tfk-samf/figma-to-dtcg';
import type { Tree, Node } from '@tfk-samf/figma-to-dtcg';

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
 * @param tree A design token tree
 */
function exportFiles(tokens: Tree) {
  const collections = Object.keys(tokens);

  type FileName = string
  const zipContent: Record<FileName, string> = {};

  collections.forEach((collection) => {
    const modes = Object.keys((tokens as Node)[collection]);

    const isSingleMode = modes.length === 1;

    modes.forEach((mode) => {
      const fileName = `${collection}${isSingleMode ? '' : `.${mode}`}.json`;
      const content = JSON.stringify(((tokens as Node)[collection] as Node)[mode], null, 2);
      zipContent[fileName] = content;
    });
  });

  figma.ui.postMessage({
    type: 'download-zip',
    contents: zipContent,
    raw: JSON.stringify(tokens, null, 2),
  });
}

const { tokens } = await useFigmaToDTCG();
exportFiles(tokens);
