const path = require('path');
const { loadImage, createCanvas } = require('canvas');

async function inspectImagePixels(filename) {
  const filePath = path.join(__dirname, 'src', 'assets', 'outfits', filename);
  try {
    const img = await loadImage(filePath);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const data = imgData.data;

    console.log(`--- ${filename} (${img.width}x${img.height}) ---`);
    console.log(`Top-Left (0,0): R=${data[0]}, G=${data[1]}, B=${data[2]}, A=${data[3]}`);
    console.log(`Top-Right (${img.width-1},0): R=${data[(img.width-1)*4]}, G=${data[(img.width-1)*4+1]}, B=${data[(img.width-1)*4+2]}, A=${data[(img.width-1)*4+3]}`);
    console.log(`Center (10,10): R=${data[(10*img.width+10)*4]}, G=${data[(10*img.width+10)*4+1]}, B=${data[(10*img.width+10)*4+2]}, A=${data[(10*img.width+10)*4+3]}`);

    let nonTransparentCount = 0;
    let whiteCount = 0;
    let nonWhiteCount = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] > 0) nonTransparentCount++;
      if (data[i] > 200 && data[i + 1] > 200 && data[i + 2] > 200) whiteCount++;
      else nonWhiteCount++;
    }

    console.log(`Total pixels: ${img.width * img.height}`);
    console.log(`Non-transparent (Alpha > 0): ${nonTransparentCount}`);
    console.log(`White/Near-white (RGB > 200): ${whiteCount}`);
  } catch (err) {
    console.error(`Error inspecting ${filename}:`, err);
  }
}

async function main() {
  await inspectImagePixels('set_m2_epic.png');
  await inspectImagePixels('default_pink.png');
  await inspectImagePixels('set_m1_legendary.png');
}

main();
