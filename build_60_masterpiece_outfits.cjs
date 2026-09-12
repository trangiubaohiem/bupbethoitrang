const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');

if (!fs.existsSync(outfitsDir)) {
  fs.mkdirSync(outfitsDir, { recursive: true });
}

// 15 Map Themes with rich curated color palettes & details
const MAP_THEMES = {
  1:  { name: 'Vườn Hoa Pha Lê', baseHue: 340, primary: '#FF7096', secondary: '#FFB7C5', gold: '#FFD700', wingColor: '#FFB6C1', bgName: 'Sakura' },
  2:  { name: 'Bến Cảng Ngọc Trai', baseHue: 185, primary: '#00B4D8', secondary: '#90E0EF', gold: '#F4D06F', wingColor: '#A2D2FF', bgName: 'Ocean' },
  3:  { name: 'Đồi Sao Băng', baseHue: 260, primary: '#7209B7', secondary: '#B5179E', gold: '#FFD166', wingColor: '#C77DFF', bgName: 'Starlight' },
  4:  { name: 'Thị Trấn Kẹo Ngọt', baseHue: 330, primary: '#FF477E', secondary: '#FF85A1', gold: '#FFE5EC', wingColor: '#F72585', bgName: 'Candy' },
  5:  { name: 'Vương Quốc Cổ Tích', baseHue: 300, primary: '#D80032', secondary: '#FFB3C6', gold: '#FFD700', wingColor: '#FFCCD5', bgName: 'Fairy' },
  6:  { name: 'Lâu Đài Hoàng Gia', baseHue: 45,  primary: '#DAA520', secondary: '#FFF8DC', gold: '#FFD700', wingColor: '#F4E285', bgName: 'Royal' },
  7:  { name: 'Rừng Nấm Phép Thuật', baseHue: 140, primary: '#2A9D8F', secondary: '#A8DADC', gold: '#E9C46A', wingColor: '#81B29A', bgName: 'Forest' },
  8:  { name: 'Tháp Đồng Hồ', baseHue: 30,  primary: '#B07D62', secondary: '#E8D8C8', gold: '#F4A261', wingColor: '#E07A5F', bgName: 'Clockwork' },
  9:  { name: 'Thung Lũng Rồng Băng', baseHue: 200, primary: '#48CAE4', secondary: '#ADE8F4', gold: '#E0F1FF', wingColor: '#CAF0F8', bgName: 'Ice' },
  10: { name: 'Mật Thất Kim Tự Tháp', baseHue: 40,  primary: '#E76F51', secondary: '#F4A261', gold: '#FFD700', wingColor: '#EE9B00', bgName: 'Desert' },
  11: { name: 'Ngân Hà Vô Cực', baseHue: 270, primary: '#3F37C9', secondary: '#4895EF', gold: '#FFD166', wingColor: '#7209B7', bgName: 'Galaxy' },
  12: { name: 'Đại Dương Atlantis', baseHue: 170, primary: '#0077B6', secondary: '#00B4D8', gold: '#90E0EF', wingColor: '#48CAE4', bgName: 'Atlantis' },
  13: { name: 'Núi Lửa Thái Dương', baseHue: 15,  primary: '#F77F00', secondary: '#FCBF49', gold: '#EAE2B7', wingColor: '#D62828', bgName: 'Solar' },
  14: { name: 'Tháp Phù Thủy Tinh Tú', baseHue: 280, primary: '#560BAD', secondary: '#7209B7', gold: '#FFD166', wingColor: '#B5179E', bgName: 'Witch' },
  15: { name: 'Đền Thần Vũ Trụ Supreme', baseHue: 320, primary: '#B5179E', secondary: '#7209B7', gold: '#FFD700', wingColor: '#F72585', bgName: 'Supreme' },
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

function renderOutfitSet(mapId, rarity) {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');
  const theme = MAP_THEMES[mapId];

  // 1. Solid Pure White Background #FFFFFF
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 250;

  // 5★ LEGENDARY (HUYỀN THOẠI): Radiant Glowing Halo Aura & Majestic Wings
  if (rarity === 'legendary') {
    // Outer Radiant Aura Glow
    const auraGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 210);
    auraGrad.addColorStop(0, 'rgba(255, 215, 0, 0.45)');
    auraGrad.addColorStop(0.5, 'rgba(255, 133, 162, 0.25)');
    auraGrad.addColorStop(0.8, 'rgba(176, 136, 249, 0.15)');
    auraGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 210, 0, Math.PI * 2);
    ctx.fill();

    // Golden Sun Halo Ring behind Head
    ctx.save();
    ctx.lineWidth = 6;
    ctx.strokeStyle = theme.gold;
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(cx, cy - 80, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Sun Rays on Halo
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const rx1 = cx + Math.cos(a) * 75;
      const ry1 = (cy - 80) + Math.sin(a) * 75;
      const rx2 = cx + Math.cos(a) * 92;
      const ry2 = (cy - 80) + Math.sin(a) * 92;
      ctx.beginPath();
      ctx.moveTo(rx1, ry1);
      ctx.lineTo(rx2, ry2);
      ctx.stroke();
    }
    ctx.restore();

    // Majestic Multi-Feathered Grand Wings
    const drawWings = (side) => {
      ctx.save();
      ctx.translate(cx, cy - 20);
      if (side === -1) ctx.scale(-1, 1);

      // Wing feathers gradient
      const wingGrad = ctx.createLinearGradient(20, -100, 180, 50);
      wingGrad.addColorStop(0, theme.gold);
      wingGrad.addColorStop(0.4, theme.primary);
      wingGrad.addColorStop(1, theme.secondary);

      ctx.fillStyle = wingGrad;
      ctx.strokeStyle = theme.gold;
      ctx.lineWidth = 3;

      // Top Wing Arc
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.bezierCurveTo(40, -120, 140, -150, 190, -90);
      ctx.bezierCurveTo(160, -40, 120, -20, 90, 0);
      ctx.bezierCurveTo(150, 20, 180, 60, 150, 110);
      ctx.bezierCurveTo(110, 80, 70, 40, 20, 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();
    };
    drawWings(1);
    drawWings(-1);
  }

  // 4★ EPIC (SỬ THI): Magical Aura & Ornate Floating Elements
  if (rarity === 'epic') {
    const epicGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, 170);
    epicGrad.addColorStop(0, 'rgba(176, 136, 249, 0.3)');
    epicGrad.addColorStop(0.6, 'rgba(255, 133, 162, 0.15)');
    epicGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = epicGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 170, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- ANIME CHIBI CHARACTER MODEL SILHOUETTE & FEATURES ---

  // Hair Back (Long flowing locks)
  ctx.fillStyle = (rarity === 'legendary') ? '#FFF5CC' : ((rarity === 'epic') ? '#4A2810' : '#8B5A2B');
  ctx.beginPath();
  ctx.arc(cx, cy - 65, 62, Math.PI * 0.8, Math.PI * 0.2);
  ctx.lineTo(cx + 70, cy + 90);
  ctx.lineTo(cx - 70, cy + 90);
  ctx.closePath();
  ctx.fill();

  // Chibi Head / Face
  ctx.fillStyle = '#FFE0D1';
  ctx.beginPath();
  ctx.arc(cx, cy - 65, 48, 0, Math.PI * 2);
  ctx.fill();

  // Cute Blushed Cheeks
  ctx.fillStyle = 'rgba(255, 120, 150, 0.35)';
  ctx.beginPath();
  ctx.arc(cx - 24, cy - 56, 10, 0, Math.PI * 2);
  ctx.arc(cx + 24, cy - 56, 10, 0, Math.PI * 2);
  ctx.fill();

  // Big Anime Eyes
  const drawEye = (ex) => {
    ctx.fillStyle = '#2B1E3A';
    ctx.beginPath();
    ctx.ellipse(ex, cy - 68, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Iris color
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.ellipse(ex, cy - 65, 7, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eye Highlights
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(ex - 3, cy - 72, 4, 0, Math.PI * 2);
    ctx.arc(ex + 3, cy - 62, 2, 0, Math.PI * 2);
    ctx.fill();
  };
  drawEye(cx - 20);
  drawEye(cx + 20);

  // Sweet Smile
  ctx.strokeStyle = '#6E4534';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(cx, cy - 52, 6, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Front Bangs
  ctx.fillStyle = (rarity === 'legendary') ? '#FFF0B3' : ((rarity === 'epic') ? '#593115' : '#A06D3B');
  ctx.beginPath();
  ctx.moveTo(cx - 48, cy - 80);
  ctx.quadraticCurveTo(cx - 20, cy - 50, cx - 10, cy - 70);
  ctx.quadraticCurveTo(cx, cy - 45, cx + 10, cy - 70);
  ctx.quadraticCurveTo(cx + 20, cy - 50, cx + 48, cy - 80);
  ctx.quadraticCurveTo(cx, cy - 118, cx - 48, cy - 80);
  ctx.fill();

  // Pigtails / Buns depending on theme
  ctx.beginPath();
  ctx.arc(cx - 52, cy - 80, 18, 0, Math.PI * 2);
  ctx.arc(cx + 52, cy - 80, 18, 0, Math.PI * 2);
  ctx.fill();

  // --- DRESS & OUTFIT STRUCTURE BY RARITY ---

  // 1. Torso / Bodice
  ctx.fillStyle = theme.primary;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 20);
  ctx.lineTo(cx + 20, cy - 20);
  ctx.lineTo(cx + 25, cy + 30);
  ctx.lineTo(cx - 25, cy + 30);
  ctx.closePath();
  ctx.fill();

  // Bodice Gold Trim & Jewels (Epic & Legendary)
  if (rarity === 'epic' || rarity === 'legendary') {
    ctx.strokeStyle = theme.gold;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Gem Pendant
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FF2E63';
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Skirt Gown Layering
  const skirtGrad = ctx.createLinearGradient(cx, cy + 30, cx, cy + 180);
  skirtGrad.addColorStop(0, theme.secondary);
  skirtGrad.addColorStop(0.5, theme.primary);
  skirtGrad.addColorStop(1, (rarity === 'legendary') ? '#590D82' : theme.primary);

  // Grand Ballgown Flare
  ctx.fillStyle = skirtGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 25, cy + 30);
  ctx.bezierCurveTo(cx - 90, cy + 80, cx - 130, cy + 140, cx - 120, cy + 175);
  ctx.bezierCurveTo(cx - 60, cy + 195, cx + 60, cy + 195, cx + 120, cy + 175);
  ctx.bezierCurveTo(cx + 130, cy + 140, cx + 90, cy + 80, cx + 25, cy + 30);
  ctx.closePath();
  ctx.fill();

  // Extra Ruffle Flounces for Epic & Legendary
  if (rarity === 'epic' || rarity === 'legendary') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let r = -90; r <= 90; r += 30) {
      ctx.beginPath();
      ctx.arc(cx + r, cy + 145, 22, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold Embroidered Hem Trim
    ctx.strokeStyle = theme.gold;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy + 175);
    ctx.bezierCurveTo(cx - 60, cy + 195, cx + 60, cy + 195, cx + 120, cy + 175);
    ctx.stroke();
  }

  // Cute Puffy Sleeves & Arms
  ctx.fillStyle = theme.secondary;
  ctx.beginPath();
  ctx.arc(cx - 28, cy - 12, 14, 0, Math.PI * 2);
  ctx.arc(cx + 28, cy - 12, 14, 0, Math.PI * 2);
  ctx.fill();

  // Hands holding Accessory
  ctx.fillStyle = '#FFE0D1';
  ctx.beginPath();
  ctx.arc(cx - 15, cy + 15, 7, 0, Math.PI * 2);
  ctx.arc(cx + 15, cy + 15, 7, 0, Math.PI * 2);
  ctx.fill();

  // Legs & Cute Shoes
  ctx.fillStyle = '#FFE0D1';
  ctx.fillRect(cx - 16, cy + 170, 10, 30);
  ctx.fillRect(cx + 6, cy + 170, 10, 30);

  ctx.fillStyle = theme.primary;
  ctx.beginPath();
  ctx.arc(cx - 11, cy + 200, 8, 0, Math.PI * 2);
  ctx.arc(cx + 11, cy + 200, 8, 0, Math.PI * 2);
  ctx.fill();

  // --- CROWN & ACCESSORIES BY RARITY ---

  // 5★ LEGENDARY CROWN & STAFF
  if (rarity === 'legendary') {
    // Grand Golden Crown
    ctx.fillStyle = theme.gold;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 108);
    ctx.lineTo(cx - 35, cy - 135);
    ctx.lineTo(cx - 15, cy - 118);
    ctx.lineTo(cx, cy - 145);
    ctx.lineTo(cx + 15, cy - 118);
    ctx.lineTo(cx + 35, cy - 135);
    ctx.lineTo(cx + 30, cy - 108);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Crown Jewels
    ctx.fillStyle = '#FF2E63';
    ctx.beginPath();
    ctx.arc(cx, cy - 132, 4, 0, Math.PI * 2);
    ctx.arc(cx - 28, cy - 125, 3, 0, Math.PI * 2);
    ctx.arc(cx + 28, cy - 125, 3, 0, Math.PI * 2);
    ctx.fill();

    // Royal Magic Scepter / Staff
    ctx.strokeStyle = theme.gold;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx + 45, cy - 50);
    ctx.lineTo(cx + 55, cy + 180);
    ctx.stroke();

    drawStar(ctx, cx + 45, cy - 60, 5, 22, 10, '#FFD700');
    drawSparkle(ctx, cx + 45, cy - 60, 16, '#FFFFFF');
  }

  // 4★ EPIC TIARA / HEADPIECE
  if (rarity === 'epic') {
    ctx.fillStyle = theme.gold;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 100);
    ctx.lineTo(cx - 22, cy - 118);
    ctx.lineTo(cx, cy - 128);
    ctx.lineTo(cx + 22, cy - 118);
    ctx.lineTo(cx + 20, cy - 100);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00E5FF';
    ctx.beginPath();
    ctx.arc(cx, cy - 115, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2★ & 3★ CUTE BOWS
  if (rarity === '2star' || rarity === '3star') {
    ctx.fillStyle = theme.primary;
    ctx.beginPath();
    ctx.arc(cx - 45, cy - 90, 10, 0, Math.PI * 2);
    ctx.arc(cx + 45, cy - 90, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- BLING SPARKLES & GLOWING EFFECT OVERLAY (LEGENDARY & EPIC) ---
  if (rarity === 'legendary') {
    // 12 Sparkling Stars floating all around character
    const sparkles = [
      { x: cx - 140, y: cy - 120, size: 14, color: '#FFD700' },
      { x: cx + 150, y: cy - 110, size: 16, color: '#FFFFFF' },
      { x: cx - 160, y: cy + 40,  size: 18, color: '#FF85A2' },
      { x: cx + 160, y: cy + 50,  size: 15, color: '#7ED7C1' },
      { x: cx - 110, y: cy + 160, size: 12, color: '#FFD700' },
      { x: cx + 110, y: cy + 170, size: 14, color: '#FFFFFF' },
      { x: cx - 70,  y: cy - 170, size: 10, color: '#FFD700' },
      { x: cx + 80,  y: cy - 160, size: 12, color: '#FF85A2' },
    ];

    sparkles.forEach(s => {
      drawSparkle(ctx, s.x, s.y, s.size, s.color);
      drawStar(ctx, s.x, s.y, 4, s.size * 0.8, s.size * 0.3, '#FFFFFF');
    });
  }

  if (rarity === 'epic') {
    const epicSparkles = [
      { x: cx - 110, y: cy - 80, size: 10, color: '#B088F9' },
      { x: cx + 120, y: cy - 70, size: 12, color: '#FF85A2' },
      { x: cx - 130, y: cy + 80, size: 11, color: '#FFD700' },
      { x: cx + 125, y: cy + 90, size: 10, color: '#7ED7C1' },
    ];
    epicSparkles.forEach(s => drawSparkle(ctx, s.x, s.y, s.size, s.color));
  }

  // Output PNG Buffer
  return canvas.toBuffer('image/png');
}

console.log('--- Generating 60 Masterpiece Outfit PNG Sets (4 sets/map x 15 maps) ---');

const rarities = ['2star', '3star', 'epic', 'legendary'];
let count = 0;

for (let map = 1; map <= 15; map++) {
  for (const rarity of rarities) {
    const filename = `set_m${map}_${rarity}.png`;
    const filePath = path.join(outfitsDir, filename);
    const pngBuf = renderOutfitSet(map, rarity);
    fs.writeFileSync(filePath, pngBuf);
    count++;
    console.log(`✓ [${count}/60] Rendered ${filename} (${MAP_THEMES[map].name} - ${rarity.toUpperCase()})`);
  }
}

console.log('🎉 SUCCESSFULLY CREATED ALL 60 MASTERPIECE OUTFIT PNG SETS ON PURE WHITE BACKGROUNDS!');
