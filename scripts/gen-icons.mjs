// Generates simple PWA icon PNGs. Needs canvas, which is not a project dependency: npm i --no-save canvas
import { createCanvas } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dir, '..', 'public');
mkdirSync(publicDir, { recursive: true });

function makeIcon(size) {
  const c = createCanvas(size, size);
  const ctx = c.getContext('2d');
  const r = size * 0.18;

  // Background
  ctx.fillStyle = '#16a34a';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, r);
  ctx.fill();

  // Letter
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.55}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('F', size / 2, size / 2 + size * 0.04);

  return c.toBuffer('image/png');
}

writeFileSync(join(publicDir, 'icon-192.png'), makeIcon(192));
writeFileSync(join(publicDir, 'icon-512.png'), makeIcon(512));
console.log('Icons written.');
