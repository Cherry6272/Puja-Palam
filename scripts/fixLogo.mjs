import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace Flame with Flower2
  content = content.replace(/\bFlame\b/g, 'Flower2');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

const files = [
  'src/components/layout/Navbar.tsx',
  'src/components/admin/AdminLayout.tsx',
  'src/app/page.tsx',
  'src/app/not-found.tsx',
  'src/app/about/page.tsx',
];

files.forEach(f => {
  const p = path.resolve(f);
  if(fs.existsSync(p)) {
    processFile(p);
  }
});
