import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// 昨日の日付範囲を取得する関数
function getYesterdayDateRange() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = startDate;

  return { startDate, endDate };
}

// メディアリストを取得する関数
async function getMediaList(igId, accessToken, since, until) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?fields=id,media_type,media_product_type,timestamp&since=${since}&until=${until}&limit=50&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media list for account ${igId}:`, data.error);
      return null;
    }

    if (!data.data || data.data.length === 0) {
      console.log(`No media found for account ${igId} on ${since}`);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching media list for account ${igId}:`, error);
    return null;
  }
}

// メディアインサイトを取得する関数
async function getMediaInsights(mediaId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${mediaId}/insights?metric=reach,saved,shares,comments,likes&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || !data.data) {
      console.log(`No insights data available for media ${mediaId}`);
      return null;
    }

    const insights = {
      reach: 0,
      likes: 0,
      comments: 0,
      saves: 0,
      shares: 0
    };

    data.data.forEach(metric => {
      switch (metric.name) {
        case 'reach':
          insights.reach = parseInt(metric.values[0].value) || 0;
          break;
        case 'likes':
          insights.likes = parseInt(metric.values[0].value) || 0;
          break;
        case 'comments':
          insights.comments = parseInt(metric.values[0].value) || 0;
          break;
        case 'saved':
          insights.saves = parseInt(metric.values[0].value) || 0;
          break;
        case 'shares':
          insights.shares = parseInt(metric.values[0].value) || 0;
          break;
      }
    });

    return insights;
  } catch (error) {
    console.error(`Error fetching insights for media ${mediaId}:`, error);
    return null;
  }
}

// アカウントインサイトを取得する関数
async function getAccountInsightsByDay(igId, accessToken) {
  try {
    const { startDate, endDate } = getYesterdayDateRange();
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);

    // 昨日の日付のメトリクスを初期化
    const metrics = {
      date: startDate,
      posts: 0,
      adReach: 0,
      adLikes: 0,
      adComments: 0,
      adSaves: 0,
      adShares: 0,
      feedReach: 0,
      feedLikes: 0,
      feedComments: 0,
      feedSaves: 0,
      feedShares: 0,
      storyReach: 0,
      storyLikes: 0,
      storyComments: 0,
      storySaves: 0,
      storyShares: 0,
      reelReach: 0,
      reelLikes: 0,
      reelComments: 0,
      reelSaves: 0,
      reelShares: 0,
      carouselReach: 0,
      carouselLikes: 0,
      carouselComments: 0,
      carouselSaves: 0,
      carouselShares: 0,
    };

    if (!mediaList || mediaList.length === 0) {
      return metrics;
    }

    // 各メディアのインサイトを取得
    for (const media of mediaList) {
      metrics.posts += 1;
      const mediaInsights = await getMediaInsights(media.id, accessToken);
      if (!mediaInsights) continue;

      // メディアタイプに応じてメトリクスを更新
      const typePrefix = media.media_type.toLowerCase().replace('_', '');
      metrics[`${typePrefix}Reach`] += mediaInsights.reach || 0;
      metrics[`${typePrefix}Likes`] += mediaInsights.likes || 0;
      metrics[`${typePrefix}Comments`] += mediaInsights.comments || 0;
      metrics[`${typePrefix}Saves`] += mediaInsights.saves || 0;
      metrics[`${typePrefix}Shares`] += mediaInsights.shares || 0;
    }

    return metrics;
  } catch (error) {
    console.error('Error in getAccountInsightsByDay:', error);
    return null;
  }
}

// メイン処理関数
async function fetchAndSaveDailyAccountInsights() {
  try {
    // すべての企業を取得
    const companies = await prisma.company.findMany();
    console.log(`${companies.length}社の昨日のデータを取得します`);

    for (const company of companies) {
      try {
        console.log(`\n[${company.name}] データ取得開始...`);
        
        const insights = await getAccountInsightsByDay(company.igId, company.longToken);
        if (!insights) {
          console.log(`[${company.name}] データ取得に失敗`);
          continue;
        }

        // データをDBに保存
        await prisma.accountInsight.create({
          data: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(insights.date),
            ...insights
          }
        });

        console.log(`[${company.name}] データを保存完了`);
      } catch (error) {
        console.error(`[${company.name}] エラー:`, error);
      }
    }

    console.log('\n全ての処理が完了しました');
  } catch (error) {
    console.error('Error in fetchAndSaveDailyAccountInsights:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchAndSaveDailyAccountInsights;

// スクリプトを直接実行した場合のみ実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchAndSaveDailyAccountInsights().catch(console.error);
} 