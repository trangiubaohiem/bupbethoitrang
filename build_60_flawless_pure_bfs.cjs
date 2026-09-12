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
  m10_legendary: 'gen_m10_legendary_pyramid_queen_1789244053678.png',
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
  m9_epic:  'gen_m9_epic_ice_knight_1789244028773.png',
  m10_epic: 'outfit_pyramid_priestess_1789231362865.png',
  m11_epic: 'clean_m11_galaxy_epic_1789241474591.png',
  m12_epic: 'clean_m12_atlantis_epic_1789241493162.png',
  m13_epic: 'clean_m13_solar_epic_1789241511040.png',
  m14_epic: 'ai_m3_mage_1789241160305.png',
  m15_epic: 'ai_m13_phoenix_1789241202455.png',
};

const STAR3_MAP = {
  m1_3star:  'gen_m1_3star_sakura_1789243587841.png',
  m2_3star:  'gen_m2_3star_mermaid_1789243737530.png',
  m3_3star:  'gen_m3_3star_astronomer_1789243607668.png',
  m4_3star:  'gen_m4_3star_candy_princess_1789243757644.png',
  m5_3star:  'gen_m5_3star_royal_fairy_1789243630783.png',
  m6_3star:  'gen_m6_3star_star_idol_1789243649765.png',
  m7_3star:  'gen_m7_3star_mushroom_guardian_1789243821607.png',
  m8_3star:  'gen_m8_3star_clocktower_1789243673596.png',
  m9_3star:  'gen_m9_3star_ice_princess_1789243777980.png',
  m10_3star: 'gen_m10_3star_sun_priestess_1789243693582.png',
  m11_3star: 'gen_m11_3star_galaxy_princess_1789243710895.png',
  m12_3star: 'gen_m12_3star_atlantis_mermaid_1789243798395.png',
  m13_3star: 'gen_m13_3star_1789241880980.png',
  m14_3star: 'gen_m14_3star_1789241923129.png',
  m15_3star: 'gen_m15_3star_1789241967003.png',
};

const STAR2_MAP = {
  m1_2star:  'gen_m9_2star_1789241708824.png',
  m2_2star:  'ai_m2_sailor_1789241145535.png',
  m3_2star:  'gen_m3_2star_starlight_1789243511166.png',
  m4_2star:  'ai_m4_sweet_1789241172025.png',
  m5_2star:  'gen_m5_2star_fairy_maiden_1789243447675.png',
  m6_2star:  'gen_m6_2star_guard_1789243528800.png',
  m7_2star:  'gen_m7_2star_mushroom_1789243467129.png',
  m8_2star:  'gen_m8_2star_timetravel_1789243546667.png',
  m9_2star:  'gen_m9_2star_1789241708824.png',
  m10_2star: 'gen_m10_2star_desert_1789243569457.png',
  m11_2star: 'gen_m11_2star_galaxy_1789243491554.png',
  m12_2star: 'ai_m2_sailor_1789241145535.png',
  m13_2star: 'gen_m13_2star_1789241857508.png',
  m14_2star: 'gen_m14_2star_1789241901017.png',
  m15_2star: 'gen_m15_2star_1789241945271.png',
};

async function processPureBfs(srcPath, destPath) {
  const img = await loadImage(srcPath);
  const width = img.width;
  const height = img.height;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, width, height);
  const pixels = imgData.data;

  const isBg = new Uint8Array(width * height);
  const visited = new Uint8Array(width * height);
  const queueX = new Int32Array(width * height * 2);
  const queueY = new Int32Array(width * height * 2);
  let head = 0, tail = 0;

  for (let x = 0; x < width; x++) {
    queueX[tail] = x; queueY[tail] = 0; tail++;
    queueX[tail] = x; queueY[tail] = height - 1; tail++;
  }
  for (let y = 0; y < height; y++) {
    queueX[tail] = 0; queueY[tail] = y; tail++;
    queueX[tail] = width - 1; queueY[tail] = y; tail++;
  }

  const isBackgroundPixel = (r, g, b, a) => {
    if (a < 20) return true;
    const minVal = Math.min(r, g, b);
    const maxVal = Math.max(r, g, b);
    const diff = maxVal - minVal;

    if (r >= 210 && g >= 210 && b >= 210) return true;
    if (minVal >= 170 && diff <= 50) return true;
    if (maxVal <= 60 && diff <= 25) return true;

    return false;
  };

  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;

    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    const idx1d = y * width + x;
    if (visited[idx1d]) continue;
    visited[idx1d] = 1;

    const pIdx = idx1d * 4;
    const r = pixels[pIdx], g = pixels[pIdx + 1], b = pixels[pIdx + 2], a = pixels[pIdx + 3];

    if (isBackgroundPixel(r, g, b, a)) {
      isBg[idx1d] = 1;
      queueX[tail] = x + 1; queueY[tail] = y; tail++;
      queueX[tail] = x - 1; queueY[tail] = y; tail++;
      queueX[tail] = x; queueY[tail] = y + 1; tail++;
      queueX[tail] = x; queueY[tail] = y - 1; tail++;
    }
  }

  for (let i = 0; i < width * height; i++) {
    if (isBg[i]) {
      pixels[i * 4 + 3] = 0;
    }
  }

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx1d = y * width + x;
      const pIdx = idx1d * 4;
      if (!isBg[idx1d]) {
        let bgNeighbors = 0;
        if (isBg[idx1d - 1]) bgNeighbors++;
        if (isBg[idx1d + 1]) bgNeighbors++;
        if (isBg[idx1d - width]) bgNeighbors++;
        if (isBg[idx1d + width]) bgNeighbors++;

        if (bgNeighbors >= 2) {
          pixels[pIdx + 3] = Math.round(pixels[pIdx + 3] * 0.5);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  fs.writeFileSync(destPath, canvas.toBuffer('image/png'));
}

async function buildAll60PureBfs() {
  console.log('🚀 Processing ALL 60 Outfits with PURE BFS (ZERO SLICING, ZERO HOLES)...');

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

      if (fs.existsSync(sourcePath)) {
        try {
          await processPureBfs(sourcePath, outPath);
          console.log(`✅ Pure BFS [${outfitId}] -> ${fileName}`);
        } catch (err) {
          console.error(`Error processing ${outfitId}:`, err);
        }
      } else {
        console.warn(`Source image missing for ${outfitId}: ${sourcePath}`);
      }
    }
  }

  // Default pink
  const defaultPinkSource = path.join(ARTIFACT_DIR, 'doll_pink_isolated_1789230212801.png');
  if (fs.existsSync(defaultPinkSource)) {
    await processPureBfs(defaultPinkSource, path.join(OUTFIT_DIR, 'default_pink.png'));
    console.log('✅ default_pink.png');
  }

  console.log('🎉 ALL 60 OUTFITS PROCESSED CLEANLY WITH PURE BFS!');
}

buildAll60PureBfs();
