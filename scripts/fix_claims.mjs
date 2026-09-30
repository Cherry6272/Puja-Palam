import fs from 'fs';
import path from 'path';

function replaceInFile(filePath, search, replacement) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replaceAll(search, replacement);
  fs.writeFileSync(fullPath, content, 'utf8');
}

replaceInFile('src/components/store/ProductCard.tsx', '>Hub Verified<', '>Availability Checked<');
replaceInFile('src/components/layout/Footer.tsx', '>100% Shastra Compliant<', '>Region-aware requirements<');
replaceInFile('src/components/layout/Footer.tsx', '>Zero Fake Claims<', '>Quality Assured<');
replaceInFile('src/components/guide/RitualBoxPackagingView.tsx', 'Batch Consecrated: Yes', 'Curated Selection');
replaceInFile('src/app/rituals/[slug]/page.tsx', 'Verified Vedic Canon', 'Commonly Used Rituals');
replaceInFile('src/app/how-it-works/page.tsx', 'Consecrated materials are stored', 'Curated ritual materials are stored');
replaceInFile('src/app/admin/settings/page.tsx', '100% Shastra Compliant', 'Region-aware ritual requirements');

// Additional floral claims
replaceInFile('src/app/how-it-works/page.tsx', "Fresh florals packed at 5:30 AM with audio mantra companion", "Fresh flowers available where supported, with audio mantra companion");
replaceInFile('src/app/festivals/[slug]/page.tsx', "JIT Fresh Florals &amp; Consecrated Dispatch", "Fresh Flowers Available (Select Regions)");
replaceInFile('src/app/checkout/page.tsx', "Fresh Florals Scheduled for 5:30 AM", "Fresh Flowers Available Where Supported");
replaceInFile('src/app/admin/settings/page.tsx', "Box 03 fresh flowers packed between 5:00 AM – 6:30 AM on ceremony morning.", "Box 03 fresh flowers available where supported.");
replaceInFile('src/app/admin/orders/page.tsx', "Fresh Florals Scheduled for 5:30 AM", "Fresh Flowers Where Supported");
replaceInFile('src/app/admin/orders/page.tsx', "Fresh Florals (5:30 AM Pack)", "Fresh Flowers (Where Supported)");

console.log('Claims fixed.');
