const fs = require('fs');
const path = require('path');

function updateDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const p = path.join(dir, file);
    if(fs.statSync(p).isDirectory()) updateDir(p);
    else if(p.endsWith('.svg')) {
      let c = fs.readFileSync(p, 'utf8');
      c = c.replace(/width="800" height="600"/, 'viewBox="0 0 800 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"');
      fs.writeFileSync(p, c);
    }
  });
}

updateDir('./public/images');
console.log('Fixed SVGs');
