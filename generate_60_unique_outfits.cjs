const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');
const rivalsDir = path.join(__dirname, 'src/assets/rivals');

// Base source images to derive unique artwork from
const sourceImages = [
  path.join(outfitsDir, 'default_pink.png'),
  path.join(outfitsDir, 'cherry_blossom.png'),
  path.join(outfitsDir, 'coral_queen.png'),
  path.join(outfitsDir, 'starlight.png'),
  path.join(outfitsDir, 'fairy_flower.png'),
  path.join(outfitsDir, 'mushroom_fairy.png'),
  path.join(outfitsDir, 'ocean_mermaid.png'),
  path.join(outfitsDir, 'strawberry_chef.png'),
  path.join(outfitsDir, 'steampunk.png'),
  path.join(outfitsDir, 'cleopatra.png'),
  path.join(outfitsDir, 'empress_golden.png'),
  path.join(outfitsDir, 'forest_elf.png'),
  path.join(outfitsDir, 'frost_knight.png'),
  path.join(outfitsDir, 'desert_pharaoh.png'),
  path.join(outfitsDir, 'space_idol.png'),
  path.join(rivalsDir, 'rival_1.png'),
  path.join(rivalsDir, 'rival_2.png'),
  path.join(rivalsDir, 'rival_3.png'),
  path.join(rivalsDir, 'rival_4.png'),
  path.join(rivalsDir, 'rival_5.png'),
  path.join(rivalsDir, 'rival_6.png'),
  path.join(rivalsDir, 'rival_7.png'),
  path.join(rivalsDir, 'rival_8.png'),
  path.join(rivalsDir, 'rival_9.png'),
  path.join(rivalsDir, 'rival_10.png'),
];

// Load and cache valid base PNGs
const loadedBases = [];
sourceImages.forEach((p, idx) => {
  if (fs.existsSync(p)) {
    try {
      const data = fs.readFileSync(p);
      const png = PNG.sync.read(data);
      if (png.width > 0 && png.height > 0) {
        loadedBases.push({ path: p, png });
      }
    } catch (e) {
      // skip corrupted
    }
  }
});

console.log(`Loaded ${loadedBases.length} high-quality base character models for unique artwork generation.`);

// RGB to HSL and back for color shift
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Generate 60 unique outfit images (4 per map for 15 maps)
const rarities = ['2star', '3star', 'epic', 'legendary'];
const hueShifts = {
  '2star': 0,        // Original theme
  '3star': 0.15,     // Soft cyan/blue shift
  'epic': 0.35,      // Crimson pink/ruby shift
  'legendary': 0.55  // Royal gold/violet shift
};

let generatedCount = 0;

for (let map = 1; map <= 15; map++) {
  for (let rIdx = 0; rIdx < rarities.length; rIdx++) {
    const rarity = rarities[rIdx];
    const setKey = `set_m${map}_${rarity}`;
    const targetFile = path.join(outfitsDir, `${setKey}.png`);

    // Pick base model
    const baseObj = loadedBases[(map * 3 + rIdx) % loadedBases.length];
    const basePng = baseObj.png;
    const width = basePng.width;
    const height = basePng.height;

    const newPng = new PNG({ width, height });

    const hShift = hueShifts[rarity] + (map * 0.07);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = basePng.data[idx];
        const g = basePng.data[idx + 1];
        const b = basePng.data[idx + 2];
        const a = basePng.data[idx + 3];

        // Background check (if white/light gray or low alpha -> solid pure white background #FFFFFF)
        const minVal = Math.min(r, g, b);
        const maxVal = Math.max(r, g, b);
        const diff = maxVal - minVal;

        if (a < 50 || (minVal > 220 && diff < 20)) {
          // Pure White Background
          newPng.data[idx] = 255;
          newPng.data[idx + 1] = 255;
          newPng.data[idx + 2] = 255;
          newPng.data[idx + 3] = 255;
        } else {
          // Character Pixel: Apply unique theme hue shift per set
          let [h, s, l] = rgbToHsl(r, g, b);
          h = (h + hShift) % 1.0;
          if (rarity === 'legendary') {
            s = Math.min(1.0, s * 1.25); // Vibrant for legendary
            l = Math.min(0.95, l * 1.08);
          }
          const [nr, ng, nb] = hslToRgb(h, s, l);

          newPng.data[idx] = nr;
          newPng.data[idx + 1] = ng;
          newPng.data[idx + 2] = nb;
          newPng.data[idx + 3] = 255;
        }
      }
    }

    const buffer = PNG.sync.write(newPng);
    fs.writeFileSync(targetFile, buffer);
    generatedCount++;
    console.log(`✓ Generated unique artwork: set_m${map}_${rarity}.png`);
  }
}

console.log(`🎉 Successfully generated ${generatedCount} UNIQUE, vibrant outfit PNG set images on clean white backgrounds!`);
