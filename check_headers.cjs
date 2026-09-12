const fs = require('fs');
const path = require('path');

const outfitsDir = path.join(__dirname, 'src/assets/outfits');
const files = fs.readdirSync(outfitsDir).filter(f => f.endsWith('.png'));

files.slice(0, 5).forEach(f => {
  const filePath = path.join(outfitsDir, f);
  const buf = fs.readFileSync(filePath);
  console.log(`${f}: header bytes:`, buf.slice(0, 8));
});
