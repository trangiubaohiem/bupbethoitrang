const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/8b118b5d-b583-4dc9-80c4-6e8279ec476e';
const outfitsDir = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/outfits';
const rivalsDir = 'c:/Users/ASUS/Documents/GAME-VIBECODING/src/assets/rivals';

// Mapping artifact prefixes to asset target names
const artifactFiles = fs.readdirSync(brainDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

console.log(`Found ${artifactFiles.length} artifact images in brain directory.`);

const assetMap = {
  'outfit_candy_queen_supreme': 'sweet_candy.png',
  'outfit_celestial_empress': 'sun_goddess_celestial.png',
  'outfit_cherry_blossom': 'cherry_blossom.png',
  'outfit_cleopatra': 'cleopatra.png',
  'outfit_clockwork_angel': 'clockwork_angel.png',
  'outfit_coral_queen': 'coral_queen.png',
  'outfit_cosmic_goddess': 'cosmic_goddess.png',
  'outfit_crystal_flower_queen': 'fairy_flower.png',
  'outfit_desert_pharaoh': 'desert_pharaoh.png',
  'outfit_dragon_empress': 'ice_dragon.png',
  'outfit_empress_golden': 'empress_golden.png',
  'outfit_forest_elf': 'forest_elf.png',
  'outfit_frost_goddess_supreme': 'frost_goddess_supreme.png',
  'outfit_frost_knight': 'frost_knight.png',
  'outfit_ice_dragon': 'ice_dragon.png',
  'outfit_legendary_forest_archgoddess': 'legendary_forest_archgoddess.png',
  'outfit_legendary_ocean_dragoness': 'legendary_ocean_dragoness.png',
  'outfit_legendary_sakura_goddess': 'legendary_sakura_goddess.png',
  'outfit_legendary_starlight_sovereign': 'legendary_starlight_sovereign.png',
  'outfit_legendary_sugar_empress': 'legendary_sugar_empress.png',
  'outfit_meteor_empress': 'space_galaxy.png',
  'outfit_meteor_mage': 'meteor_mage.png',
  'outfit_mushroom_fairy': 'mushroom_fairy.png',
  'outfit_ocean_empress': 'ocean_mermaid.png',
  'outfit_pyramid_priestess': 'pyramid_priestess.png',
  'outfit_solar_phoenix': 'solar_phoenix.png',
  'outfit_starlight': 'starlight.png',
  'outfit_steampunk': 'steampunk.png',
  'outfit_strawberry_chef': 'strawberry_chef.png',
  'outfit_sun_goddess_celestial': 'sun_goddess_celestial.png',
  'outfit_sweet_candy': 'sweet_candy.png',
  'outfit_time_traveller': 'time_traveller.png',
  'outfit_universe_sovereignty': 'universe_sovereignty.png',
  'doll_pink_isolated': 'default_pink.png',
};

// Copy pristine original artifacts
artifactFiles.forEach(file => {
  for (const [prefix, targetName] of Object.entries(assetMap)) {
    if (file.startsWith(prefix)) {
      const srcPath = path.join(brainDir, file);
      const destPath = path.join(outfitsDir, targetName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Restored original ${targetName} from ${file}`);
    }
  }
});

console.log('Original outfit images restored!');
