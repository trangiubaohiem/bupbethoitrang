const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const filePath = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/outfits/cosmic_goddess.png';
const fileBuf = fs.readFileSync(filePath);
const png = PNG.sync.read(fileBuf);

let transparentCount = 0;
let restoredCount = 0;
const pixels = png.data;

for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const a = pixels[i + 3];

  if (a < 100) {
    transparentCount++;
    // Check if RGB data is non-zero
    if (r > 10 || g > 10 || b > 10) {
      restoredCount++;
    }
  }
}

console.log(`Total pixels: ${png.width * png.height}`);
console.log(`Transparent pixels: ${transparentCount}`);
console.log(`Pixels with recoverable RGB color data: ${restoredCount}`);
