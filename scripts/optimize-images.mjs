// Compress referenced raster assets without resizing or removing original artwork.
// Run: node scripts/optimize-images.mjs
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDir = path.join(root, 'public');
const outputDir = path.join(publicDir, 'optimized');
const manifestPath = path.join(outputDir, 'manifest.json');
const sources = ['App.tsx', 'index.html', 'index.tsx'];
async function collect(dir) {
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) await collect(relative);
    else if (/\.(tsx?|css)$/.test(entry.name)) sources.push(relative);
  }
}
for (const dir of ['components', 'lib', 'styles']) await collect(dir);
const texts = new Map(await Promise.all(sources.map(async file => [file, await readFile(path.join(root, file), 'utf8')])));
const referenced = new Set();
for (const text of texts.values()) {
  for (const match of text.matchAll(/(?:["'`(])(\/[A-Za-z0-9_ /().-]+\.(?:png|jpe?g))(?=["'`)])/g)) referenced.add(match[1]);
}
let manifest = {};
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
await mkdir(outputDir, { recursive: true });
const replacements = new Map();
for (const url of [...referenced].sort()) {
  const input = path.join(publicDir, url.slice(1));
  const originalBytes = (await stat(input)).size;
  // Keep small marks, app icons, and compliance screenshots in their original format.
  if (originalBytes < 100_000 || /(?:favicon|icon-\d|apple-touch|logo|sms-consent)/.test(url)) continue;
  const relativeOutput = url.slice(1).replace(/\.(png|jpe?g)$/i, '.webp');
  const outputUrl = `/optimized/${relativeOutput}`;
  const output = path.join(outputDir, relativeOutput);
  const metadata = await sharp(input).metadata();
  const bytes = await sharp(input).webp({ quality: metadata.hasAlpha ? 90 : 84, alphaQuality: 100, effort: 6, smartSubsample: true }).toBuffer();
  if (bytes.length >= originalBytes) continue;
  const encoded = await sharp(bytes).metadata();
  if (encoded.width !== metadata.width || encoded.height !== metadata.height || Boolean(encoded.hasAlpha) !== Boolean(metadata.hasAlpha)) {
    throw new Error(`Image dimensions or transparency changed: ${url}`);
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, bytes);
  replacements.set(url, outputUrl);
  manifest[url] = { output: outputUrl, originalBytes, optimizedBytes: bytes.length, width: metadata.width, height: metadata.height, hasAlpha: Boolean(metadata.hasAlpha) };
}
for (const [file, original] of texts) {
  // Replace complete URLs, not matching suffixes (e.g. /dumpster-rental.png
  // must not also rewrite /service-scenes/dumpster-rental.png).
  const updated = original.replace(
    /(["'`(])(\/[A-Za-z0-9_ /().-]+\.(?:png|jpe?g))(?=["'`)])/g,
    (match, prefix, url) => replacements.has(url) ? prefix + replacements.get(url) : match
  );
  if (updated !== original) await writeFile(path.join(root, file), updated);
}
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
const entries = Object.values(manifest);
const before = entries.reduce((n, image) => n + image.originalBytes, 0);
const after = entries.reduce((n, image) => n + image.optimizedBytes, 0);
console.log(JSON.stringify({ images: entries.length, originalMB: +(before / 1e6).toFixed(2), optimizedMB: +(after / 1e6).toFixed(2), reductionPercent: +((1 - after / before) * 100).toFixed(1) }, null, 2));
