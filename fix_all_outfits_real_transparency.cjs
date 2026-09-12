const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const OUTFIT_DIR = path.join(__dirname, 'src', 'assets', 'outfits');

/**
 * Fast O(1) Queue Outer Flood Fill to convert outer background to Alpha = 0 (100% Transparent)
 */
function makeBackgroundTransparentFast(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const visited = new Uint8Array(width * height);
  // Pre-allocate queue array for O(1) performance
  const queueX = new Int32Array(width * height * 2);
  const queueY = new Int32Array(width * height * 2);
  let head = 0;
  let tail = 0;

  function pushQueue(x, y) {
    queueX[tail] = x;
    queueY[tail] = y;
    tail++;
  }

  function isWhiteOrNearWhite(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a < 10) return true; // Already transparent
    // Background white, off-white, light gray, pastel canvas background space
    return (r > 215 && g > 215 && b > 215);
  }

  // Push all 4 border edges of the canvas
  for (let x = 0; x < width; x++) {
    pushQueue(x, 0);
    pushQueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushQueue(0, y);
    pushQueue(width - 1, y);
  }

  // O(1) Fast BFS
  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const pos = y * width + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    if (isWhiteOrNearWhite(x, y)) {
      const idx = pos * 4;
      data[idx + 3] = 0; // Make Alpha = 0 (100% Transparent)

      pushQueue(x + 1, y);
      pushQueue(x - 1, y);
      pushQueue(x, y + 1);
      pushQueue(x, y - 1);
    }
  }

  // Smooth Edge Anti-Aliasing on character boundaries
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      if (!visited[pos]) {
        const idx = pos * 4;
        const a = data[idx + 3];
        if (a === 0) continue;

        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Check if neighboring pixel is transparent
        const leftA   = data[(y * width + (x - 1)) * 4 + 3];
        const rightA  = data[(y * width + (x + 1)) * 4 + 3];
        const topA    = data[((y - 1) * width + x) * 4 + 3];
        const bottomA = data[((y + 1) * width + x) * 4 + 3];

        if (leftA === 0 || rightA === 0 || topA === 0 || bottomA === 0) {
          if (r > 200 && g > 200 && b > 200) {
            const avg = (r + g + b) / 3;
            data[idx + 3] = Math.max(0, Math.floor((255 - avg) * 2.5));
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

async function convertAllImages() {
  console.log('🚀 Starting Fast O(1) Transparency Conversion for ALL Outfit PNGs...');

  const files = fs.readdirSync(OUTFIT_DIR).filter(f => f.endsWith('.png'));

  let convertedCount = 0;
  for (const file of files) {
    const filePath = path.join(OUTFIT_DIR, file);
    try {
      const img = await loadImage(filePath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      makeBackgroundTransparentFast(canvas);

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
      convertedCount++;
      console.log(`[${convertedCount}/${files.length}] ✅ Made Transparent: ${file}`);
    } catch (err) {
      console.error(`❌ Error converting ${file}:`, err);
    }
  }

  console.log(`🎉 COMPLETED! Converted ${convertedCount} outfit PNG files to 100% REAL TRANSPARENT CUTOUTS!`);
}

convertAllImages();
