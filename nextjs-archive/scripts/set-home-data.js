const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Fetching schemes...');
  const schemes = await prisma.scheme.findMany({ take: 30 });
  
  console.log(`Found ${schemes.length} schemes to update.`);
  
  for (let i = 0; i < schemes.length; i++) {
    const scheme = schemes[i];
    let updateData = {};
    
    if (i < 10) {
      updateData.featured = true;
    } else if (i < 20) {
      updateData.trending = true;
    } else {
      updateData.popular = true;
    }

    await prisma.scheme.update({
      where: { id: scheme.id },
      data: updateData
    });
  }

  console.log('Successfully set 10 featured, 10 trending, and 10 popular schemes.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
