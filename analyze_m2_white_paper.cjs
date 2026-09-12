const path = require('path');
const { loadImage, createCanvas } = require('canvas');

async function analyzeWhitePaper() {
  const filePath = path.join(__dirname, 'src', 'assets', 'outfits', 'set_m2_epic.png');
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  const colorMap = {};
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 100 && r > 200 && g > 200 && b > 200) {
      const key = `${Math.floor(r/10)*10},${Math.floor(g/10)*10},${Math.floor(b/10)*10}`;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }
  }

  console.log('Opaque White Pixel Distribution (RGB ranges):', colorMap);
}

analyzeWhitePaper();
