import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const products = [
  'dry-fruits-pancha-meva',
  'brass-agarbatti-stand',
  'traditional-mango-wood-peeta'
];

const festivals = [
  'varalakshmi-vrata', 'ugadi', 'onam', 'pongal', 'gokulashtami',
  'deepavali', 'navaratri', 'karthigai-deepam', 'maha-shivaratri', 'vishu'
];

const rituals = [
  'satyanarayana-puja', 'ganapati-puja', 'griha-pravesh', 'varalakshmi-vrata',
  'navagraha-shanti', 'saraswati-puja', 'ayusha-homam', 'mrityunjaya-homam'
];

function createSVG(text, width = 800, height = 600) {
  const bg = `#2F3C2C`; // temple-900 color
  const accent = `#D4AF37`; // brass-400 color
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="${bg}" />
    <rect width="100%" height="100%" fill="none" stroke="${accent}" stroke-width="20" opacity="0.3" />
    <text x="50%" y="50%" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="#F8F5EE" text-anchor="middle" dominant-baseline="middle">
      ${text}
    </text>
    <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="16" font-weight="normal" fill="${accent}" text-anchor="middle" dominant-baseline="middle">
      AUTHENTIC PUJA KARYAM ASSET
    </text>
  </svg>`;
}

const write = (folder, list) => {
  list.forEach(name => {
    const svg = createSVG(name.replace(/-/g, ' ').toUpperCase());
    fs.writeFileSync(path.join(__dirname, '..', 'public', 'images', folder, `${name}.svg`), svg);
  });
};

write('products', products);
write('festivals', festivals);
write('rituals', rituals);
console.log('SVGs generated successfully');
