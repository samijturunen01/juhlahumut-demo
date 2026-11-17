/** montage.mjs – development helper: tile numbered frames into one contact sheet.
 *  node scripts/montage.mjs <prefix> <count> <out.png> [cols=4] [tileWidth=640] */
import sharp from 'sharp';
const [, , prefix, countArg, out, colsArg = '4', twArg = '640'] = process.argv;
const count = Number(countArg), cols = Number(colsArg), tw = Number(twArg);
const tiles = [];
let th = 0;
for (let i = 1; i <= count; i++) {
  const buf = await sharp(`${prefix}-${String(i).padStart(2, '0')}.png`).resize({ width: tw }).png().toBuffer();
  th = (await sharp(buf).metadata()).height;
  tiles.push(buf);
}
const rows = Math.ceil(count / cols);
await sharp({ create: { width: cols * tw, height: rows * th, channels: 3, background: '#222' } })
  .composite(tiles.map((input, i) => ({ input, left: (i % cols) * tw, top: Math.floor(i / cols) * th })))
  .png().toFile(out);
console.log('ok', out);
