const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const rivalsDir = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/rivals';
const files = fs.readdirSync(rivalsDir).filter(f => f.endsWith('.png'));

console.log(`Processing ${files.length} rival images...`);

async function processFile(file) {
  const filePath = path.join(rivalsDir, file);
  const data = fs.readFileSync(filePath);

  return new Promise((resolve, reject) => {
    new PNG().parse(data, (error, png) => {
      if (error) {
        console.error(`Error parsing ${file}:`, error);
        return resolve();
      }

      const width = png.width;
      const height = png.height;
      const pixels = png.data;

      const visited = new Uint8Array(width * height);
      const isBg = new Uint8Array(width * height);

      const queue = [];

      // Add all border pixels to queue
      for (let x = 0; x < width; x++) {
        queue.push([x, 0]);
        queue.push([x, height - 1]);
      }
      for (let y = 0; y < height; y++) {
        queue.push([0, y]);
        queue.push([width - 1, y]);
      }

      const isLightPixel = (idx) => {
        const r = pixels[idx];
        const g = pixels[idx + 1];
        const b = pixels[idx + 2];
        const a = pixels[idx + 3];
        if (a < 10) return true; // Already transparent
        // Check if pixel is white/off-white background
        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const diff = maxVal - minVal;
        return minVal > 195 && diff < 40; // Bright and low saturation (white/light gray)
      };

      let head = 0;
      while (head < queue.length) {
        const [x, y] = queue[head++];
        const idx1d = y * width + x;
        if (visited[idx1d]) continue;
        visited[idx1d] = 1;

        const pIdx = (y * width + x) * 4;
        if (isLightPixel(pIdx)) {
          isBg[idx1d] = 1;

          // Check 4 neighbors
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

      // Apply transparency and anti-fringe edge smoothing to background pixels
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx1d = y * width + x;
          const pIdx = (y * width + x) * 4;

          if (isBg[idx1d]) {
            pixels[pIdx + 3] = 0; // Make 100% transparent
          } else {
            // Anti-fringe: check if neighboring background
            let bgNeighbors = 0;
            const checkRange = 2;
            for (let dy = -checkRange; dy <= checkRange; dy++) {
              for (let dx = -checkRange; dx <= checkRange; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                  if (isBg[ny * width + nx]) bgNeighbors++;
                }
              }
            }

            if (bgNeighbors > 0) {
              const r = pixels[pIdx];
              const g = pixels[pIdx + 1];
              const b = pixels[pIdx + 2];
              const brightness = (r + g + b) / 3;

              // If edge pixel is light, blend alpha smoothly
              if (brightness > 170) {
                const alphaFactor = Math.max(0, 1 - (brightness - 170) / 85);
                pixels[pIdx + 3] = Math.round(pixels[pIdx + 3] * alphaFactor);
              }
            }
          }
        }
      }

      const buffer = PNG.sync.write(png);
      fs.writeFileSync(filePath, buffer);
      console.log(`✓ Processed transparent background for ${file}`);
      resolve();
    });
  });
}

async function run() {
  for (const file of files) {
    await processFile(file);
  }
  console.log('All NPC rival images converted to pure PNG transparent cutouts!');
}

run();
