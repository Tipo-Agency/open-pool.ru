// Lossy delivery copies for /galereya; source photographs remain unchanged.
import fs from 'node:fs/promises';
import sharp from 'sharp';
const directory = new URL('../public/gallery/', import.meta.url);
const manifest = {};
for (const file of (await fs.readdir(directory)).filter(name => /\.(jpe?g|png)$/i.test(name)).sort()) {
  const input = await fs.readFile(new URL(file, directory));
  const original = await sharp(input).rotate().metadata();
  const name = `gallery-${file.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-')}`;
  const widths = [...new Set([480, 800, Math.min(1600, original.width)].filter(width => width <= original.width))].sort((a,b) => a-b);
  const height = Math.round(original.height * widths.at(-1) / original.width);
  manifest[`/gallery/${file}`] = { name, width: widths.at(-1), height, widths };
  for (const width of widths) {
    const output = await sharp(input).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78, effort: 5 }).toBuffer();
    await fs.writeFile(new URL(`../public/photos/${name}-${width}.webp`, import.meta.url), output);
  }
}
await fs.writeFile(new URL('../app/gallery-photos.json', import.meta.url), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ images: Object.keys(manifest).length }));
