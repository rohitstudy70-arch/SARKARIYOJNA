const fs = require('fs');
const path = require('path');

const DYNAMIC_STRING = "export const dynamic = 'force-dynamic';\n";

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('force-dynamic')) {
    // If it's a 'use client' file, we shouldn't add force-dynamic at the top since it might break or it's not needed.
    if (content.includes("'use client'") || content.includes('"use client"')) {
      return;
    }

    // Insert after imports or at top
    const lines = content.split('\n');
    const lastImportIndex = lines.findLastIndex(l => l.startsWith('import '));
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, '\n' + DYNAMIC_STRING);
    } else {
      lines.unshift(DYNAMIC_STRING);
    }
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dirPath, ext) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath, ext);
    } else if (fullPath.endsWith(ext)) {
      processFile(fullPath);
    }
  }
}

console.log('Fixing API routes...');
processDirectory(path.join(__dirname, '../src/app/api'), 'route.ts');

console.log('Fixing pages...');
['page.tsx', 'category/[slug]/page.tsx', 'yojana/[slug]/page.tsx'].forEach(p => {
  const fullPath = path.join(__dirname, '../src/app', p);
  if (fs.existsSync(fullPath)) {
    processFile(fullPath);
  }
});
