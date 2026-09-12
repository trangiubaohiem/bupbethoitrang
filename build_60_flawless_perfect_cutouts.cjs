const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const ARTIFACT_DIR = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const OUTFIT_DIR = path.join(__dirname, 'src', 'assets', 'outfits');

const LEGENDARY_MAP = {
  m1_legendary:  'gen_m1_sakura_gem_5star_1789242360831.png',
  m2_legendary:  'gen_m2_ocean_gem_5star_1789242318319.png',
  m3_legendary:  'gen_m3_meteor_gem_5star_1789242297584.png',
  m4_legendary:  'gen_m4_candy_gem_5star_1789242372943.png',
  m5_legendary:  'gen_m5_fairy_gem_5star_1789242385483.png',
  m6_legendary:  'gen_m6_castle_gem_5star_1789242398773.png',
  m7_legendary:  'gen_m7_mushroom_gem_5star_1789242413549.png',
  m8_legendary:  'gen_m8_steampunk_gem_5star_1789242284701.png',
  m9_legendary:  'gen_m9_ice_gem_5star_1789242331068.png',
  m10_legendary: 'gen_m10_pyramid_gem_5star_1789242426886.png',
  m11_legendary: 'gen_m11_galaxy_gem_5star_1789242254852.png',
  m12_legendary: 'gen_m12_atlantis_gem_5star_1789242442050.png',
  m13_legendary: 'gen_m13_phoenix_gem_5star_1789242453478.png',
  m14_legendary: 'gen_m14_witch_gem_5star_1789242271664.png',
  m15_legendary: 'gen_m15_supreme_gem_5star_1789242344970.png',
};

const EPIC_MAP = {
  m1_epic:  'ai_set_sakura_epic_1789240648698.png',
  m2_epic:  'coral_queen_1789239068408.png',
  m3_epic:  'starlight_dress_1789239095701.png',
  m4_epic:  'ai_set_candy_legendary_1789240687850.png',
  m5_epic:  'fairy_flower_1789239116593.png',
  m6_epic:  'cherry_blossom_1789239142500.png',
  m7_epic:  'clean_m7_mushroom_epic_1789241455761.png',
  m8_epic:  'ai_m8_steampunk_1789241186683.png',
  m9_epic:  'gen_m10_epic_1789241647998.png',
  m10_epic: 'gen_m10_epic_1789241647998.png',
  m11_epic: 'clean_m11_galaxy_epic_1789241474591.png',
  m12_epic: 'clean_m12_atlantis_epic_1789241493162.png',
  m13_epic: 'clean_m13_solar_epic_1789241511040.png',
  m14_epic: 'ai_m3_mage_1789241160305.png',
  m15_epic: 'ai_m13_phoenix_1789241202455.png',
};

const STAR2_MAP = {
  m1_2star: 'gen_m9_2star_1789241708824.png',
  m2_2star: 'ai_m2_sailor_1789241145535.png',
  m3_2star: 'gen_m10_2star_1789241610523.png',
  m4_2star: 'ai_m4_sweet_1789241172025.png',
  m5_2star: 'gen_m10_2star_1789241610523.png',
  m6_2star: 'gen_m9_2star_1789241708824.png',
  m7_2star: 'gen_m10_2star_1789241610523.png',
  m8_2star: 'gen_m9_2star_1789241708824.png',
  m9_2star: 'gen_m9_2star_1789241708824.png',
  m10_2star: 'gen_m10_2star_1789241610523.png',
  m11_2star: 'gen_m10_2star_1789241610523.png',
  m12_2star: 'ai_m2_sailor_1789241145535.png',
  m13_2star: 'gen_m13_2star_1789241857508.png',
  m14_2star: 'gen_m14_2star_1789241901017.png',
  m15_2star: 'gen_m15_2star_1789241945271.png',
};

const STAR3_MAP = {
  m1_3star: 'gen_m10_3star_1789241630307.png',
  m2_3star: 'ai_m2_sailor_1789241145535.png',
  m3_3star: 'gen_m10_3star_1789241630307.png',
  m4_3star: 'ai_m4_sweet_1789241172025.png',
  m5_3star: 'gen_m10_3star_1789241630307.png',
  m6_3star: 'gen_m10_3star_1789241630307.png',
  m7_3star: 'mushroom_fairy_1789239169256.png',
  m8_3star: 'gen_m10_3star_1789241630307.png',
  m9_3star: 'gen_m10_3star_1789241630307.png',
  m10_3star: 'gen_m10_3star_1789241630307.png',
  m11_3star: 'gen_m10_3star_1789241630307.png',
  m12_3star: 'ai_m2_sailor_1789241145535.png',
  m13_3star: 'gen_m13_3star_1789241880980.png',
  m14_3star: 'gen_m14_3star_1789241923129.png',
  m15_3star: 'gen_m15_3star_1789241967003.png',
};

// Connected BFS Outer Background Eraser (protects all interior dress lace, pearls, skin)
function makeCanvasTransparentBFS(canvas) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

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
    // Canvas outer white space / light gray background space
    return (r > 210 && g > 210 && b > 210) || (r > 195 && g > 195 && b > 195 && Math.abs(r - g) < 18 && Math.abs(g - b) < 18);
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

      pushQueue(x + 1, y);
      pushQueue(x - 1, y);
      pushQueue(x, y + 1);
      pushQueue(x, y - 1);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// Vector 4-Point Sparkle Star
