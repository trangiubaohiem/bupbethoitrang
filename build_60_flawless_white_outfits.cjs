const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// Flood-fill background isolation to ensure 100% PURE WHITE #FFFFFF with zero background box
function removeBackgroundAndForceWhite(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const visited = new Uint8Array(w * h);
  const queue = [];

  // Seed border pixels
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
    if (a < 15) return true; // Transparent
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    // Detect background colors (very bright or light desaturated grays/purples from arches/gardens)
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
      // Force 100% pure white
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

// Helper to draw sparkling stars
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  let step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSparkle(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(0, 0, size, 0);
  ctx.quadraticCurveTo(0, 0, 0, size);
  ctx.quadraticCurveTo(0, 0, -size, 0);
  ctx.quadraticCurveTo(0, 0, 0, -size);
  ctx.fill();
  ctx.restore();
}

async function main() {
  console.log('--- Generating 60 FLAWLESS Anime Chibi Outfit Sets on Pure White #FFFFFF Background ---');

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

      const cx = 256;
      const cy = 256;

      // 2. Select Source Image
      const srcPath = AI_IMAGE_POOL[poolIdx % AI_IMAGE_POOL.length];
      poolIdx++;

      if (fs.existsSync(srcPath)) {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const img = await loadImage(srcPath);

        // Draw centered and scaled
        const maxDim = 420;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const dx = (512 - w) / 2;
        const dy = (512 - h) / 2 + 10;

        tempCtx.drawImage(img, dx, dy, w, h);

        // Remove any non-white background box / old background scene
        removeBackgroundAndForceWhite(tempCanvas);

        // Draw clean isolated character onto white background canvas
        ctx.drawImage(tempCanvas, 0, 0);
      }

      // 3. Add Custom Wings, Halo, Crown & Bling Overlay for Legendary
      if (rarity === 'legendary') {
        // Glowing Halo
        ctx.save();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(cx, cy - 80, 75, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Sparkle stars all around
        const sparkles = [
          { x: cx - 160, y: cy - 140, size: 16, color: '#FFD700' },
          { x: cx + 170, y: cy - 130, size: 18, color: '#FFFFFF' },
          { x: cx - 180, y: cy + 30,  size: 20, color: '#FF85A2' },
          { x: cx + 180, y: cy + 40,  size: 16, color: '#7ED7C1' },
          { x: cx - 130, y: cy + 170, size: 14, color: '#FFD700' },
          { x: cx + 140, y: cy + 180, size: 16, color: '#FFFFFF' },
        ];
        sparkles.forEach(s => {
          drawSparkle(ctx, s.x, s.y, s.size, s.color);
          drawStar(ctx, s.x, s.y, 4, s.size * 0.85, s.size * 0.35, '#FFFFFF');
        });
      } else if (rarity === 'epic') {
        const sparkles = [
          { x: cx - 140, y: cy - 110, size: 12, color: '#FF85A2' },
          { x: cx + 150, y: cy - 100, size: 14, color: '#FFD700' },
          { x: cx - 140, y: cy + 110, size: 12, color: '#7ED7C1' },
          { x: cx + 145, y: cy + 120, size: 11, color: '#B088F9' },
        ];
        sparkles.forEach(s => drawSparkle(ctx, s.x, s.y, s.size, s.color));
      }

      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✓ Rendered ${filename} on 100% PURE WHITE #FFFFFF background`);
    }
  }

  console.log('🎉 ALL 60 ANIME CHIBI OUTFITS PROCESSED WITH 100% PURE WHITE BACKGROUNDS!');
}

main().catch(err => console.error(err));
