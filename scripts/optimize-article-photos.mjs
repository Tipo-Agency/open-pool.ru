// Lossy delivery copies; source photographs remain unchanged.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const directory = new URL('../public/articles/', import.meta.url);
const manifest = {};
let originalBytes = 0, deliveryBytes = 0;
for (const file of (await fs.readdir(directory)).filter(name => /\.jpg$/.test(name)).sort()) {
  const input = await fs.readFile(new URL(file, directory));
  const original = await sharp(input).metadata();
  const name = `article-${file.slice(0, -4)}`;
  const widths = [...new Set([480, 800, Math.min(1200, original.width)].filter(width => width <= original.width))].sort((a,b) => a-b);
  manifest[`/articles/${file}`] = { name, width: original.width, height: original.height, widths };
  originalBytes += input.length;
  for (const width of widths) {
    const output = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
    await fs.writeFile(new URL(`../public/photos/${name}-${width}.webp`, import.meta.url), output);
    if (width === widths.at(-1)) deliveryBytes += output.length;
  }
}
await fs.writeFile(new URL('../app/article-photos.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: Object.keys(manifest).length, originalBytes, largestDeliveryBytes: deliveryBytes }));
