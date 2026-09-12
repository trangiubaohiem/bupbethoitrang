const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const OUTFIT_DIR = path.join(__dirname, 'src', 'assets', 'outfits');

function purgeWhitePaperSticker(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  let erasedCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 10) continue;

    // Pure white or near-white (RGB > 215)
    const isPureWhite = (r > 215 && g > 215 && b > 215);
    // Light gray / pastel paper sticker halo (RGB > 190 and low color saturation)
    const maxVal = Math.max(r, g, b);
    const minVal = Math.min(r, g, b);
    const isLowSatWhite = (minVal > 190 && (maxVal - minVal) < 24);

    // Protect warm rosy anime skin tones (R > G, G >= B-20, R > 180, R - B > 25)
    const isSkinTone = (r > 180 && g > 120 && b > 90 && r > g && (r - b) > 25);

    if ((isPureWhite || isLowSatWhite) && !isSkinTone) {
      data[i + 3] = 0; // 100% Transparent
      erasedCount++;
    }
  }

  // Soft Edge Anti-Aliasing for smooth character contours
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      if (data[idx + 3] === 0) continue;

      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const leftA   = data[(y * width + (x - 1)) * 4 + 3];
      const rightA  = data[(y * width + (x + 1)) * 4 + 3];
      const topA    = data[((y - 1) * width + x) * 4 + 3];
      const bottomA = data[((y + 1) * width + x) * 4 + 3];

      if (leftA === 0 || rightA === 0 || topA === 0 || bottomA === 0) {
        if (r > 180 && g > 180 && b > 180) {
          const avg = (r + g + b) / 3;
          data[idx + 3] = Math.max(0, Math.floor((255 - avg) * 2));
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return erasedCount;
}

async function processAllImages() {
  console.log('🚀 Stripping all white paper sticker halos from ALL Outfit PNGs...');

  const files = fs.readdirSync(OUTFIT_DIR).filter(f => f.endsWith('.png'));

  let totalErased = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(OUTFIT_DIR, file);
    try {
      const img = await loadImage(filePath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const erased = purgeWhitePaperSticker(canvas);
      totalErased += erased;

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
      console.log(`[${i + 1}/${files.length}] ✅ Stripped ${erased} sticker pixels -> ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log(`🎉 ALL ${files.length} OUTFIT PNGs STRIPPED! Total erased sticker pixels: ${totalErased}`);
}

processAllImages();
