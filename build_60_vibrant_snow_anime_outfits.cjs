const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// 100% STRICT MAP THEME & UNIQUE OUTFIT ASSIGNMENTS
const OUTFIT_MAP = {
  // MAP 1: Vườn Hoa Pha Lê (Sakura / Flower / Pink)
  m1_2star: path.join(artDir, 'cherry_blossom_1789239142500.png'),
  m1_3star: path.join(artDir, 'ai_set_sakura_epic_1789240648698.png'),
  m1_epic: path.join(artDir, 'gen_m1_epic_1789241667481.png'),
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

  // MAP 7: Rừng Nấm Phép Thuật (Mushroom Cap Fairies)
  m7_2star: path.join(srcAssets, 'rivals/rival_6.png'),
  m7_3star: path.join(artDir, 'mushroom_fairy_1789239169256.png'),
  m7_epic: path.join(artDir, 'clean_m7_mushroom_epic_1789241455761.png'),
  m7_legendary: path.join(artDir, 'map7_mushroom_legendary_1789241351388.png'),

  // MAP 8: Tháp Đồng Hồ (Clockwork / Steampunk)
  m8_2star: path.join(srcAssets, 'rivals/rival_2.png'),
  m8_3star: path.join(srcAssets, 'rivals/rival_8.png'),
  m8_epic: path.join(artDir, 'ai_m8_steampunk_1789241186683.png'),
  m8_legendary: path.join(artDir, 'gen_m8_legendary_1789241690786.png'),

  // MAP 9: Thung Lũng Rồng Băng (Ice Dragon / Frost Goddess)
  m9_2star: path.join(artDir, 'gen_m9_2star_1789241708824.png'),
  m9_3star: path.join(artDir, 'clean_m12_atlantis_epic_1789241493162.png'),
  m9_epic: path.join(artDir, 'ai_m9_legendary_1789240748379.png'),
  m9_legendary: path.join(artDir, 'ai_m9_legendary_1789240748379.png'),

  // MAP 10: Mật Thất Kim Tự Tháp (Pyramid / Pharaoh / Cleopatra)
  m10_2star: path.join(artDir, 'gen_m10_2star_1789241610523.png'),
  m10_3star: path.join(artDir, 'gen_m10_3star_1789241630307.png'),
  m10_epic: path.join(artDir, 'gen_m10_epic_1789241647998.png'),
  m10_legendary: path.join(artDir, 'ai_m10_legendary_1789240762886.png'),

  // MAP 11: Ngân Hà Vô Cực (Infinity Galaxy / Star Princess)
  m11_2star: path.join(srcAssets, 'rivals/rival_10.png'),
  m11_3star: path.join(artDir, 'starlight_dress_1789239095701.png'),
  m11_epic: path.join(artDir, 'clean_m11_galaxy_epic_1789241474591.png'),
  m11_legendary: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),

  // MAP 12: Đại Dương Atlantis (Atlantis Ocean / Coral Queen)
  m12_2star: path.join(srcAssets, 'rivals/rival_1.png'),
  m12_3star: path.join(artDir, 'coral_queen_1789239068408.png'),
  m12_epic: path.join(artDir, 'clean_m12_atlantis_epic_1789241493162.png'),
  m12_legendary: path.join(artDir, 'map2_ocean_legendary_1789241319175.png'),

  // MAP 13: Núi Lửa Thái Dương (Solar Phoenix / Sun Goddess)
  m13_2star: path.join(artDir, 'gen_m13_2star_1789241857508.png'),
  m13_3star: path.join(artDir, 'gen_m13_3star_1789241880980.png'),
  m13_epic: path.join(artDir, 'clean_m13_solar_epic_1789241511040.png'),
  m13_legendary: path.join(artDir, 'ai_m13_phoenix_1789241202455.png'),

  // MAP 14: Tháp Phù Thủy Tinh Tú (Star Witch / Astral Witch)
  m14_2star: path.join(artDir, 'gen_m14_2star_1789241901017.png'),
  m14_3star: path.join(artDir, 'gen_m14_3star_1789241923129.png'),
  m14_epic: path.join(artDir, 'ai_m3_mage_1789241160305.png'),
  m14_legendary: path.join(artDir, 'map14_witch_legendary_1789241367673.png'),

  // MAP 15: Đền Thần Vũ Trụ Supreme (Supreme Cosmic Goddess)
  m15_2star: path.join(artDir, 'gen_m15_2star_1789241945271.png'),
  m15_3star: path.join(artDir, 'gen_m15_3star_1789241967003.png'),
  m15_epic: path.join(artDir, 'clean_m11_galaxy_epic_1789241474591.png'),
  m15_legendary: path.join(artDir, 'ai_set_starlight_legendary_1789240675721.png'),
};

