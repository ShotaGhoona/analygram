import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function importAccountInsights() {
  try {
    // CSVファイルの読み込み
    const csvFilePath = path.join(__dirname, '../data/mockDataToAccountInsightDB.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // CSVのパース
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // 会社IDの設定
    const companyId = 'd6ebf6ab-60db-4606-994f-e152b7a37f1b';

    // 各レコードをデータベースに保存
    for (const record of records) {
      // 日付のフォーマット変換
      const [year, month, day] = record.日付.split('/');
      const date = new Date(year, month - 1, day);

      // 数値の変換（カンマを削除）
      const cleanNumber = (str) => {
        if (!str) return 0;
        return parseInt(str.replace(/,/g, ''), 10) || 0;
      };

      // データの作成
      const accountInsight = {
        companyId,
        date,
        followers: cleanNumber(record.フォロワー数),
        follows: cleanNumber(record.フォロー数),
        posts: cleanNumber(record.投稿数),
        reachTotal: cleanNumber(record.リーチ),
        impressions: cleanNumber(record.インプレッション),
        profileVisits: cleanNumber(record['プロフィールのアクセス']),
        webTaps: cleanNumber(record['ウェブサイトのタップ']),
        // 広告関連
        adReach: cleanNumber(record.広告リーチ),
        adLikes: cleanNumber(record.広告いいね),
        adComments: cleanNumber(record.広告コメント),
        adSaves: cleanNumber(record.広告保存),
        adShares: cleanNumber(record.広告シェア),
        // フィード関連
        feedReach: cleanNumber(record.フィードリーチ),
        feedLikes: cleanNumber(record.フィードいいね),
        feedComments: cleanNumber(record.フィードコメント),
        feedSaves: cleanNumber(record.フィード保存),
        feedShares: cleanNumber(record.フィードシェア),
        // ストーリー関連
        storyReach: cleanNumber(record.ストーリーリーチ),
        storyLikes: cleanNumber(record.ストーリーいいね),
        storyComments: cleanNumber(record.ストーリーコメント),
        storySaves: cleanNumber(record.ストーリー保存),
        storyShares: cleanNumber(record.ストーリーシェア),
        // リール関連
        reelReach: cleanNumber(record.リールリーチ),
        reelLikes: cleanNumber(record.リールいいね),
        reelComments: cleanNumber(record.リールコメント),
        reelSaves: cleanNumber(record.リール保存),
        reelShares: cleanNumber(record.リールシェア),
        // カルーセル関連
        carouselReach: cleanNumber(record.カルーセルリーチ),
        carouselLikes: cleanNumber(record.カルーセルいいね),
        carouselComments: cleanNumber(record.カルーセルコメント),
        carouselSaves: cleanNumber(record.カルーセル保存),
        carouselShares: cleanNumber(record.カルーセルシェア),
        newFollowers: cleanNumber(record.新規フォロワー数)
      };

      // データベースに保存
      await prisma.accountInsight.upsert({
        where: {
          companyId_date: {
            companyId,
            date
          }
        },
        update: accountInsight,
        create: accountInsight
      });

      console.log(`Imported data for date: ${record.日付}`);
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing account insights:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトの実行
importAccountInsights(); 