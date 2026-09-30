import fs from 'fs';

function updateFile(type, filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const jpgProducts = [
    'brass-kalasha-vessel', 'brass-kuthuvilakku-pair', 'bhimseni-camphor', 'madurai-temple-kumkum',
    'salem-turmeric-powder', 'cow-ghee-diya-wicks', 'panchapatra-achamani-spoon', 'navadhanya-kit',
    'pure-sandalwood-paste', 'sambrani-dhoop-cups', 'pure-rose-water', 'cotton-flower-wicks', 'sacred-janeu-thread'
  ];
  
  if (type === 'products') {
    let newContent = content;
    const matches = [...newContent.matchAll(/slug:\s*'([^']+)'[\s\S]*?image:\s*'([^']+)'/g)];
    matches.forEach(m => {
      const slug = m[1];
      const oldImgLine = m[0];
      const ext = jpgProducts.includes(slug) ? '.jpg' : '.svg';
      const newImgLine = oldImgLine.replace(m[2], `/images/products/${slug}${ext}`);
      newContent = newContent.replace(oldImgLine, newImgLine);
    });
    fs.writeFileSync(filePath, newContent);
  }
  
  if (type === 'festivals' || type === 'rituals') {
    const key = type === 'festivals' ? 'heroImage' : 'image';
    const regex = new RegExp(`slug:\\s*'([^']+)'[\\s\\S]*?${key}:\\s*'([^']+)'`, 'g');
    let newContent = content;
    const matches = [...newContent.matchAll(regex)];
    matches.forEach(m => {
      const slug = m[1];
      const oldImgLine = m[0];
      const newImgLine = oldImgLine.replace(m[2], `/images/${type}/${slug}.svg`);
      newContent = newContent.replace(oldImgLine, newImgLine);
    });
    fs.writeFileSync(filePath, newContent);
  }
}

updateFile('products', './src/data/products.ts');
updateFile('festivals', './src/data/festivals.ts');
updateFile('rituals', './src/data/rituals.ts');
console.log('Images updated successfully');
