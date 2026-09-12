const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');

// Flood-fill background isolation to force 100% PURE WHITE #FFFFFF background
function makePureWhiteBg(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // We want to detect outer background pixels and set them to 255, 255, 255, 255
  // Check corner pixels color
  const visited = new Uint8Array(w * h);
  const queue = [];

  // Add all border pixels to queue if they look like background
  for (let x = 0; x < w; x++) {
    queue.push(x, 0);
    queue.push(x, h - 1);
    visited[0 * w + x] = 1;
    visited[(h - 1) * w + x] = 1;
  }
  for (let y = 0; y < h; y++) {
    queue.push(0, y);
    queue.push(w - 1, y);
    visited[y * w + 0] = 1;
    visited[y * w + (w - 1)] = 1;
  }

  // Helper to get color difference from pure white or light pastel bg
  function isBgPixel(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];

    if (a < 20) return true; // Transparent

    // If it's near white or pastel outer bg
    // But character lines are usually dark or saturated
    // We check if pixel is NOT dark/saturated character outline
    // Or if it's very light background
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    // Outer background is typically high brightness or light pastel/gray
    // Character outlines are dark (r,g,b < 150) or high saturation body parts
    if (brightness > 210) return true;
    if (brightness > 180 && sat < 30) return true;

    return false;
  }

  // BFS Flood Fill from edges
  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = (y * w + x) * 4;

    if (isBgPixel(idx)) {
      // Set to pure white #FFFFFF
      data[idx] = 255;
      data[idx + 1] = 255;
      data[idx + 2] = 255;
      data[idx + 3] = 255;

      // Check 4 neighbors
      const neighbors = [
        [x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const nPos = ny * w + nx;
          if (!visited[nPos]) {
            visited[nPos] = 1;
            const nIdx = nPos * 4;
            if (isBgPixel(nIdx)) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

async function processAll() {
  const files = fs.readdirSync(outfitsDir).filter(f => f.endsWith('.png'));
  console.log(`Processing ${files.length} outfit PNG files...`);

  for (const file of files) {
    const filePath = path.join(outfitsDir, file);
    const img = await loadImage(filePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Fill white first
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, img.width, img.height);

    ctx.drawImage(img, 0, 0);

    makePureWhiteBg(canvas);

    fs.writeFileSync(filePath, canvas.toBuffer('image/png'));
    console.log(`✓ Cleaned white background for ${file}`);
  }

  console.log('🎉 ALL OUTFIT BACKGROUNDS CONVERTED TO PURE WHITE #FFFFFF!');
}

processAll().catch(err => console.error(err));
