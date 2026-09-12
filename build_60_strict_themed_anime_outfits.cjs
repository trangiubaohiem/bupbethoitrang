const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// STRICT MAP THEME MAPPING (Zero cross-theme mismatches!)
const MAP_THEME_ARTWORK = {
  // MAP 1: Vườn Hoa Pha Lê (Sakura / Cherry Blossom / Pink Flowers)
  m1_2star: path.join(artDir, 'cherry_blossom_1789239142500.png'),
  m1_3star: path.join(artDir, 'ai_set_sakura_epic_1789240648698.png'),
  m1_epic: path.join(artDir, 'cherry_blossom_1789239142500.png'),
  m1_legendary: path.join(artDir, 'map1_sakura_legendary_1789241301397.png'),

  // MAP 2: Bến Cảng Ngọc Trai (Ocean / Pearl / Sailor / Coral)
  m2_2star: path.join(srcAssets, 'rivals/rival_1.png'),
  m2_3star: path.join(artDir, 'ai_m2_sailor_1789241145535.png'),
  m2_epic: path.join(artDir, 'coral_queen_1789239068408.png'),
  m2_legendary: path.join(artDir, 'map2_ocean_legendary_1789241319175.png'),

  // MAP 3: Đồi Sao Băng (Starlight / Meteor / Purple Mage)
  m3_2star: path.join(srcAssets, 'rivals/rival_10.png'),
  m3_3star: path.join(artDir, 'starlight_dress_1789239095701.png'),
  m3_epic: path.join(artDir, 'ai_m3_mage_1789241160305.png'),
  m3_legendary: path.join(artDir, 'map3_starlight_legendary_1789241334722.png'),

  // MAP 4: Thị Trấn Kẹo Ngọt (Candy / Dessert / Strawberry)
  m4_2star: path.join(srcAssets, 'doll_lily.png'),
  m4_3star: path.join(artDir, 'doll_pink_isolated_1789230212801.png'),
  m4_epic: path.join(artDir, 'ai_m4_sweet_1789241172025.png'),
  m4_legendary: path.join(artDir, 'ai_set_candy_legendary_1789240687850.png'),

  // MAP 5: Vương Quốc Cổ Tích (Fairy / Forest / Butterfly)
  m5_2star: path.join(srcAssets, 'rivals/rival_7.png'),
  m5_3star: path.join(srcAssets, 'rivals/rival_4.png'),
  m5_epic: path.join(artDir, 'fairy_flower_1789239116593.png'),
  m5_legendary: path.join(artDir, 'ai_set_fairy_legendary_1789240699510.png'),

  // MAP 6: Lâu Đài Hoàng Gia (Royal Castle / Gold / Palace Empress)
  m6_2star: path.join(srcAssets, 'rivals/rival_5.png'),
  m6_3star: path.join(artDir, 'reference_chibi_style_test_1789240621271.png'),
  m6_epic: path.join(artDir, 'reference_chibi_legendary_test_1789240634932.png'),
  m6_legendary: path.join(artDir, 'ai_m6_legendary_1789240736246.png'),

  // MAP 7: Rừng Nấm Phép Thuật (Mushroom Fairy / Nature)
  m7_2star: path.join(srcAssets, 'rivals/rival_6.png'),
  m7_3star: path.join(srcAssets, 'rivals/rival_3.png'),
  m7_epic: path.join(artDir, 'mushroom_fairy_1789239169256.png'),
  m7_legendary: path.join(artDir, 'map7_mushroom_legendary_1789241351388.png'),

  // MAP 8: Tháp Đồng Hồ (Clockwork / Steampunk)
  m8_2star: path.join(srcAssets, 'rivals/rival_2.png'),
  m8_3star: path.join(srcAssets, 'rivals/rival_8.png'),
  m8_epic: path.join(artDir, 'ai_m8_steampunk_1789241186683.png'),
  m8_legendary: path.join(artDir, 'ai_m8_steampunk_1789241186683.png'),

  // MAP 9: Thung Lũng Rồng Băng (Ice Dragon / Frost Goddess)
  m9_2star: path.join(srcAssets, 'rivals/rival_9.png'),
  m9_3star: path.join(srcAssets, 'rivals/rival_9.png'),
  m9_epic: path.join(artDir, 'ai_m9_legendary_1789240748379.png'),
  m9_legendary: path.join(artDir, 'ai_m9_legendary_1789240748379.png'),

  // MAP 10: Mật Thất Kim Tự Tháp (Pyramid / Pharaoh / Cleopatra)
  m10_2star: path.join(artDir, 'ai_m10_legendary_1789240762886.png'),
  m10_3star: path.join(artDir, 'ai_m10_legendary_1789240762886.png'),
  m10_epic: path.join(artDir, 'ai_m10_legendary_1789240762886.png'),
  m10_legendary: path.join(artDir, 'ai_m10_legendary_1789240762886.png'),

  // MAP 11: Ngân Hà Vô Cực (Infinity Galaxy / Nebula)
  m11_2star: path.join(srcAssets, 'rivals/rival_10.png'),
  m11_3star: path.join(artDir, 'starlight_dress_1789239095701.png'),
  m11_epic: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
  m11_legendary: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),

  // MAP 12: Đại Dương Atlantis (Atlantis Ocean / Mermaid / Aquamarine)
  m12_2star: path.join(srcAssets, 'rivals/rival_1.png'),
  m12_3star: path.join(artDir, 'coral_queen_1789239068408.png'),
  m12_epic: path.join(artDir, 'map2_ocean_legendary_1789241319175.png'),
  m12_legendary: path.join(artDir, 'map2_ocean_legendary_1789241319175.png'),

  // MAP 13: Núi Lửa Thái Dương (Solar Phoenix / Sun Goddess)
  m13_2star: path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),
  m13_3star: path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),
  m13_epic: path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),
  m13_legendary: path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),

  // MAP 14: Tháp Phù Thủy Tinh Tú (Star Witch / Astral Witch)
  m14_2star: path.join(artDir, 'map14_witch_legendary_1789241367673.png'),
  m14_3star: path.join(artDir, 'map14_witch_legendary_1789241367673.png'),
  m14_epic: path.join(artDir, 'map14_witch_legendary_1789241367673.png'),
  m14_legendary: path.join(artDir, 'map14_witch_legendary_1789241367673.png'),

  // MAP 15: Đền Thần Vũ Trụ Supreme (Supreme Cosmic Goddess)
  m15_2star: path.join(artDir, 'reference_chibi_legendary_test_1789240634932.png'),
  m15_3star: path.join(artDir, 'ai_m6_legendary_1789240736246.png'),
  m15_epic: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
  m15_legendary: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
};

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

    if (brightness > 195) return true;
    if (brightness > 155 && sat < 30) return true;
    if (r < 80 && g < 80 && b < 130) return true;
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

