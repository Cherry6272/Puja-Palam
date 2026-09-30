import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if(dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace texts
  content = content.replace(/Puja Karyam/g, 'Samptrapthi');
  content = content.replace(/PUJA KARYAM/g, 'SAMPTRAPTHI');
  content = content.replace(/Puja-Karyam/g, 'Samptrapthi');
  
  // Replace logos
  // specifically for Navbar, Footer, AdminLayout, login/page.tsx
  if (filePath.includes('Navbar.tsx') || filePath.includes('Footer.tsx') || filePath.includes('AdminLayout.tsx') || filePath.includes('login\\page.tsx') || filePath.includes('login/page.tsx')) {
    content = content.replace(/import \{.*?Flame.*?} from 'lucide-react';/g, (match) => match.replace('Flame', 'Flower2'));
    content = content.replace(/<Flame /g, '<Flower2 ');
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walkDir('./src', processFile);
console.log('Done.');
