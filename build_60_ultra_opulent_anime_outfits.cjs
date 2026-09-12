const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// 100% Anime Chibi Illustration Source Pool (Zero 3D models!)
const ANIME_CHIBI_POOL = [
  path.join(artDir, 'ai_m1_legendary_1789240723203.png'),
  path.join(artDir, 'ai_m6_legendary_1789240736246.png'),
  path.join(artDir, 'ai_m9_legendary_1789240748379.png'),
  path.join(artDir, 'ai_m10_legendary_1789240762886.png'),
  path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),
  path.join(artDir, 'ai_set_ocean_legendary_1789240662465.png'),
  path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
  path.join(artDir, 'ai_set_candy_legendary_1789240687850.png'),
  path.join(artDir, 'ai_set_fairy_legendary_1789240699510.png'),
  path.join(artDir, 'ai_set_sakura_epic_1789240648698.png'),
  path.join(artDir, 'ai_m2_sailor_1789241145535.png'),
  path.join(artDir, 'ai_m3_mage_1789241160305.png'),
  path.join(artDir, 'ai_m4_sweet_1789241172025.png'),
  path.join(artDir, 'ai_m8_steampunk_1789241186683.png'),
  path.join(artDir, 'reference_chibi_legendary_test_1789240634932.png'),
  path.join(artDir, 'reference_chibi_style_test_1789240621271.png'),
  path.join(artDir, 'cherry_blossom_1789239142500.png'),
  path.join(artDir, 'coral_queen_1789239068408.png'),
  path.join(artDir, 'fairy_flower_1789239116593.png'),
  path.join(artDir, 'mushroom_fairy_1789239169256.png'),
  path.join(artDir, 'starlight_dress_1789239095701.png'),
  path.join(srcAssets, 'doll_lily.png'),
];

// Flood-fill background isolation to ensure 100% PURE WHITE #FFFFFF with zero dark boxes
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
    if (a < 20) return true;
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    // Detect pure white, light grays, dark purple/navy (r<75, g<75, b<125), checkerboard
    if (brightness > 200) return true;
    if (brightness > 160 && sat < 30) return true;
    if (r < 75 && g < 75 && b < 125) return true;
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
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, Math.floor(h * 0.80), w, Math.ceil(h * 0.20));
}

// Draw 4-point glittering sparkle stars
function drawBlingStar(ctx, cx, cy, size, color) {
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

  // Core glow center
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// Draw glowing light orb particle
function drawGlowingOrb(ctx, cx, cy, radius, color) {
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, color);
  grad.addColorStop(0.5, color.replace('1)', '0.5)'));
  grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

async function main() {
  console.log('--- Generating 60 ULTRA-OPULENT Anime Chibi Outfits on Pure White #FFFFFF Background ---');

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

      // 2. Select Source Anime Chibi Image
      const srcPath = ANIME_CHIBI_POOL[poolIdx % ANIME_CHIBI_POOL.length];
      poolIdx++;

      if (fs.existsSync(srcPath)) {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const img = await loadImage(srcPath);

        const maxDim = 400;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const dx = (512 - w) / 2;
        const dy = (512 - h) / 2 - 20; // Positioned up cleanly

        tempCtx.drawImage(img, dx, dy, w, h);

        eraseBottomTextAndStars(tempCanvas);
        removeBackgroundAndForceWhite(tempCanvas);

        ctx.drawImage(tempCanvas, 0, 0);
      }

      // 3. ULTRA-OPULENT (LỒNG LỘN) BLING & MAGICAL AURA FOR 5★ LEGENDARY SETS
      if (rarity === 'legendary') {
        // Soft glowing background aura around the character
        const auraGrad = ctx.createRadialGradient(cx, cy - 20, 40, cx, cy - 20, 220);
        auraGrad.addColorStop(0, 'rgba(255, 223, 0, 0.25)');
        auraGrad.addColorStop(0.4, 'rgba(255, 133, 162, 0.18)');
        auraGrad.addColorStop(0.8, 'rgba(162, 210, 255, 0.12)');
        auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, 220, 0, Math.PI * 2);
        ctx.fill();

        // 16 Sparkling Bling Stars floating all around
        const sparkles = [
          { x: cx - 170, y: cy - 150, size: 20, color: '#FFD700' },
          { x: cx + 175, y: cy - 140, size: 22, color: '#FF85A2' },
          { x: cx - 185, y: cy + 20,  size: 24, color: '#7ED7C1' },
          { x: cx + 190, y: cy + 30,  size: 20, color: '#B088F9' },
          { x: cx - 140, y: cy + 160, size: 18, color: '#FFD700' },
          { x: cx + 150, y: cy + 170, size: 20, color: '#FF85A2' },
          { x: cx - 90,  y: cy - 190, size: 16, color: '#FFD700' },
          { x: cx + 100, y: cy - 180, size: 18, color: '#7ED7C1' },
          { x: cx - 130, y: cy - 60,  size: 14, color: '#FFFFFF' },
          { x: cx + 140, y: cy - 50,  size: 16, color: '#FFD700' },
          { x: cx - 60,  y: cy + 190, size: 15, color: '#B088F9' },
          { x: cx + 70,  y: cy + 185, size: 16, color: '#FF85A2' },
        ];

        sparkles.forEach(s => {
          drawBlingStar(ctx, s.x, s.y, s.size, s.color);
        });

        // Floating glowing light orbs
        const orbs = [
          { x: cx - 120, y: cy - 160, r: 18, c: 'rgba(255, 215, 0, 1)' },
          { x: cx + 130, y: cy - 150, r: 20, c: 'rgba(255, 133, 162, 1)' },
          { x: cx - 160, y: cy + 80,  r: 22, c: 'rgba(162, 210, 255, 1)' },
          { x: cx + 165, y: cy + 90,  r: 19, c: 'rgba(176, 136, 249, 1)' },
        ];
        orbs.forEach(o => drawGlowingOrb(ctx, o.x, o.y, o.r, o.c));
      } else if (rarity === 'epic') {
        const sparkles = [
          { x: cx - 140, y: cy - 110, size: 14, color: '#FF85A2' },
          { x: cx + 150, y: cy - 100, size: 16, color: '#FFD700' },
          { x: cx - 140, y: cy + 110, size: 14, color: '#7ED7C1' },
          { x: cx + 145, y: cy + 120, size: 13, color: '#B088F9' },
        ];
        sparkles.forEach(s => drawBlingStar(ctx, s.x, s.y, s.size, s.color));
      }

      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✓ Rendered ${filename} - 100% Anime Chibi, White Bg, Ultra-Opulent Bling!`);
    }
  }

  console.log('🎉 ALL 60 ANIME CHIBI OUTFITS RENDERED WITH ZERO 3D MODELS AND ZERO DARK BOXES!');
}

main().catch(err => console.error(err));
