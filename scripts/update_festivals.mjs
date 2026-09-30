import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/festivals.ts');
let content = fs.readFileSync(filePath, 'utf8');

const replacements = {
  'varalakshmi-vrata': 'lKb4ou94fXg',
  'ganesh-chaturthi': '1567591414240-e18e69888806', // keep original ganesha
  'gowri-habba': '0BRMUqgJVjo',
  'krishna-janmashtami': 'K-tVxCdqMLs',
  'navaratri-dasara': 'M3nSVCteeOQ',
  'deepavali': 'iMeicjsZvrY',
  'ugadi': '-lCLSsESaMA',
  'vishu': 'DoFJedWj85k',
  'pongal-sankranti': 'bzZU5GzzRZ4',
  'tamil-new-year': 'GnMPlrfmxOw'
};

for (const [slug, id] of Object.entries(replacements)) {
  const regex = new RegExp(`slug: '${slug}',[\\s\\S]*?heroImage: 'https://images.unsplash.com/photo-[^?]+\\?auto=format&fit=crop&w=1200&q=80',`, 'g');
  
  content = content.replace(regex, (match) => {
    return match.replace(/heroImage: 'https:\/\/images.unsplash.com\/photo-[^?]+\?auto=format&fit=crop&w=1200&q=80',/, `heroImage: 'https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80',`);
  });
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Festivals updated!');
