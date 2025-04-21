import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  try {
    // company_seed.jsonを読み込む
    const seedDataPath = path.join(__dirname, '..', 'data', 'company_seed.json');
    const companiesData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

    console.log(`Found ${companiesData.length} companies in seed file`);

    // 各会社データを処理
    for (const companyData of companiesData) {
      // igIdから引用符を削除
      const cleanIgId = companyData.igId.replace(/"/g, '');
      
      const company = await prisma.company.upsert({
        where: { igId: cleanIgId },
        update: {
          name: companyData.name,
          longToken: companyData.longToken,
        },
        create: {
          name: companyData.name,
          igId: cleanIgId,
          longToken: companyData.longToken,
        }
      });

      console.log(`Processed company: ${company.name} (ID: ${company.id})`);
    }

    console.log('\nAll companies have been successfully imported!');

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
    console.error('Failed to import companies:', error);
    process.exit(1);
  });
