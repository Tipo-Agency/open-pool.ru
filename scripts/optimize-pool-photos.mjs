import fs from 'node:fs/promises';
import sharp from 'sharp';
const source = await fs.readFile(new URL('../app/data.ts', import.meta.url), 'utf8');
const block = source.match(/export const images = \{([\s\S]*?)\n\};/)[1];
const photos = [...block.matchAll(/(\w+): "(https:[^"]+)"/g)];
const manifest = {};
for (const [,name,url] of photos) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const input = Buffer.from(await response.arrayBuffer());
  const original = await sharp(input).metadata();
  const widths = [...new Set([... [480, 800, 1200, 1600].filter(w => w <= original.width), Math.min(1600, original.width)])].sort((a,b) => a-b);
  if (!widths.length) widths.push(original.width);
  manifest[url] = {name, width: original.width, height: original.height, widths};
  for (const width of widths) {
    const output = await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:80,effort:5}).toBuffer();
    await fs.writeFile(new URL(`../public/photos/${name}-${width}.webp`,import.meta.url),output);
    console.log(`${name} ${width}: ${output.length} bytes (original ${input.length})`);
  }
}
await fs.writeFile(new URL('../app/pool-photos.json',import.meta.url), JSON.stringify(manifest,null,2)+'\n');
