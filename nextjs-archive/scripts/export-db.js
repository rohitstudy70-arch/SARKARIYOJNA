const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportDb() {
  console.log('Exporting database to JSON...');
  
  const categories = await prisma.category.findMany();
  const states = await prisma.state.findMany();
  const schemes = await prisma.scheme.findMany();
  
  const data = {
    categories,
    states,
    schemes
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../prisma/seed.json'), 
    JSON.stringify(data, null, 2)
  );
  
  console.log(`Exported ${categories.length} categories, ${states.length} states, and ${schemes.length} schemes.`);
}

exportDb()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
