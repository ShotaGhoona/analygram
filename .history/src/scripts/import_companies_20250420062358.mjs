import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 環境変数の確認
    if (!process.env.INSTAGRAM_ID || !process.env.ACCESS_TOKEN) {
      throw new Error('INSTAGRAM_ID and ACCESS_TOKEN must be set in .env file');
    }

    console.log('Using INSTAGRAM_ID:', process.env.INSTAGRAM_ID);
    
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
    
    console.log('Created/Updated company:', JSON.stringify(company, null, 2));
    console.log('Company ID:', company.id);
    console.log('\nPlease update your .env file with this Company ID if needed');

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Failed to create/update company:', error);
    process.exit(1);
  });
