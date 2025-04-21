import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

async function insertPastData() {
  try {
    // データファイルの読み込み
    const dataPath = path.join(__dirname, '../data/past_insights.json');
    const rawData = await fs.readFile(dataPath, 'utf-8');
    const pastData = JSON.parse(rawData);

    // 全てのcompanyを取得
    const companies = await prisma.company.findMany();
    const companyMap = companies.reduce((acc, company) => {
      acc[company.igId] = company.id;
      return acc;
    }, {});

    console.log(`${Object.keys(companyMap).length}社の企業データを読み込みました`);

    // データの挿入
    let successCount = 0;
    let errorCount = 0;

    for (const data of pastData) {
      try {
        const companyId = companyMap[data.igId];
        if (!companyId) {
          console.error(`IGアカウントID: ${data.igId} に対応する企業が見つかりません`);
          errorCount++;
          continue;
        }

        await prisma.accountInsight.create({
          data: {
            companyId,
            igId: data.igId,
            date: new Date(data.date),
            followers: data.followers,
            follows: data.follows,
            posts: data.posts || 0,
            reachTotal: data.reachTotal,
            reachFollower: data.reachFollower || 0,
            reachNonFollower: data.reachNonFollower || 0,
            reachUnknown: data.reachUnknown || 0,
            impressions: data.impressions,
            profileVisits: data.profileVisits,
            webTaps: data.webTaps,
            likesTotal: data.likesTotal,
            commentsTotal: data.commentsTotal,
            savesTotal: data.savesTotal,
            sharesTotal: data.sharesTotal,
            // メディアタイプ別のメトリクス
            adReach: data.adReach || 0,
            adLikes: data.adLikes || 0,
            adComments: data.adComments || 0,
            adSaves: data.adSaves || 0,
            adShares: data.adShares || 0,
            feedReach: data.feedReach || 0,
            feedLikes: data.feedLikes || 0,
            feedComments: data.feedComments || 0,
            feedSaves: data.feedSaves || 0,
            feedShares: data.feedShares || 0,
            storyReach: data.storyReach || 0,
            storyLikes: data.storyLikes || 0,
            storyComments: data.storyComments || 0,
            storySaves: data.storySaves || 0,
            storyShares: data.storyShares || 0,
            reelReach: data.reelReach || 0,
            reelLikes: data.reelLikes || 0,
            reelComments: data.reelComments || 0,
            reelSaves: data.reelSaves || 0,
            reelShares: data.reelShares || 0,
            carouselReach: data.carouselReach || 0,
            carouselLikes: data.carouselLikes || 0,
            carouselComments: data.carouselComments || 0,
            carouselSaves: data.carouselSaves || 0,
            carouselShares: data.carouselShares || 0,
          }
        });
        successCount++;

        if (successCount % 100 === 0) {
          console.log(`${successCount}件のデータを挿入しました`);
        }
      } catch (error) {
        console.error(`データの挿入に失敗しました:`, error);
        errorCount++;
      }
    }

    console.log('\n=== 処理完了 ===');
    console.log(`成功: ${successCount}件`);
    console.log(`失敗: ${errorCount}件`);

  } catch (error) {
    console.error('スクリプトの実行中にエラーが発生しました:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトの実行
insertPastData(); 