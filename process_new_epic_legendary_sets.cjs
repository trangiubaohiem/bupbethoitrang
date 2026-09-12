const fs = require('fs');
const path = require('path');
const { loadImage, createCanvas } = require('canvas');

const ARTIFACT_DIR = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const OUTFIT_DIR = path.join(__dirname, 'src', 'assets', 'outfits');

const NEW_MAP = {
  m14_legendary: 'gen_new_m14_legendary_1789245333686.png',
  m15_legendary: 'gen_new_m15_legendary_1789245350350.png',
  m15_epic:      'gen_new_m15_epic_1789245366525.png',
  m13_epic:      'gen_new_m13_epic_1789245382125.png',
};

async function processStep2PureWhiteRemoval(srcFile, destFile) {
  const srcPath = path.join(ARTIFACT_DIR, srcFile);
  const destPath = path.join(OUTFIT_DIR, destFile);

  const img = await loadImage(srcPath);
  const w = img.width, h = img.height;
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, w, h);
  const pixels = imgData.data;

  // Step 2: Strip outer white background (#FFFFFF)
  let removedCount = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Check pure white studio background (#FFFFFF)
    if (r >= 242 && g >= 242 && b >= 242) {
      pixels[i + 3] = 0; // 100% transparent!
      removedCount++;
    }
  }

  // Edge feathering for ultra-smooth anti-aliased character edges
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx1d = y * w + x;
      const pIdx = idx1d * 4;
      if (pixels[pIdx + 3] > 0) {
        let transparentNeighbors = 0;
        if (pixels[(idx1d - 1) * 4 + 3] === 0) transparentNeighbors++;
        if (pixels[(idx1d + 1) * 4 + 3] === 0) transparentNeighbors++;
        if (pixels[(idx1d - w) * 4 + 3] === 0) transparentNeighbors++;
        if (pixels[(idx1d + w) * 4 + 3] === 0) transparentNeighbors++;

        if (transparentNeighbors >= 2) {
          pixels[pIdx + 3] = Math.round(pixels[pIdx + 3] * 0.45);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  fs.writeFileSync(destPath, canvas.toBuffer('image/png'));
  console.log(`✅ [Step 2 Complete] ${destFile}: Removed ${removedCount} background pixels (${(removedCount / (w * h) * 100).toFixed(1)}%)`);
}

async function runStep2ForAllNewSets() {
  console.log('🚀 Processing Step 2 (Pure White Background Removal) on new Epic & Legendary sets...');
  for (const id in NEW_MAP) {
    const srcFile = NEW_MAP[id];
    const destFile = `set_${id}.png`;
    await processStep2PureWhiteRemoval(srcFile, destFile);
  }
  console.log('🎉 ALL NEW EPIC & LEGENDARY SETS PROCESSED WITH STEP 2 FLAWLESS CUTOUT!');
}

runStep2ForAllNewSets();
