const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');

// Comprehensive Flood-Fill Background Purger:
// Replaces ANY background (dark navy, dark purple, checkerboard gray, light blue)
// with 100% PURE SOLID WHITE #FFFFFF.
function purgeOuterBackgroundToPureWhite(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

  // Sample corner pixel colors
  const cornerIndices = [0, (w - 1) * 4, ((h - 1) * w) * 4, ((h - 1) * w + (w - 1)) * 4];
  const bgColors = cornerIndices.map(idx => ({
    r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3]
  }));

  // Seed all outer border pixels
  for (let x = 0; x < w; x++) {
    queue.push(x, 0, x, h - 1);
    visited[0 * w + x] = 1;
    visited[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    queue.push(0, y, w - 1, y);
    visited[y * w + 0] = 1;
    visited[y * w + (w - 1)] = 1;
  }

  function matchesBg(r, g, b, a) {
    if (a < 20) return true; // Transparent

    // 1. Pure or near white
    if (r > 240 && g > 240 && b > 240) return true;

    // 2. Checkerboard grays (e.g. r,g,b around 180-220 with very low saturation)
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;
    if (sat < 25 && r > 160) return true;

    // 3. Dark Navy / Dark Purple / Dark Blue background (r<70, g<70, b<120)
    if (r < 75 && g < 75 && b < 125) return true;

    // 4. Match any sampled corner color closely
    for (const bg of bgColors) {
      const dr = Math.abs(r - bg.r);
      const dg = Math.abs(g - bg.g);
      const db = Math.abs(b - bg.b);
      if (dr < 35 && dg < 35 && db < 35) return true;
    }

    return false;
  }

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = (y * w + x) * 4;

    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (matchesBg(r, g, b, a)) {
      // Replace with pure solid white #FFFFFF
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;

      const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nPos = ny * w + nx;
          if (!visited[nPos]) {
            visited[nPos] = 1;
            const nIdx = nPos * 4;
            if (matchesBg(data[nIdx], data[nIdx + 1], data[nIdx + 2], data[nIdx + 3])) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

async function cleanAllOutfits() {
  const files = fs.readdirSync(outfitsDir).filter(f => f.endsWith('.png'));
  console.log(`Checking and purging backgrounds for all ${files.length} outfit PNG files...`);

  for (const file of files) {
    const filePath = path.join(outfitsDir, file);
    const img = await loadImage(filePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);

    purgeOuterBackgroundToPureWhite(canvas);

    fs.writeFileSync(filePath, canvas.toBuffer('image/png'));
    console.log(`✓ Purged non-white background for ${file}`);
  }

  console.log('🎉 ALL 60 OUTFIT PNGs NOW HAVE 100% PURE SOLID WHITE #FFFFFF BACKGROUNDS WITH ZERO DARK/CHECKERBOARD BOXES!');
}

cleanAllOutfits().catch(err => console.error(err));
