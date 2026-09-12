const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');
const rivalsDir = path.join(__dirname, 'src/assets/rivals');

// List of freshly generated AI images that should NOT be touched
const protectedFiles = [
  'coral_queen.png',
  'starlight.png',
  'fairy_flower.png',
  'cherry_blossom.png',
  'mushroom_fairy.png',
  'default_pink.png',
  'ocean_mermaid.png',
];

function processSmartWhite(filePath) {
  const filename = path.basename(filePath);
  if (protectedFiles.includes(filename)) {
    console.log(`Skipping fresh/protected file: ${filename}`);
    return;
  }

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

  // Sample outer border colors (top, bottom, left, right edges)
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

  // Calculate average border background color
  let sumR = 0, sumG = 0, sumB = 0;
  borderColors.forEach(([r, g, b]) => {
    sumR += r; sumG += g; sumB += b;
  });
  const avgR = Math.round(sumR / borderColors.length);
  const avgG = Math.round(sumG / borderColors.length);
  const avgB = Math.round(sumB / borderColors.length);

  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);
  const queue = [];

  // Start BFS ONLY from 4 outer edges
  for (let x = 0; x < width; x++) {
    queue.push([x, 0]);
    queue.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    queue.push([0, y]);
    queue.push([width - 1, y]);
  }

  // Strict background matching condition so flood fill NEVER leaks into character
  const isEdgeBackground = (x, y) => {
    const idx = (y * width + x) * 4;
    const r = pixels[idx];
    const g = pixels[idx + 1];
    const b = pixels[idx + 2];

    // Distance to average border background color
    const distSq = (r - avgR) ** 2 + (g - avgG) ** 2 + (b - avgB) ** 2;

    // Tight threshold: only fill pixels that are very close to border background color (or pure white/off-white)
    if (distSq < 1600) return true;

    // Off-white / pure white outer edge
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    if (minVal > 220 && (maxVal - minVal) < 20) return true;

    // Dark outer vignette border
    if (maxVal < 45 && (maxVal - minVal) < 20) return true;

    return false;
  };

  let head = 0;
  while (head < queue.length) {
    const [x, y] = queue[head++];
    const idx1d = y * width + x;
    if (visited[idx1d]) continue;
    visited[idx1d] = 1;

    if (isEdgeBackground(x, y)) {
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
  // Character pixels remain 100% untouched vibrant colors with alpha 255
  let bgCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx1d = y * width + x;
      const pIdx = (y * width + x) * 4;

      if (isBg[idx1d]) {
        pixels[pIdx] = 255;
        pixels[pIdx + 1] = 255;
        pixels[pIdx + 2] = 255;
        pixels[pIdx + 3] = 255;
        bgCount++;
      } else {
        pixels[pIdx + 3] = 255;
      }
    }
  }

  const outPng = new PNG({ width, height });
  outPng.data = Buffer.from(pixels);
  const outBuf = PNG.sync.write(outPng);

  fs.writeFileSync(filePath, outBuf);
  console.log(`✓ Smart white background applied to ${filename} (${bgCount} outer bg px)`);
}

[outfitsDir, rivalsDir].forEach(dir => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
    console.log(`\n--- Smart White Background Processing for ${dir} (${files.length} files) ---`);
    files.forEach(f => processSmartWhite(path.join(dir, f)));
  }
});
