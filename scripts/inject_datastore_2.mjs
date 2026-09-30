import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/components/store/IntentSearchBar.tsx',
  'src/components/planner/RitualPlannerWizard.tsx',
  'src/components/guide/DigitalRitualGuideModal.tsx',
  'src/components/3d/RitualTableCanvas.tsx'
];

function updateComponentFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  
  if (content.includes('const { products: SAMAGRI_PRODUCTS')) return;

  const arrowComponentRegex = /(export const [A-Z][a-zA-Z0-9_]*(?:\s*:\s*React\.FC(?:<[^>]*>)?|\s*:\s*any)?\s*=\s*\([^)]*\)\s*=>\s*\{)/;
  const functionComponentRegex = /(export (?:default )?function [A-Z][a-zA-Z0-9_]*\s*\([^)]*\)\s*\{)/;

  if (arrowComponentRegex.test(content)) {
    content = content.replace(arrowComponentRegex, `$1\n  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();\n`);
  } else if (functionComponentRegex.test(content)) {
    content = content.replace(functionComponentRegex, `$1\n  const { products: SAMAGRI_PRODUCTS, rituals: RITUALS_DATA, festivals: FESTIVALS_DATA } = useDataStore();\n`);
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

filesToUpdate.forEach(updateComponentFile);