// Erase printed text labels & 5-star badges near bottom
function eraseBottomTextAndStars(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, Math.floor(h * 0.78), w, Math.ceil(h * 0.22));
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

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

async function main() {
  console.log('--- Generating 60 STRICT THEMED Anime Chibi Outfits on Pure White Background ---');

  const rarities = ['2star', '3star', 'epic', 'legendary'];

  for (let map = 1; map <= 15; map++) {
    for (const rarity of rarities) {
      const key = `m${map}_${rarity}`;
      const filename = `set_m${map}_${rarity}.png`;
      const outPath = path.join(outfitsDir, filename);

      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');

      // 1. Solid Pure White #FFFFFF Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 512, 512);

      const cx = 256;
      const cy = 256;

      const srcPath = MAP_THEME_ARTWORK[key];

      if (fs.existsSync(srcPath)) {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const img = await loadImage(srcPath);

        const maxDim = 390;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const dx = (512 - w) / 2;
        const dy = (512 - h) / 2 - 25; // Positioned up cleanly away from bottom

        tempCtx.drawImage(img, dx, dy, w, h);

        eraseBottomTextAndStars(tempCanvas);
        removeBackgroundAndForceWhite(tempCanvas);

        ctx.drawImage(tempCanvas, 0, 0);
      }

      // 2. ULTRA-OPULENT BLING FOR LEGENDARY SETS (NO face ring, NO text, NO stars)
      if (rarity === 'legendary') {
        const auraGrad = ctx.createRadialGradient(cx, cy - 25, 40, cx, cy - 25, 210);
        auraGrad.addColorStop(0, 'rgba(255, 223, 0, 0.22)');
        auraGrad.addColorStop(0.5, 'rgba(255, 133, 162, 0.15)');
        auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 25, 210, 0, Math.PI * 2);
        ctx.fill();

        const sparkles = [
          { x: cx - 165, y: cy - 145, size: 20, color: '#FFD700' },
          { x: cx + 170, y: cy - 135, size: 22, color: '#FF85A2' },
          { x: cx - 175, y: cy + 30,  size: 22, color: '#7ED7C1' },
          { x: cx + 180, y: cy + 40,  size: 20, color: '#B088F9' },
          { x: cx - 135, y: cy + 155, size: 18, color: '#FFD700' },
          { x: cx + 145, y: cy + 165, size: 20, color: '#FF85A2' },
          { x: cx - 85,  y: cy - 185, size: 16, color: '#FFD700' },
          { x: cx + 95,  y: cy - 175, size: 18, color: '#7ED7C1' },
        ];
        sparkles.forEach(s => drawBlingStar(ctx, s.x, s.y, s.size, s.color));
      } else if (rarity === 'epic') {
        const sparkles = [
          { x: cx - 135, y: cy - 105, size: 14, color: '#FF85A2' },
          { x: cx + 145, y: cy - 95,  size: 16, color: '#FFD700' },
          { x: cx - 135, y: cy + 105, size: 14, color: '#7ED7C1' },
          { x: cx + 140, y: cy + 115, size: 13, color: '#B088F9' },
        ];
        sparkles.forEach(s => drawBlingStar(ctx, s.x, s.y, s.size, s.color));
      }

      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✓ Rendered Map ${map} (${rarity.toUpperCase()}) -> ${filename}`);
    }
  }

  console.log('🎉 ALL 60 STRICT THEMED OUTFITS RENDERED ACCORDING TO MAP THEME!');
}

main().catch(err => console.error(err));
