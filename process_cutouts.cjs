const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');
const rivalsDir = path.join(__dirname, 'src/assets/rivals');

function convertToTransparentPng(filePath) {
  const fileBuf = fs.readFileSync(filePath);
  let width, height, pixels;

  // Check header
  const isJpeg = fileBuf[0] === 0xFF && fileBuf[1] === 0xD8;
  const isPng = fileBuf[0] === 0x89 && fileBuf[1] === 0x50;

  if (isJpeg) {
    const raw = jpeg.decode(fileBuf, { useTolerant: true });
    width = raw.width;
    height = raw.height;
    pixels = raw.data; // Buffer of RGBA
  } else if (isPng) {
    const png = PNG.sync.read(fileBuf);
    width = png.width;
    height = png.height;
    pixels = png.data;
  } else {
    console.log(`Skipping unknown image format: ${filePath}`);
    return;
  }

  // Sample border pixel colors
  const borderColors = [];
  const addSample = (x, y) => {
    const idx = (y * width + x) * 4;
    const a = pixels[idx + 3];
    if (a > 20) {
      borderColors.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
    }
  };

  for (let x = 0; x < width; x += 2) {
    addSample(x, 0);
    addSample(x, height - 1);
  }
  for (let y = 0; y < height; y += 2) {
    addSample(0, y);
    addSample(width - 1, y);
  }

  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);
  const queue = [];

  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
  }

  const isBackgroundPixel = (x, y) => {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];
    const a = pixels[idx + 3];

    if (a < 10) return true; // already transparent

    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    // 1. Bright background (white/off-white/light gray)
    if (minVal > 175 && diff < 45) return true;

    // 2. Dark vignette/background box
    if (maxVal < 80 && diff < 35) return true;

    // 3. Close to border sample colors
    for (const [br, bg, bb] of borderColors) {
      const distSq = (r - br) ** 2 + (g - bg) ** 2 + (b - bb) ** 2;
      if (distSq < 4800) { // ~69 color distance
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

  // Apply transparency and anti-alias edges
  let transparentCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx1d = y * width + x;
      const pIdx = (y * width + x) * 4;

      if (isBg[idx1d]) {
        pixels[pIdx + 3] = 0; // Transparent
        transparentCount++;
      } else {
        // Anti-fringe edge blending
        let bgNeighborCount = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighborCount++;
            }
          }
        }
        if (bgNeighborCount > 0) {
          const alpha = pixels[pIdx + 3];
          pixels[pIdx + 3] = Math.round(alpha * (1 - bgNeighborCount / 12));
        }
      }
    }
  }

  // Create new PNG and write
  const outPng = new PNG({ width, height });
  outPng.data = Buffer.from(pixels);
  const outBuffer = PNG.sync.write(outPng);

  fs.writeFileSync(filePath, outBuffer);
  console.log(`✓ Processed ${path.basename(filePath)} (${transparentCount}/${width * height} px transparent)`);
}

[outfitsDir, rivalsDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    console.log(`\n--- Processing ${dir} (${files.length} files) ---`);
    files.forEach(f => convertToTransparentPng(path.join(dir, f)));
  }
});
