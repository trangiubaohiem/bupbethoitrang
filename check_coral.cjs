const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const filePath = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/outfits/coral_queen.png';
const fileBuf = fs.readFileSync(filePath);
const png = PNG.sync.read(fileBuf);
const pixels = png.data;

let nonWhiteCount = 0;
for (let i = 0; i < pixels.length; i += 4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  if (r < 250 || g < 250 || b < 250) {
    nonWhiteCount++;
  }
}

console.log(`coral_queen.png non-pure-white pixels: ${nonWhiteCount}/${png.width * png.height}`);
