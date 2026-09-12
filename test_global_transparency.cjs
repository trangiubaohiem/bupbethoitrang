const path = require('path');
const { loadImage, createCanvas } = require('canvas');
const fs = require('fs');

async function testGlobalKeying() {
  const filePath = path.join(__dirname, 'src', 'assets', 'outfits', 'set_m2_epic.png');
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  let erasedCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 10) continue;

    // Pure white or near-white (RGB > 220)
    const isPureWhite = (r > 220 && g > 220 && b > 220);
    // Light gray / light pastel halo (RGB > 195 and low color saturation)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isLowSatWhite = (minVal > 190 && (maxVal - minVal) < 22);

    // Protect warm rosy skin tones: R > G, G >= B-20, R > 180, R-B > 25
    const isSkinTone = (r > 180 && g > 120 && b > 90 && r > g && (r - b) > 25);

    if ((isPureWhite || isLowSatWhite) && !isSkinTone) {
      data[i + 3] = 0; // Set Alpha = 0 (100% Transparent)
      erasedCount++;
    }
  }

  // Soft Edge Anti-Aliasing for smooth character contours
  for (let y = 1; y < img.height - 1; y++) {
    for (let x = 1; x < img.width - 1; x++) {
      const idx = (y * img.width + x) * 4;
      if (data[idx + 3] === 0) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const leftA   = data[(y * img.width + (x - 1)) * 4 + 3];
      const rightA  = data[(y * img.width + (x + 1)) * 4 + 3];
      const topA    = data[((y - 1) * img.width + x) * 4 + 3];
      const bottomA = data[((y + 1) * img.width + x) * 4 + 3];

      if (leftA === 0 || rightA === 0 || topA === 0 || bottomA === 0) {
        if (r > 180 && g > 180 && b > 180) {
          const avg = (r + g + b) / 3;
          data[idx + 3] = Math.max(0, Math.floor((255 - avg) * 2));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  console.log(`✅ Erased ${erasedCount} white/halo sticker pixels in set_m2_epic.png!`);

  const outBuffer = canvas.toBuffer('image/png');
  fs.writeFileSync(filePath, outBuffer);
}

testGlobalKeying();
