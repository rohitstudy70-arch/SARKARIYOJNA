const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrate() {
  console.log('Starting migration...');
  const backupDir = path.join(__dirname, '../public/yojana_backup');
  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.html'));
  
  // Read schemes.js to get Category and State mapping
  const schemesJsPath = path.join(__dirname, '../public/data/schemes.js');
  let schemesData = fs.readFileSync(schemesJsPath, 'utf8');
  schemesData = schemesData.replace('window.SCHEMES = ', '').replace(/;$/, '');
  
  // Quick fix for trailing commas or comments if needed
  // Using eval safely in controlled script to parse JS object
  let schemesList = [];
  try {
    schemesList = eval(`(${schemesData})`);
  } catch(e) {
    console.error('Failed to parse schemes.js', e.message);
  }

  for (const file of files) {
    const slug = file.replace('.html', '');
    const htmlContent = fs.readFileSync(path.join(backupDir, file), 'utf8');
    const $ = cheerio.load(htmlContent);
    
    // Extract data from HTML
    const title = $('h1').text().trim() || slug.replace(/-/g, ' ');
    const shortDesc = $('.scheme-summary, .summary-box, p').first().text().trim();
    const content = $('.content-section, main, article').html() || '';
    
    const seoTitle = $('title').text().trim();
    const seoDesc = $('meta[name="description"]').attr('content') || '';
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    
    // Find matching scheme in schemesList for category and state
    const meta = schemesList.find(s => s.id === slug) || {};
    
    let categoryRecord = null;
    if (meta.categorySlug && meta.category) {
      categoryRecord = await prisma.category.upsert({
        where: { slug: meta.categorySlug },
        update: {},
        create: { slug: meta.categorySlug, name: meta.category, hindiName: meta.category }
      });
    }
    
    let stateRecord = null;
    if (meta.stateSlug && meta.state) {
      stateRecord = await prisma.state.upsert({
        where: { slug: meta.stateSlug },
        update: {},
        create: { slug: meta.stateSlug, name: meta.state, hindiName: meta.state }
      });
    }

    await prisma.scheme.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        title: meta.name || title,
        hindiName: meta.hindiName || '',
        shortDesc: meta.summary || shortDesc,
        content: content,
        officialLinks: meta.officialUrl || '',
        seoTitle,
        seoDesc,
        keywords: meta.keywords || keywords,
        categoryId: categoryRecord?.id,
        stateId: stateRecord?.id,
        status: 'PUBLISHED'
      }
    });
    console.log(`Migrated: ${slug}`);
  }
  
  console.log('Migration completed successfully.');
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
