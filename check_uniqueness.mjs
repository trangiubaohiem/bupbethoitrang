import { OUTFIT_SETS } from './src/data/fashionItems.js';

const imageCounts = {};
OUTFIT_SETS.forEach(set => {
  const imgSrc = set.image;
  imageCounts[imgSrc] = (imageCounts[imgSrc] || 0) + 1;
});

console.log(`Total outfit sets: ${OUTFIT_SETS.length}`);
console.log(`Unique image sources used: ${Object.keys(imageCounts).length}`);

OUTFIT_SETS.forEach((set, idx) => {
  const count = imageCounts[set.image];
  if (count > 1) {
    console.log(`Set [${set.id}] Map ${set.chapter} "${set.name}": shared image (used ${count} times)`);
  }
});
