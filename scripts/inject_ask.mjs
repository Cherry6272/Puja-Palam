import fs from 'fs';
import path from 'path';

const fullPath = path.join(process.cwd(), 'src/components/ai/AskPujaKaryamModal.tsx');
let content = fs.readFileSync(fullPath, 'utf8');

// Skip if already updated
if (!content.includes('useDataStore')) {
  content = content.replace(/(import.*['"]react['"];?)/, `$1\nimport { useDataStore } from '@/hooks/useDataStore';`);
  content = content.replace(/import { RITUALS_DATA } from '@\/data\/rituals';\n?/g, '');
  const componentRegex = /(export function AskPujaKaryamModal[^{]*\{)/;
  content = content.replace(componentRegex, `$1\n  const { rituals: RITUALS_DATA } = useDataStore();\n`);
  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated AskPujaKaryamModal.tsx');
}
