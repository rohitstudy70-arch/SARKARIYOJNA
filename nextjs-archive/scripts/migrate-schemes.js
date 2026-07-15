const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const schemesDir = path.join(__dirname, '../public/yojana');

async function migrate() {
  console.log('Starting migration of HTML schemes to Database...');
  
  const files = fs.readdirSync(schemesDir).filter(f => f.endsWith('.html'));
  console.log(`Found ${files.length} schemes.`);

  let success = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const slug = file.replace('.html', '');
      const html = fs.readFileSync(path.join(schemesDir, file), 'utf-8');
      const $ = cheerio.load(html);

      // Extract SEO
      const seoTitle = $('title').text().trim();
      const seoDesc = $('meta[name="description"]').attr('content') || '';
      const keywords = $('meta[name="keywords"]').attr('content') || '';

      // Extract Header Info
      const title = $('h1').text().trim();
      const hindiName = $('.hindi-name').text().trim();
      const shortDesc = $('.short-desc').text().trim();
      const officialLinks = $('.official-link-btn').attr('href') || '';

      // Extract Category & State from data attributes
      const relatedDiv = $('#related-schemes');
      const catSlug = relatedDiv.attr('data-cat');
      const stateSlug = relatedDiv.attr('data-state');
      const catName = $('.cat-badge').text().trim();

      // Upsert Category
      let categoryId = null;
      if (catSlug) {
        const cat = await prisma.category.upsert({
          where: { slug: catSlug },
          update: {},
          create: {
            slug: catSlug,
            name: catName || catSlug,
            type: 'scheme'
          }
        });
        categoryId = cat.id;
      }

      // Upsert State
      let stateId = null;
      if (stateSlug) {
        const state = await prisma.state.upsert({
          where: { slug: stateSlug },
          update: {},
          create: {
            slug: stateSlug,
            name: stateSlug.replace('-', ' ').toUpperCase()
          }
        });
        stateId = state.id;
      }

      // Extract Sections
      let content = '';
      let benefits = '';
      let eligibility = '';
      let documents = '';
      let applicationProcess = '';

      $('.content-card').each((i, el) => {
        const heading = $(el).find('h2').text().toLowerCase();
        const inner = $(el).html();
        if (heading.includes('uddeshya') || heading.includes('objective') || heading.includes('baare mein')) {
          content = inner;
        } else if (heading.includes('labh') || heading.includes('benefits')) {
          benefits = inner;
        } else if (heading.includes('patrata') || heading.includes('eligibility')) {
          eligibility = inner;
        } else if (heading.includes('dastavej') || heading.includes('documents')) {
          documents = inner;
        } else if (heading.includes('aavedan') || heading.includes('apply')) {
          applicationProcess = inner;
        }
      });

      // Upsert Scheme
      await prisma.scheme.upsert({
        where: { slug },
        update: {
          title,
          hindiName,
          shortDesc,
          seoTitle,
          seoDesc,
          keywords,
          officialLinks,
          categoryId,
          stateId,
          content,
          benefits,
          eligibility,
          documents,
          applicationProcess,
          status: 'PUBLISHED'
        },
        create: {
          slug,
          title,
          hindiName,
          shortDesc,
          seoTitle,
          seoDesc,
          keywords,
          officialLinks,
          categoryId,
          stateId,
          content,
          benefits,
          eligibility,
          documents,
          applicationProcess,
          status: 'PUBLISHED'
        }
      });

      success++;
      console.log(`Migrated: ${slug}`);
    } catch (err) {
      console.error(`Failed to migrate ${file}:`, err.message);
      errors++;
    }
  }

  console.log(`Migration complete. Success: ${success}, Errors: ${errors}`);
}

migrate()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
