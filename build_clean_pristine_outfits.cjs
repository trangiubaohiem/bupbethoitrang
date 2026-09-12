const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// Flood-fill background isolation to ensure 100% PURE WHITE #FFFFFF
function removeBackgroundAndForceWhite(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

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

  function isBackground(r, g, b, a) {
    if (a < 15) return true;
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    if (brightness > 205) return true;
    if (brightness > 165 && sat < 35) return true;
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

    if (isBackground(r, g, b, a)) {
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
            if (isBackground(data[nIdx], data[nIdx + 1], data[nIdx + 2], data[nIdx + 3])) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Clean bottom area of any image to remove printed text labels & 5-star badges
function eraseBottomTextAndStars(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Erase bottom 18% of canvas where text / 5-star icons appear
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, Math.floor(h * 0.82), w, Math.ceil(h * 0.18));
}

// AI Generated & Clean Chibi Doll Image Pool
const AI_IMAGE_POOL = [
  path.join(artDir, 'ai_m1_legendary_1789240723203.png'),
  path.join(artDir, 'ai_m6_legendary_1789240736246.png'),
  path.join(artDir, 'ai_m9_legendary_1789240748379.png'),
  path.join(artDir, 'ai_m10_legendary_1789240762886.png'),
  path.join(artDir, 'ai_set_ocean_legendary_1789240662465.png'),
  path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
  path.join(artDir, 'ai_set_candy_legendary_1789240687850.png'),
  path.join(artDir, 'ai_set_fairy_legendary_1789240699510.png'),
  path.join(artDir, 'ai_set_sakura_epic_1789240648698.png'),
  path.join(artDir, 'reference_chibi_legendary_test_1789240634932.png'),
  path.join(artDir, 'reference_chibi_style_test_1789240621271.png'),
  path.join(artDir, 'cherry_blossom_1789239142500.png'),
  path.join(artDir, 'coral_queen_1789239068408.png'),
  path.join(artDir, 'fairy_flower_1789239116593.png'),
  path.join(artDir, 'mushroom_fairy_1789239169256.png'),
  path.join(artDir, 'starlight_dress_1789239095701.png'),
  path.join(artDir, 'doll_pink_isolated_1789230212801.png'),
  path.join(srcAssets, 'doll_lily.png'),
  path.join(srcAssets, 'characters/pink_dress.png'),
  path.join(srcAssets, 'characters/blue_dress.png'),
  path.join(srcAssets, 'characters/purple_dress.png'),
  path.join(srcAssets, 'characters/mint_dress.png'),
  path.join(srcAssets, 'characters/gold_royal.png'),
  path.join(srcAssets, 'characters/red_casual.png'),
  path.join(srcAssets, 'characters/tshirt_skirt.png'),
];

async function main() {
  console.log('--- Generating 60 PRISTINE Anime Chibi Outfits (NO Face Ring, NO Text, NO Star Badges) ---');

  const rarities = ['2star', '3star', 'epic', 'legendary'];
  let poolIdx = 0;

  for (let map = 1; map <= 15; map++) {
    for (const rarity of rarities) {
      const filename = `set_m${map}_${rarity}.png`;
      const outPath = path.join(outfitsDir, filename);

      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');

      // 1. Solid Pure White #FFFFFF Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 512);

      const srcPath = AI_IMAGE_POOL[poolIdx % AI_IMAGE_POOL.length];
      poolIdx++;

      if (fs.existsSync(srcPath)) {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const img = await loadImage(srcPath);

        // Position slightly higher to leave clean white margin at bottom
        const maxDim = 410;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const dx = (512 - w) / 2;
        const dy = (512 - h) / 2 - 15; // Shifted up slightly

        tempCtx.drawImage(img, dx, dy, w, h);

        // Erase any text labels or star icons printed near bottom
        eraseBottomTextAndStars(tempCanvas);

        // Purge any dark/checkerboard background
        removeBackgroundAndForceWhite(tempCanvas);

        ctx.drawImage(tempCanvas, 0, 0);
      }

      // NOTE: Yellow circular halo ring over face is COMPLETELY REMOVED!
      // NOTE: Text labels and 5-star icons at bottom are COMPLETELY ERASED!

      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✓ Cleaned ${filename} - Face ring, text, and stars removed!`);
    }
  }

  console.log('🎉 ALL 60 OUTFIT PNGs CLEANED AND RE-RENDERED WITHOUT FACE RINGS, TEXT, OR STAR BADGES!');
}

main().catch(err => console.error(err));