// Skin tone color warming & vibrancy correction
function enhanceSkinToneAndVibrance(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 30) continue;

    // Detect skin tones (light peachy/yellowish pixels)
    const isSkin = (r > 160 && g > 130 && b > 100 && r >= g && g >= b * 0.9 && (r - b) > 20);

    if (isSkin) {
      // Boost red and add rosy pink blush tone, reducing greenish cast
      data[i] = Math.min(255, Math.floor(r * 1.08 + 10));
      data[i + 1] = Math.max(0, Math.floor(g * 0.96));
      data[i + 2] = Math.min(255, Math.floor(b * 0.98 + 12));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Flood fill background purger (removes dark purple, navy, checkerboard gray to 100% white)
function purgeOuterBackgroundToPureWhite(canvas) {
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

  function isBgPixel(r, g, b, a) {
    if (a < 20) return true;
    const brightness = (r + g + b) / 3;
    const maxC = Math.max(r, g, b);
    const minC = Math.min(r, g, b);
    const sat = maxC - minC;

    if (brightness > 195) return true;
    if (brightness > 150 && sat < 30) return true;
    if (r < 85 && g < 85 && b < 135) return true;
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

    if (isBgPixel(r, g, b, a)) {
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
            if (isBgPixel(data[nIdx], data[nIdx + 1], data[nIdx + 2], data[nIdx + 3])) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Clean printed badges without damaging character feet
function cleanPrintedBadges(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  for (let y = 0; y < h; y++) {
    const isBadgeZone = (y > h * 0.72) || (y < h * 0.20);
    if (!isBadgeZone) continue;

    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const isPinkBadge = (r > 200 && g < 130 && b > 140);
      const isSideGoldStar = (x < 120 || x > 392) && (r > 220 && g > 170 && b < 100);

      if (isPinkBadge || isSideGoldStar) {
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Draw 6-arm crystal snowflake
function drawSnowflake(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, size * 0.15);
  ctx.lineCap = 'round';

  for (let i = 0; i < 6; i++) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size);

    ctx.moveTo(0, -size * 0.55);
    ctx.lineTo(size * 0.32, -size * 0.8);
    ctx.moveTo(0, -size * 0.55);
    ctx.lineTo(-size * 0.32, -size * 0.8);
    ctx.stroke();
  }

  ctx.restore();
}

// Draw 4-point sparkling bling star
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
  console.log('--- Generating 60 VIBRANT SNOW & CRYSTAL BLING Anime Chibi Outfits ---');

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

      const srcPath = OUTFIT_MAP[key];

      if (fs.existsSync(srcPath)) {
        const tempCanvas = createCanvas(512, 512);
        const tempCtx = tempCanvas.getContext('2d');
        const img = await loadImage(srcPath);

        const maxDim = 360;
        const scale = Math.min(maxDim / img.width, maxDim / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const dx = (512 - w) / 2;
        const dy = (512 - h) / 2 - 20;

        tempCtx.drawImage(img, dx, dy, w, h);

        cleanPrintedBadges(tempCanvas);
        purgeOuterBackgroundToPureWhite(tempCanvas);
        enhanceSkinToneAndVibrance(tempCanvas);

        ctx.drawImage(tempCanvas, 0, 0);
      }

      // 2. ICE / OCEAN SNOWFLAKE & CRYSTAL BLING OVERLAY FOR MAP 9 (ICE), MAP 2 & 12 (OCEAN), MAP 11 (GALAXY)
      const isIceOrOceanMap = (map === 9 || map === 2 || map === 12 || map === 11 || map === 1);

      if (isIceOrOceanMap || rarity === 'legendary') {
        // Floating Crystal Snowflakes
        const snowflakes = [
          { x: cx - 170, y: cy - 140, size: 14, color: '#00E5FF' },
          { x: cx + 180, y: cy - 130, size: 16, color: '#B2EBF2' },
          { x: cx - 185, y: cy + 40,  size: 15, color: '#80DEEA' },
          { x: cx + 190, y: cy + 50,  size: 14, color: '#FFFFFF' },
          { x: cx - 125, y: cy + 175, size: 12, color: '#00B0FF' },
          { x: cx + 135, y: cy + 185, size: 13, color: '#E0F7FA' },
        ];
        snowflakes.forEach(sf => drawSnowflake(ctx, sf.x, sf.y, sf.size, sf.color));
      }

      // 3. ULTRA-OPULENT BLING FOR LEGENDARY SETS
      if (rarity === 'legendary') {
        const auraGrad = ctx.createRadialGradient(cx, cy - 20, 30, cx, cy - 20, 200);
        auraGrad.addColorStop(0, 'rgba(255, 223, 0, 0.22)');
        auraGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.15)');
        auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy - 20, 200, 0, Math.PI * 2);
        ctx.fill();

        const sparkles = [
          { x: cx - 165, y: cy - 145, size: 20, color: '#FFD700' },
          { x: cx + 170, y: cy - 135, size: 22, color: '#FF85A2' },
          { x: cx - 175, y: cy + 30,  size: 22, color: '#00E5FF' },
          { x: cx + 180, y: cy + 40,  size: 20, color: '#B088F9' },
          { x: cx - 135, y: cy + 155, size: 18, color: '#FFD700' },
          { x: cx + 145, y: cy + 165, size: 20, color: '#80DEEA' },
          { x: cx - 85,  y: cy - 185, size: 16, color: '#FFD700' },
          { x: cx + 95,  y: cy - 175, size: 18, color: '#00E5FF' },
        ];
        sparkles.forEach(s => drawBlingStar(ctx, s.x, s.y, s.size, s.color));
      } else if (rarity === 'epic') {
        const sparkles = [
          { x: cx - 135, y: cy - 105, size: 14, color: '#FF85A2' },
          { x: cx + 145, y: cy - 95,  size: 16, color: '#FFD700' },
          { x: cx - 135, y: cy + 105, size: 14, color: '#00E5FF' },
          { x: cx + 140, y: cy + 115, size: 13, color: '#B088F9' },
        ];
        sparkles.forEach(s => drawBlingStar(ctx, s.x, s.y, s.size, s.color));
      }

      fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
      console.log(`✓ Enhanced Map ${map} (${rarity.toUpperCase()}) -> ${filename}`);
    }
  }

  console.log('🎉 ALL 60 ANIME CHIBI OUTFITS ENHANCED WITH ROSY SKIN & CRYSTAL SNOWFLAKES!');
}

main().catch(err => console.error(err));
