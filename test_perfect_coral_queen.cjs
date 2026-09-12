const path = require('path');
const { loadImage, createCanvas } = require('canvas');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8b118b5d-b583-4dc9-80c4-6e8279ec476e';

async function testPerfectCoralQueen() {
  const sourcePath = path.join(ARTIFACT_DIR, 'coral_queen_1789230388141.png');
  const fallbackPath = path.join(ARTIFACT_DIR, 'coral_queen_1789239068408.png');

  let imgPath = fs.existsSync(sourcePath) ? sourcePath : fallbackPath;
  console.log('Loading source image:', imgPath);

  const img = await loadImage(imgPath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;
  const width = img.width;
  const height = img.height;

  // Connected BFS Flood Fill with tolerance
  const visited = new Uint8Array(width * height);
  const queueX = new Int32Array(width * height * 2);
  const queueY = new Int32Array(width * height * 2);
  let head = 0;
  let tail = 0;

  function pushQueue(x, y) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      queueX[tail] = x;
      queueY[tail] = y;
      tail++;
    }
  }

  function isBackgroundPixel(r, g, b) {
    // White background or off-white / light gray canvas background
    return (r > 210 && g > 210 && b > 210) || (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 15 && Math.abs(g - b) < 15);
  }

  // Seed 4 border edges of canvas
  for (let x = 0; x < width; x++) {
    pushQueue(x, 0);
    pushQueue(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    pushQueue(0, y);
    pushQueue(width - 1, y);
  }

  // BFS
  let erasedCount = 0;
  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;

    const pos = y * width + x;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const idx = pos * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    if (isBackgroundPixel(r, g, b)) {
      data[idx + 3] = 0; // Alpha = 0
      erasedCount++;

      pushQueue(x + 1, y);
      pushQueue(x - 1, y);
      pushQueue(x, y + 1);
      pushQueue(x, y - 1);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  console.log(`Erased ${erasedCount} background pixels safely via BFS.`);

  const outPath = path.join(__dirname, 'src', 'assets', 'outfits', 'set_m2_epic.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log('Saved perfect cutout to set_m2_epic.png');
}

testPerfectCoralQueen();
