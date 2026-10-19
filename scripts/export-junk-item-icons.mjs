// Keep the catalog's standalone SVG assets in sync with its React illustrations.
// Run from the repository root: node scripts/export-junk-item-icons.mjs
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const { outputFiles } = await build({
  stdin: { contents: "export { JunkIconMap } from './components/icons/JunkItemIcons';", resolveDir: root, loader: 'tsx' },
  bundle: true, platform: 'node', format: 'esm', write: false,
  define: { 'process.env.NODE_ENV': '"production"' },
});
const { JunkIconMap } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
for (const [key, Icon] of Object.entries(JunkIconMap)) {
  const svg = renderToStaticMarkup(createElement(Icon, { size: 48 }))
    .replaceAll('currentColor', '#520f96');
  await writeFile(new URL(`../public/items/${key}.svg`, import.meta.url), `${svg}\n`);
}
console.log(`Exported ${Object.keys(JunkIconMap).length} Opek item illustrations.`);
