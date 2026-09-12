const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');
const rivalsDir = path.join(__dirname, 'src/assets/rivals');

function processWhiteBackground(filePath) {
  const fileBuf = fs.readFileSync(filePath);
  let png;
  try {
    png = PNG.sync.read(fileBuf);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return;
  }

  const width = png.width;
  const height = png.height;
  const pixels = png.data;

  // Sample outer border colors
  const borderColors = [];
  const addSample = (x, y) => {
    const idx = (y * width + x) * 4;
    borderColors.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
  };

  for (let x = 0; x < width; x += 4) {
    addSample(x, 0);
    addSample(x, height - 1);
  }
  for (let y = 0; y < height; y += 4) {
    addSample(0, y);
    addSample(width - 1, y);
  }

  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);
  const queue = [];

  // Edge queue
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
  }

  // Check if pixel is outer background
  const isBackgroundPixel = (x, y) => {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    // 1. Light background (white, off-white, light gray)
    if (minVal > 150 && diff < 50) return true;

    // 2. Dark vignette / background box near borders
    if (maxVal < 75 && diff < 35) return true;

    // 3. Close to any sampled border pixel
    for (const [br, bg, bb] of borderColors) {
      const distSq = (r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2;
      if (distSq < 3600) { // color distance threshold
        return true;
      }
    }

    return false;
  };

  let head = 0;
  while (head < queue.length) {
    const [x, y] = queue[head++];
    const idx1d = y * width + x;
    if (visited[idx1d]) continue;
    visited[idx1d] = 1;

    if (isBackgroundPixel(x, y)) {
      isBg[idx1d] = 1;

      const neighbors = [
        [x + 1, y],
        [x - 1, y],
        [x, y + 1],
        [x, y - 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nIdx1d = ny * width + nx;
          if (!visited[nIdx1d]) {
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  // Set outer background to SOLID PURE WHITE (255, 255, 255, 255)
  // Keep original RGB character color for non-background pixels and set alpha to 255!
  let bgPixels = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx1d = y * width + x;
      const pIdx = (y * width + x) * 4;

      if (isBg[idx1d]) {
        pixels[pIdx] = 255;
        pixels[pIdx + 1] = 255;
        pixels[pIdx + 2] = 255;
        pixels[pIdx + 3] = 255;
        bgPixels++;
      } else {
        // Restore character pixel alpha to 255
        pixels[pIdx + 3] = 255;
      }
    }
  }

  const buffer = PNG.sync.write(png);
  fs.writeFileSync(filePath, buffer);
  console.log(`✓ Restored clean white background for ${path.basename(filePath)} (${bgPixels} bg px set to pure white)`);
}

[outfitsDir, rivalsDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    console.log(`\n--- Restoring Pure White Background for ${dir} (${files.length} files) ---`);
    files.forEach(f => processWhiteBackground(path.join(dir, f)));
  }
});
