import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function getAccountInsights(igId, accessToken, startDate, endDate) {
  // 通常のメトリクス（日次データ）
  const dailyMetrics = [
    'follower_count',
    'reach',
    'impressions',
    'profile_views',
    'website_clicks'
  ].join(',');

  // total_valueが必要なメトリクス
  const totalValueMetrics = [
    'follows_and_unfollows'
  ].join(',');

  // 2つの異なるAPIリクエストを実行
  const [dailyData, totalValueData] = await Promise.all([
    // 日次データの取得
    fetch(`https://graph.facebook.com/v19.0/${igId}/insights?metric=${dailyMetrics}&period=day&since=${startDate}&until=${endDate}&access_token=${accessToken}`)
      .then(res => res.json()),
    
    // total_valueデータの取得
    fetch(`https://graph.facebook.com/v19.0/${igId}/insights?metric=${totalValueMetrics}&period=day&metric_type=total_value&since=${startDate}&until=${endDate}&access_token=${accessToken}`)
      .then(res => res.json())
  ]);

  if (dailyData.error) {
    console.error(`Error fetching daily insights for account ${igId}:`, dailyData.error);
    return null;
  }

  if (totalValueData.error) {
    console.error(`Error fetching total value insights for account ${igId}:`, totalValueData.error);
    return null;
  }

  try {
    // データを日付ごとにグループ化
    const dailyInsights = {};
    
    // 日次データの処理
    dailyData.data.forEach(metric => {
      metric.values.forEach(value => {
        const date = value.end_time.split('T')[0];
        if (!dailyInsights[date]) {
          dailyInsights[date] = {};
        }
        dailyInsights[date][metric.name] = value.value;
      });
    });

    // total_valueデータの処理
    totalValueData.data.forEach(metric => {
      metric.values.forEach(value => {
        const date = value.end_time.split('T')[0];
        if (!dailyInsights[date]) {
          dailyInsights[date] = {};
        }
        dailyInsights[date][metric.name] = value.value;
      });
    });

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
    
    // 2024年3月のデータを取得
    const startDate = '2024-03-01';
    const endDate = '2024-03-31';

    for (const company of companies) {
      console.log(`Fetching insights for company: ${company.name}`);
      
      const insights = await getAccountInsights(
        company.igId,
        company.longToken,
        startDate,
        endDate
      );

      if (!insights) continue;

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
            follows: metrics.follows_and_unfollows || 0,
            reachTotal: metrics.reach || 0,
            impressions: metrics.impressions || 0,
            profileVisits: metrics.profile_views || 0,
            webTaps: metrics.website_clicks || 0,
          },
          create: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(date),
            followers: metrics.follower_count || 0,
            follows: metrics.follows_and_unfollows || 0,
            reachTotal: metrics.reach || 0,
            impressions: metrics.impressions || 0,
            profileVisits: metrics.profile_views || 0,
            webTaps: metrics.website_clicks || 0,
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