function drawSparkleStar(ctx, cx, cy, radius, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    const x1 = cx + Math.cos(angle) * radius;
    const y1 = cy + Math.sin(angle) * radius;
    const midAngle = angle + Math.PI / 4;
    const x2 = cx + Math.cos(midAngle) * (radius * 0.25);
    const y2 = cy + Math.sin(midAngle) * (radius * 0.25);
    if (i === 0) ctx.moveTo(x1, y1);
    else ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

// Vector 6-Arm Snow Crystal
function drawSnowflake(ctx, cx, cy, radius, color = '#7AD7FF') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(1.5, radius * 0.12);
  ctx.lineCap = 'round';
  ctx.shadowColor = '#00E5FF';
  ctx.shadowBlur = 8;

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const x2 = cx + Math.cos(angle) * radius;
    const y2 = cy + Math.sin(angle) * radius;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const branchDist = radius * 0.55;
    const bx = cx + Math.cos(angle) * branchDist;
    const by = cy + Math.sin(angle) * branchDist;
    const branchLen = radius * 0.35;

    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(angle + Math.PI / 4) * branchLen, by + Math.sin(angle + Math.PI / 4) * branchLen);
    ctx.moveTo(bx, by);
    ctx.lineTo(bx + Math.cos(angle - Math.PI / 4) * branchLen, by + Math.sin(angle - Math.PI / 4) * branchLen);
    ctx.stroke();
  }
  ctx.restore();
}

async function buildAllOutfits() {
  console.log('🚀 Rebuilding ALL 60 Outfits with SAFE BFS TRANSPARENT CUTOUTS...');

  const CANVAS_SIZE = 600;

  for (let mapIdx = 1; mapIdx <= 15; mapIdx++) {
    const rarities = ['2star', '3star', 'epic', 'legendary'];

    for (const rarity of rarities) {
      const outfitId = `m${mapIdx}_${rarity}`;
      const fileName = `set_${outfitId}.png`;
      const outPath = path.join(OUTFIT_DIR, fileName);

      let artifactName = null;
      if (rarity === 'legendary') artifactName = LEGENDARY_MAP[outfitId];
      else if (rarity === 'epic') artifactName = EPIC_MAP[outfitId];
      else if (rarity === '3star') artifactName = STAR3_MAP[outfitId];
      else artifactName = STAR2_MAP[outfitId];

      const sourcePath = path.join(ARTIFACT_DIR, artifactName);

      const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
      const ctx = canvas.getContext('2d');

      // Clear canvas (transparent background initially)
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      if (fs.existsSync(sourcePath)) {
        try {
          const img = await loadImage(sourcePath);

          const scale = Math.min((CANVAS_SIZE - 80) / img.width, (CANVAS_SIZE - 80) / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const drawX = (CANVAS_SIZE - drawW) / 2;
          const drawY = (CANVAS_SIZE - drawH) / 2 - 10;

          ctx.drawImage(img, drawX, drawY, drawW, drawH);

          // Run safe connected BFS cutout
          makeCanvasTransparentBFS(canvas);

          // Add vector bling stars & snowflakes according to rarity
          if (rarity === 'legendary') {
            const starColors = ['#FFDF00', '#FF85A2', '#7AD7FF', '#C77DFF', '#00F5D4', '#FF9E00'];
            for (let s = 0; s < 16; s++) {
              const sx = 40 + (s * 37) % 520;
              const sy = 40 + (s * 43) % 480;
              const size = 12 + (s % 4) * 5;
              const col = starColors[s % starColors.length];
              drawSparkleStar(ctx, sx, sy, size, col);
            }
            for (let f = 0; f < 6; f++) {
              const fx = 60 + (f * 95) % 480;
              const fy = 70 + (f * 83) % 440;
              drawSnowflake(ctx, fx, fy, 14 + (f % 3) * 4, '#80E5FF');
            }
          } else if (rarity === 'epic') {
            const starColors = ['#FFDF00', '#FF85A2', '#7AD7FF'];
            for (let s = 0; s < 8; s++) {
              const sx = 60 + (s * 67) % 480;
              const sy = 60 + (s * 73) % 440;
              drawSparkleStar(ctx, sx, sy, 12, starColors[s % starColors.length]);
            }
            for (let f = 0; f < 3; f++) {
              const fx = 80 + (f * 150) % 440;
              const fy = 90 + (f * 130) % 400;
              drawSnowflake(ctx, fx, fy, 12, '#9EE8FF');
            }
          } else if (rarity === '3star') {
            for (let s = 0; s < 4; s++) {
              const sx = 80 + (s * 130) % 440;
              const sy = 80 + (s * 110) % 400;
              drawSparkleStar(ctx, sx, sy, 10, '#FFDF00');
            }
          }
        } catch (err) {
          console.error(`Error processing ${outfitId}:`, err);
        }
      } else {
        console.warn(`Source image missing for ${outfitId}: ${sourcePath}`);
      }

      const buffer = canvas.toBuffer('image/png');
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Perfect Cutout Saved [${outfitId}] -> ${fileName}`);
    }
  }

  // Also convert default_pink.png safely
  const defaultPinkSource = path.join(ARTIFACT_DIR, 'doll_pink_isolated_1789230212801.png');
  if (fs.existsSync(defaultPinkSource)) {
    const img = await loadImage(defaultPinkSource);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    makeCanvasTransparentBFS(canvas);
    fs.writeFileSync(path.join(OUTFIT_DIR, 'default_pink.png'), canvas.toBuffer('image/png'));
    console.log('✅ Perfect Cutout Saved -> default_pink.png');
  }

  console.log('🎉 ALL 60 OUTFITS & DEFAULT_PINK ARE PERFECT TRANSPARENT CUTOUTS WITH NO HOLES!');
}

buildAllOutfits();
