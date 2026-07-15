const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) results = results.concat(walk(file));
    else results.push(file);
  });
  return results;
}

const files = walk('D:/abhiAllSarkariYojana/AllSarkariYojana/website/src').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
let c = 0;
files.forEach(f => {
  if (f.replace(/\\/g, '/').includes('lib/prisma.ts')) return;
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Remove const prisma = new PrismaClient()
  if (content.match(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/)) {
    content = content.replace(/const\s+prisma\s*=\s*new\s+PrismaClient\(\);?/g, '');
    changed = true;
  }

  // Ensure import { prisma } from '@/lib/prisma'; is present if prisma is used
  if (!content.includes("import { prisma } from '@/lib/prisma';") && (content.includes('prisma.') || changed)) {
    content = "import { prisma } from '@/lib/prisma';\n" + content;
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(f, content);
    c++;
  }
});
console.log('Fixed ' + c + ' files');
