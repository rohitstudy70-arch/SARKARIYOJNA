const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database from JSON...');
  
  const seedPath = path.join(__dirname, '../prisma/seed.json');
  if (!fs.existsSync(seedPath)) {
    console.log('No seed.json found. Skipping seed.');
    return;
  }

  const data = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
  
  // Seed schemes
  if (data.schemes && data.schemes.length > 0) {
    let success = 0;
    for (const scheme of data.schemes) {
      try {
        await prisma.scheme.upsert({
          where: { slug: scheme.slug },
          update: scheme,
          create: scheme
        });
        success++;
      } catch (err) {
        console.error(`Failed to seed scheme ${scheme.slug}:`, err.message);
      }
    }
    console.log(`Seeded ${success} schemes successfully.`);
  }

  // Set home data manually here to ensure it works on server without old files
  console.log('Setting home page flags...');
  const allSchemes = await prisma.scheme.findMany({ take: 30 });
  for (let i = 0; i < allSchemes.length; i++) {
    const s = allSchemes[i];
    if (i < 10) await prisma.scheme.update({ where: { id: s.id }, data: { featured: true } });
    else if (i < 20) await prisma.scheme.update({ where: { id: s.id }, data: { trending: true } });
    else if (i < 30) await prisma.scheme.update({ where: { id: s.id }, data: { popular: true } });
  }
  console.log('Home page flags set.');

  console.log('Seeding System Settings...');
  const settings = [
    { key: 'admobAppId', value: 'ca-app-pub-9026245431226560~2596631953' },
    { key: 'adBanner', value: 'ca-app-pub-9026245431226560/6203493021' },
    { key: 'adInterstitial', value: 'ca-app-pub-9026245431226560/2520610337' },
    { key: 'adNative', value: 'ca-app-pub-9026245431226560/2171610603' },
    { key: 'adAppOpen', value: 'ca-app-pub-9026245431226560/4890411352' },
    { key: 'oneSignalAppId', value: 'f9f6ff5b-aa0c-4e35-9a80-59cd0df1f91f' },
    { key: 'siteName', value: 'All Sarkari Yojana' },
    { key: 'contactEmail', value: 'contact@sarkariyojana.app' },
    { key: 'minVersion', value: '1' },
    { key: 'latestVersion', value: '1' },
    { key: 'forceUpdate', value: 'false' },
    { key: 'maintenanceMode', value: 'false' }
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: {},
      create: { key: s.key, value: s.value }
    });
  }
  console.log('System Settings seeded.');
}

seed()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
