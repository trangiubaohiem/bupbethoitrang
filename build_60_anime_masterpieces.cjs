const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const artDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const srcAssets = path.join(__dirname, 'src/assets');
const outfitsDir = path.join(srcAssets, 'outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// 63 High-quality anime chibi illustration source files
const ART_FILES = {
  // Map 1: Vườn Hoa Pha Lê (Sakura / Flower / Pink)
  m1_2star: path.join(srcAssets, 'characters/pink_dress.png'),
  m1_3star: path.join(artDir, 'cherry_blossom_1789239142500.png'),
  m1_epic: path.join(artDir, 'outfit_cherry_blossom_1789230370782.png'),
  m1_legendary: path.join(artDir, 'outfit_legendary_sakura_goddess_1789232667601.png'),

  // Map 2: Bến Cảng Ngọc Trai (Ocean / Pearl / Coral)
  m2_2star: path.join(srcAssets, 'characters/blue_dress.png'),
  m2_3star: path.join(srcAssets, 'rivals/rival_1.png'), // Sailor Anime Girl
  m2_epic: path.join(artDir, 'outfit_coral_queen_1789230388141.png'),
  m2_legendary: path.join(artDir, 'coral_queen_1789239068408.png'),

  // Map 3: Đồi Sao Băng (Starlight / Meteor / Purple)
  m3_2star: path.join(srcAssets, 'characters/purple_dress.png'),
  m3_3star: path.join(artDir, 'starlight_dress_1789239095701.png'),
  m3_epic: path.join(artDir, 'outfit_meteor_mage_1789231320463.png'),
  m3_legendary: path.join(artDir, 'outfit_legendary_starlight_sovereign_1789232696790.png'),

  // Map 4: Thị Trấn Kẹo Ngọt (Candy / Sugar / Dessert)
  m4_2star: path.join(artDir, 'doll_pink_isolated_1789230212801.png'),
  m4_3star: path.join(artDir, 'outfit_strawberry_chef_1789230432903.png'),
  m4_epic: path.join(artDir, 'outfit_sweet_candy_1789231332109.png'),
  m4_legendary: path.join(artDir, 'outfit_legendary_sugar_empress_1789232713535.png'),

  // Map 5: Vương Quốc Cổ Tích (Fairy / Butterfly / Forest)
  m5_2star: path.join(srcAssets, 'characters/mint_dress.png'),
  m5_3star: path.join(artDir, 'fairy_flower_1789239116593.png'),
  m5_epic: path.join(artDir, 'outfit_forest_elf_1789230489852.png'),
  m5_legendary: path.join(artDir, 'outfit_legendary_forest_archgoddess_1789232730923.png'),

  // Map 6: Lâu Đài Hoàng Gia (Royal Castle / Gold / Empress)
  m6_2star: path.join(srcAssets, 'characters/gold_royal.png'),
  m6_3star: path.join(srcAssets, 'rivals/rival_5.png'), // Royal Princess
  m6_epic: path.join(artDir, 'outfit_empress_golden_1789230452848.png'),
  m6_legendary: path.join(artDir, 'outfit_valkyrie_gold_1789232088302.png'),

  // Map 7: Rừng Nấm Phép Thuật (Mushroom / Nature)
  m7_2star: path.join(srcAssets, 'characters/red_casual.png'),
  m7_3star: path.join(artDir, 'mushroom_fairy_1789239169256.png'),
  m7_epic: path.join(artDir, 'outfit_mushroom_fairy_1789230470196.png'),
  m7_legendary: path.join(artDir, 'outfit_crystal_flower_queen_1789232553797.png'),

  // Map 8: Tháp Đồng Hồ (Clockwork / Steampunk / Vintage)
  m8_2star: path.join(srcAssets, 'characters/tshirt_skirt.png'),
  m8_3star: path.join(artDir, 'outfit_time_traveller_1789230510049.png'),
  m8_epic: path.join(artDir, 'outfit_steampunk_1789230530363.png'),
  m8_legendary: path.join(artDir, 'outfit_clockwork_angel_1789231349683.png'),

  // Map 9: Thung Lũng Rồng Băng (Ice Dragon / Frost)
  m9_2star: path.join(srcAssets, 'rivals/rival_8.png'), // Frost Maid
  m9_3star: path.join(artDir, 'outfit_frost_knight_1789230570513.png'),
  m9_epic: path.join(artDir, 'outfit_ice_dragon_1789230547932.png'),
  m9_legendary: path.join(artDir, 'outfit_frost_goddess_supreme_1789232167361.png'),

  // Map 10: Mật Thất Kim Tự Tháp (Pyramid / Pharaoh / Egyptian)
  m10_2star: path.join(srcAssets, 'rivals/rival_9.png'), // Desert Maiden
  m10_3star: path.join(artDir, 'outfit_desert_pharaoh_1789230586508.png'),
  m10_epic: path.join(artDir, 'outfit_pyramid_priestess_1789231362865.png'),
  m10_legendary: path.join(artDir, 'outfit_cleopatra_1789230618389.png'),

  // Map 11: Ngân Hà Vô Cực (Galaxy / Star / Cosmic)
  m11_2star: path.join(srcAssets, 'rivals/rival_10.png'), // Star Maiden
  m11_3star: path.join(artDir, 'outfit_starlight_1789230406350.png'),
  m11_epic: path.join(artDir, 'outfit_cosmic_goddess_1789230650866.png'),
  m11_legendary: path.join(artDir, 'outfit_celestial_empress_1789232057665.png'),

  // Map 12: Đại Dương Atlantis (Atlantis / Deep Ocean / Dragoness)
  m12_2star: path.join(srcAssets, 'rivals/rival_2.png'), // Mermaid Girl
  m12_3star: path.join(srcAssets, 'rivals/rival_3.png'), // Ocean Princess
  m12_epic: path.join(artDir, 'outfit_ocean_empress_1789232570158.png'),
  m12_legendary: path.join(artDir, 'outfit_legendary_ocean_dragoness_1789232682664.png'),

  // Map 13: Núi Lửa Thái Dương (Solar / Phoenix / Sun)
  m13_2star: path.join(srcAssets, 'rivals/rival_4.png'), // Flame Maiden
  m13_3star: path.join(artDir, 'outfit_dragon_empress_1789232072417.png'),
  m13_epic: path.join(artDir, 'outfit_solar_phoenix_1789230676502.png'),
  m13_legendary: path.join(artDir, 'outfit_sun_goddess_celestial_1789232181701.png'),

  // Map 14: Tháp Phù Thủy Tinh Tú (Witch / Astral)
  m14_2star: path.join(srcAssets, 'rivals/rival_6.png'), // Witch Girl
  m14_3star: path.join(srcAssets, 'rivals/rival_7.png'), // Star Witch
  m14_epic: path.join(artDir, 'outfit_meteor_empress_1789232587525.png'),
  m14_legendary: path.join(artDir, 'outfit_universe_sovereignty_1789232152308.png'),

  // Map 15: Đền Thần Vũ Trụ Supreme (Supreme / Cosmic Goddess)
  m15_2star: path.join(srcAssets, 'doll_lily.png'),
  m15_3star: path.join(artDir, 'outfit_candy_queen_supreme_1789232603454.png'),
  m15_epic: path.join(artDir, 'outfit_sun_goddess_celestial_1789233536329.png'),
  m15_legendary: path.join(artDir, 'outfit_universe_sovereignty_1789233507143.png'),
};

const THEME_COLORS = {
  1: { primary: '#FF6B8B', gold: '#FFD700', wing: '#FFB6C1' },
  2: { primary: '#00B4D8', gold: '#F4D06F', wing: '#A2D2FF' },
  3: { primary: '#7209B7', gold: '#FFD166', wing: '#C77DFF' },
  4: { primary: '#FF477E', gold: '#FFE5EC', wing: '#F72585' },
  5: { primary: '#2A9D8F', gold: '#FFD700', wing: '#81B29A' },
  6: { primary: '#DAA520', gold: '#FFD700', wing: '#F4E285' },
  7: { primary: '#E76F51', gold: '#E9C46A', wing: '#F4A261' },
  8: { primary: '#B07D62', gold: '#F4A261', wing: '#E07A5F' },
  9: { primary: '#48CAE4', gold: '#E0F1FF', wing: '#CAF0F8' },
  10: { primary: '#E76F51', gold: '#FFD700', wing: '#EE9B00' },
  11: { primary: '#3F37C9', gold: '#FFD166', wing: '#7209B7' },
  12: { primary: '#0077B6', gold: '#90E0EF', wing: '#48CAE4' },
  13: { primary: '#F77F00', gold: '#EAE2B7', wing: '#D62828' },
  14: { primary: '#560BAD', gold: '#FFD166', wing: '#B5179E' },
  15: { primary: '#B5179E', gold: '#FFD700', wing: '#F72585' },
};

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

async function renderAnimeOutfit(key, mapId, rarity) {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  const theme = THEME_COLORS[mapId];

  // 1. Solid Pure White Background #FFFFFF
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;

  // 2. BACKGROUND EFFECTS & AURAS BY RARITY
  if (rarity === 'legendary') {
    // Outer Radiant Aura Glow
    const auraGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 220);
    auraGrad.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
    auraGrad.addColorStop(0.5, 'rgba(255, 133, 162, 0.25)');
    auraGrad.addColorStop(0.8, 'rgba(176, 136, 249, 0.15)');
    auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 220, 0, Math.PI * 2);
    ctx.fill();

    // Golden Sun Halo Ring
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = theme.gold;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(cx, cy - 70, 80, 0, Math.PI * 2);
    ctx.stroke();

    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx1 = cx + Math.cos(a) * 80;
      const ry1 = (cy - 70) + Math.sin(a) * 80;
      const rx2 = cx + Math.cos(a) * 98;
      const ry2 = (cy - 70) + Math.sin(a) * 98;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }
    ctx.restore();

    // Majestic Wings behind anime character
    const drawWing = (side) => {
      ctx.save();
      ctx.translate(cx, cy - 10);
      if (side === -1) ctx.scale(-1, 1);

      const wingGrad = ctx.createLinearGradient(20, -120, 200, 60);
      wingGrad.addColorStop(0, theme.gold);
      wingGrad.addColorStop(0.5, theme.wing);
      wingGrad.addColorStop(1, '#FFF5CC');

      ctx.fillStyle = wingGrad;
      ctx.strokeStyle = theme.gold;
      ctx.lineWidth = 3.5;

      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.bezierCurveTo(40, -140, 150, -170, 210, -100);
      ctx.bezierCurveTo(180, -40, 130, -20, 100, 0);
      ctx.bezierCurveTo(160, 30, 190, 70, 160, 120);
      ctx.bezierCurveTo(120, 90, 80, 50, 20, 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };
    drawWing(1);
    drawWing(-1);
  } else if (rarity === 'epic') {
    // Epic Magical Glow
    const epicGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 180);
    epicGrad.addColorStop(0, 'rgba(176, 136, 249, 0.35)');
    epicGrad.addColorStop(0.6, 'rgba(255, 133, 162, 0.2)');
    epicGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = epicGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. DRAW REAL ANIME CHIBI ILLUSTRATION
  const imgPath = ART_FILES[key];
  if (fs.existsSync(imgPath)) {
    const img = await loadImage(imgPath);
    
    // Fit into 440x440 box centered
    const maxDim = 440;
    let w = img.width;
    let h = img.height;
    const scale = Math.min(maxDim / w, maxDim / h);
    w = w * scale;
    h = h * scale;

    const dx = cx - w / 2;
    const dy = cy - h / 2 + 10;

    ctx.drawImage(img, dx, dy, w, h);
  }

  // 4. OVERLAY GLITTER & SPARKLING BLING EFFECTS
  if (rarity === 'legendary') {
    const sparkles = [
      { x: cx - 160, y: cy - 140, size: 16, color: '#FFD700' },
      { x: cx + 170, y: cy - 130, size: 18, color: '#FFFFFF' },
      { x: cx - 180, y: cy + 30,  size: 20, color: '#FF85A2' },
      { x: cx + 180, y: cy + 40,  size: 16, color: '#7ED7C1' },
      { x: cx - 130, y: cy + 170, size: 14, color: '#FFD700' },
      { x: cx + 140, y: cy + 180, size: 16, color: '#FFFFFF' },
      { x: cx - 80,  y: cy - 190, size: 12, color: '#FFD700' },
      { x: cx + 90,  y: cy - 180, size: 14, color: '#FF85A2' },
    ];

    sparkles.forEach(s => {
      drawSparkle(ctx, s.x, s.y, s.size, s.color);
      drawStar(ctx, s.x, s.y, 4, s.size * 0.85, s.size * 0.35, '#FFFFFF');
    });
  } else if (rarity === 'epic') {
    const sparkles = [
      { x: cx - 130, y: cy - 100, size: 12, color: '#B088F9' },
      { x: cx + 140, y: cy - 90,  size: 14, color: '#FF85A2' },
      { x: cx - 140, y: cy + 100, size: 12, color: '#FFD700' },
      { x: cx + 145, y: cy + 110, size: 11, color: '#7ED7C1' },
    ];
    sparkles.forEach(s => drawSparkle(ctx, s.x, s.y, s.size, s.color));
  } else if (rarity === '3star') {
    const sparkles = [
      { x: cx - 120, y: cy - 110, size: 10, color: '#FFD700' },
      { x: cx + 130, y: cy - 100, size: 10, color: '#FFFFFF' },
      { x: cx - 120, y: cy + 120, size: 9,  color: '#FF85A2' },
      { x: cx + 120, y: cy + 130, size: 9,  color: '#7ED7C1' },
    ];
    sparkles.forEach(s => drawSparkle(ctx, s.x, s.y, s.size, s.color));
  }

  const mapNum = mapId;
  const filename = `set_m${mapNum}_${rarity}.png`;
  const outPath = path.join(outfitsDir, filename);
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(outPath, buf);
  console.log(`✓ Rendered ${filename} using ${path.basename(imgPath)}`);
}

async function main() {
  console.log('--- Generating 60 ANIME CHIBI Outfit PNG Sets on White Background ---');
  const rarities = ['2star', '3star', 'epic', 'legendary'];

  for (let map = 1; map <= 15; map++) {
    for (const rarity of rarities) {
      const key = `m${map}_${rarity}`;
      await renderAnimeOutfit(key, map, rarity);
    }
  }

  console.log('🎉 ALL 60 ANIME CHIBI OUTFITS RENDERED SUCCESSFULLY!');
}

main().catch(err => console.error(err));
