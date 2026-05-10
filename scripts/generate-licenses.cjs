// scripts/generate-licenses.js
// license-checker --json の出力から主要なOSS情報だけを抽出し、成果物用のlicenses.txtを生成

const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, '../public/licenses.json');
const outputPath = path.resolve(__dirname, '../public/licenses.txt');

const licenses = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let result = '';

for (const pkg of Object.keys(licenses).sort()) {
  const info = licenses[pkg];
  result += `Package: ${pkg}\n`;
  result += `Version: ${info.version || '-'}\n`;
  result += `License: ${info.licenses || '-'}\n`;
  if (info.publisher) result += `Publisher: ${info.publisher}\n`;
  if (info.repository) result += `Repository: ${info.repository}\n`;
  if (info.copyright) result += `Copyright: ${info.copyright}\n`;
  if (info.licenseFile) {
    try {
      const licenseText = fs.readFileSync(info.licenseFile, 'utf8');
      result += `\n----- LICENSE TEXT -----\n${licenseText}\n----- END LICENSE TEXT -----\n`;
    } catch (e) {
      // ignore if file not found
    }
  }
  result += `\n`;
}

fs.writeFileSync(outputPath, result);
console.log('licenses.txt generated.');
