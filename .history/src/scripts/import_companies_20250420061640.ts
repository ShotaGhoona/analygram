import { promises as fs } from 'node:fs';
import { parse } from 'csv-parse/sync';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ① CSV を読む
  const csv = await fs.readFile(
    '/mnt/data/IG_insight_test - account_list.csv',
    'utf8',
  );

  // ② ヘッダー行を含めてパース
  const records = parse(csv, {
    columns: true,               // ヘッダー名をキーに
    skip_empty_lines: true,
  });

  // ③ 必要列だけ抽出しながら INSERT / UPSERT
  for (const row of records) {
    const name      = row['インスタグラムアカウント名']?.trim();
    const igId      = row['インスタグラムアカウントID']?.trim();
    const longToken = row['長期トークン']?.trim();

    if (!name || !igId || !longToken) continue; // 欠損行はスキップ

    await prisma.company.upsert({
      where:  { igId },           // 同じ igId があれば更新
      update: { name, longToken },
      create: { name, igId, longToken },
    });
  }

  console.log('✅ 取り込み完了');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
