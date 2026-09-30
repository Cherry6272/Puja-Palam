import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/app/page.tsx',
  'src/app/catalog/page.tsx',
  'src/app/samagri/page.tsx',
  'src/app/rituals/page.tsx',
  'src/app/festivals/page.tsx',
  'src/app/search/page.tsx',
  'src/app/build-your-kit/page.tsx',
  'src/app/festivals/[slug]/page.tsx',
  'src/app/puja-kits/[slug]/page.tsx',
  'src/app/rituals/[slug]/page.tsx',
  'src/app/samagri/[slug]/page.tsx',
  'src/components/store/IntentSearchBar.tsx',
  'src/components/planner/RitualPlannerWizard.tsx',
  'src/components/guide/DigitalRitualGuideModal.tsx',
  'src/components/3d/RitualTableCanvas.tsx'
];

function updateComponentFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath}, does not exist.`);
    return;
  }
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Skip if already updated
  if (content.includes('useDataStore')) return;

  // Add import
  content = content.replace(/(import.*['"]react['"];?)/, `$1\nimport { useDataStore } from '@/hooks/useDataStore';`);

  // Remove old static imports
  content = content.replace(/import { SAMAGRI_PRODUCTS } from '@\/data\/products';\n?/g, '');
  content = content.replace(/import { RITUALS_DATA } from '@\/data\/rituals';\n?/g, '');
  content = content.replace(/import { FESTIVALS_DATA } from '@\/data\/festivals';\n?/g, '');

  // Inject hook into component body
  // We'll look for the first function export (default or otherwise) that looks like a component
  const componentRegex = /(export (?:default )?function [A-Z][a-zA-Z0-9_]*\s*\([^)]*\)\s*\{)/;
  content = content.replace(componentRegex, `$1\n  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();\n`);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

filesToUpdate.forEach(updateComponentFile);
