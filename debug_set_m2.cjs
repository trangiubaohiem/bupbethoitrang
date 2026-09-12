const path = require('path');
const { loadImage, createCanvas } = require('canvas');

async function debugSetM2() {
  const filePath = path.join(__dirname, 'src', 'assets', 'outfits', 'set_m2_epic.png');
  const img = await loadImage(filePath);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, img.width, img.height);
  const data = imgData.data;

  console.log(`Dimensions: ${img.width}x${img.height}`);

  // Count pixels with Alpha > 0 and RGB > 230
  let opaqueWhiteCount = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a > 100 && r > 230 && g > 230 && b > 230) {
      opaqueWhiteCount++;
    }
  }

  console.log(`Opaque White/Near-White Pixels (Alpha > 100 & RGB > 230): ${opaqueWhiteCount}`);
}

debugSetM2();
