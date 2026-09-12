const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const OUTFIT_DIR = path.join(__dirname, 'src', 'assets', 'outfits');

// Outer Flood Fill transparent background generator
function makeCanvasBackgroundTransparent(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const visited = new Uint8Array(width * height);
  const queue = [];

  function isBackgroundWhite(x, y) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a < 10) return true; // Already transparent
    // Match white, off-white, light gray, or light pastel canvas background tint
    return (r > 225 && g > 225 && b > 225);
  }

  // Seed BFS queue from all 4 canvas boundary edges
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
  }

  // Outer Flood Fill BFS
  while (queue.length > 0) {
    const [x, y] = queue.shift();
    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const pos = y * width + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    if (isBackgroundWhite(x, y)) {
      const idx = pos * 4;
      data[idx + 3] = 0; // Set Alpha to 0 (100% Transparent)

      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  }

  // Soft Edge Anti-Aliasing for smooth character contours
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const pos = y * width + x;
      if (!visited[pos]) {
        const idx = pos * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        if (a === 0) continue;

        // Check if neighboring pixel is transparent
        const neighbors = [
          (y * width + (x - 1)) * 4 + 3,
          (y * width + (x + 1)) * 4 + 3,
          ((y - 1) * width + x) * 4 + 3,
          ((y + 1) * width + x) * 4 + 3
        ];
        const hasTransparentNeighbor = neighbors.some(n => data[n] === 0);

        if (hasTransparentNeighbor && r > 210 && g > 210 && b > 210) {
          const brightness = (r + g + b) / 3;
          const alpha = Math.max(0, Math.floor((255 - brightness) * 2.5));
          data[idx + 3] = alpha;
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

async function processAllOutfitPNGs() {
  console.log('✨ Converting all outfit PNGs to 100% TRANSPARENT CUTOUTS...');

  const files = fs.readdirSync(OUTFIT_DIR).filter(f => f.endsWith('.png'));

  for (const file of files) {
    const filePath = path.join(OUTFIT_DIR, file);
    try {
      const img = await loadImage(filePath);
      const canvas = createCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, 0, 0);
      makeCanvasBackgroundTransparent(canvas);

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(filePath, buffer);
      console.log(`✅ Converted to Transparent Cutout -> ${file}`);
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }

  console.log('🎉 ALL OUTFIT PNGs ARE NOW 100% TRANSPARENT CUTOUTS!');
}

processAllOutfitPNGs();
