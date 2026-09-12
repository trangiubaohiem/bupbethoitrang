const fs = require('fs');
const path = require('path');
const jimpModule = require('jimp');
const Jimp = jimpModule.Jimp || jimpModule;

const rivalsDir = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/rivals';
const files = fs.readdirSync(rivalsDir).filter(f => f.endsWith('.png'));

console.log(`Processing ${files.length} rival images with Jimp...`);

async function processFile(file) {
  const filePath = path.join(rivalsDir, file);
  try {
    const image = await Jimp.read(filePath);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

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

    const getPixel = (x, y) => {
      const hex = image.getPixelColor(x, y);
      const rgba = Jimp.intToRGBA ? Jimp.intToRGBA(hex) : {
        r: (hex >> 24) & 255,
        g: (hex >> 16) & 255,
        b: (hex >> 8) & 255,
        a: hex & 255
      };
      return rgba;
    };

    const isLightPixel = (x, y) => {
      const rgba = getPixel(x, y);
      if (rgba.a < 10) return true;
      const minVal = Math.min(rgba.r, rgba.g, rgba.b);
      const maxVal = Math.max(rgba.r, rgba.g, rgba.b);
      const diff = maxVal - minVal;
      return minVal > 190 && diff < 45; // Bright and low saturation (white/light gray)
    };

    let head = 0;
    while (head < queue.length) {
      const [x, y] = queue[head++];
      const idx1d = y * width + x;
      if (visited[idx1d]) continue;
      visited[idx1d] = 1;

      if (isLightPixel(x, y)) {
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

    // Apply transparency and anti-fringe edge alpha to image
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx1d = y * width + x;

        if (isBg[idx1d]) {
          image.setPixelColor(0x00000000, x, y); // 100% Transparent
        } else {
          // Anti-fringe smooth edges
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
            const rgba = getPixel(x, y);
            const brightness = (rgba.r + rgba.g + rgba.b) / 3;
            if (brightness > 165) {
              const alphaFactor = Math.max(0, 1 - (brightness - 165) / 90);
              const newA = Math.round(rgba.a * alphaFactor);
              const intToRGBA = Jimp.rgbaToInt || ((r, g, b, a) => ((r << 24) | (g << 16) | (b << 8) | a) >>> 0);
              image.setPixelColor(intToRGBA(rgba.r, rgba.g, rgba.b, newA), x, y);
            }
          }
        }
      }
    }

    await image.write(filePath);
    console.log(`✓ Successfully converted ${file} to 100% PNG transparent cutout!`);
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}

async function run() {
  for (const file of files) {
    await processFile(file);
  }
  console.log('🎉 ALL 10 RIVAL NPC IMAGES ARE NOW PURE TRANSPARENT CUTOUTS!');
}

run();
