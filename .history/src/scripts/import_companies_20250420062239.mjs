import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // テスト用の会社データを作成
    const company = await prisma.company.upsert({
      where: { igId: process.env.INSTAGRAM_ID },
      update: {
        name: "Test Company",
        longToken: process.env.ACCESS_TOKEN,
        memo: "テスト用会社データ"
      },
      create: {
        name: "Test Company",
        igId: process.env.INSTAGRAM_ID,
        longToken: process.env.ACCESS_TOKEN,
        memo: "テスト用会社データ"
      }
    });
    
    console.log('Created/Updated company:', company);
    console.log('Company ID:', company.id);
    console.log('\nPlease update your .env file with this Company ID if needed');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
