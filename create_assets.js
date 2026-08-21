const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Minimal valid 1x1 PNG base64 buffer
const minimalPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const pngBuffer = Buffer.from(minimalPngBase64, 'base64');

['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'].forEach((filename) => {
  fs.writeFileSync(path.join(assetsDir, filename), pngBuffer);
  console.log(`Created asset ${filename}`);
});
