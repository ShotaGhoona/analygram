import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// 日付範囲を計算する関数
function getDateRange() {
  const end = new Date();
  end.setDate(end.getDate() - 1); // 昨日まで

  const start = new Date(end);
  start.setDate(start.getDate() - 29); // 30日前

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

async function getAccountInsights(igId, accessToken, startDate, endDate) {
  // 通常のメトリクス（日次データ）
  const dailyMetrics = [
    'follower_count',
    'reach',
    'impressions'
  ].join(',');

  try {
    // 日次データの取得
    const dailyResponse = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/insights?metric=${dailyMetrics}&period=day&since=${startDate}&until=${endDate}&access_token=${accessToken}`
    );
    const dailyData = await dailyResponse.json();

    if (dailyData.error) {
      console.error(`Error fetching daily insights for account ${igId}:`, dailyData.error);
      return null;
    }

    // データを日付ごとにグループ化
    const dailyInsights = {};
    
    // 日次データの処理
    if (dailyData.data && Array.isArray(dailyData.data)) {
      dailyData.data.forEach(metric => {
        if (metric.values && Array.isArray(metric.values)) {
          metric.values.forEach(value => {
            const date = value.end_time.split('T')[0];
            if (!dailyInsights[date]) {
              dailyInsights[date] = {};
            }
            dailyInsights[date][metric.name] = value.value;
          });
        }
      });
    }

    // データが空の場合はnullを返す
    if (Object.keys(dailyInsights).length === 0) {
      console.log(`No insights data available for account ${igId}`);
      return null;
    }

    return dailyInsights;
  } catch (error) {
    console.error(`Error processing insights for account ${igId}:`, error);
    return null;
  }
}

async function fetchAndSaveAccountInsights() {
  try {
    // すべての企業を取得
    const companies = await prisma.company.findMany();
    
    // 過去30日間のデータを取得
    const { startDate, endDate } = getDateRange();
    console.log(`Fetching data from ${startDate} to ${endDate}`);

    for (const company of companies) {
      console.log(`Fetching insights for company: ${company.name}`);
      
      const insights = await getAccountInsights(
        company.igId,
        company.longToken,
        startDate,
        endDate
      );

      if (!insights) {
        console.log(`Skipping company ${company.name} due to no data`);
        continue;
      }

      // 各日付のインサイトをデータベースに保存
      for (const [date, metrics] of Object.entries(insights)) {
        await prisma.accountInsight.upsert({
          where: {
            companyId_igId_date: {
              companyId: company.id,
              igId: company.igId,
              date: new Date(date)
            }
          },
          update: {
            followers: metrics.follower_count || 0,
            follows: 0, // follows_and_unfollowsは現在サポートされていないため0を設定
            reachTotal: metrics.reach || 0,
            impressions: metrics.impressions || 0,
            profileVisits: 0, // APIでサポートされなくなったため0を設定
            webTaps: 0, // APIでサポートされなくなったため0を設定
          },
          create: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(date),
            followers: metrics.follower_count || 0,
            follows: 0, // follows_and_unfollowsは現在サポートされていないため0を設定
            reachTotal: metrics.reach || 0,
            impressions: metrics.impressions || 0,
            profileVisits: 0, // APIでサポートされなくなったため0を設定
            webTaps: 0, // APIでサポートされなくなったため0を設定
            likesTotal: 0,
            commentsTotal: 0,
            savesTotal: 0,
            sharesTotal: 0,
          }
        });
      }

      console.log(`Saved insights for company: ${company.name}`);
    }

    console.log('All account insights have been fetched and saved.');
  } catch (error) {
    console.error('Error in fetchAndSaveAccountInsights:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトを実行
fetchAndSaveAccountInsights();
