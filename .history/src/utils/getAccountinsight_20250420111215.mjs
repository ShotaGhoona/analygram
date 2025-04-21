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

    return data.data || [];
  } catch (error) {
    console.error(`Error fetching media list for account ${igId}:`, error);
    return null;
  }
}

// メディアインサイトを取得する関数
async function getMediaInsights(mediaId, accessToken) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${mediaId}/insights?metric=reach,impressions,engagement,saved,shares&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media insights for media ${mediaId}:`, data.error);
      return null;
    }

    return data.data || [];
  } catch (error) {
    console.error(`Error fetching media insights for media ${mediaId}:`, error);
    return null;
  }
}

async function getAccountInsights(igId, accessToken, startDate, endDate) {
  // 通常のメトリクス（日次データ）
  const dailyMetrics = [
    'follower_count',
    'reach',
    'impressions'
  ].join(',');

  try {
    // 基本的なインサイトの取得
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
              dailyInsights[date] = {
                mediaTypeMetrics: {
                  AD: { reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 },
                  FEED: { reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 },
                  STORY: { reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 },
                  REEL: { reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 },
                  CAROUSEL_ALBUM: { reach: 0, likes: 0, comments: 0, saves: 0, shares: 0 }
                }
              };
            }
            dailyInsights[date][metric.name] = value.value;
          });
        }
      });
    }

    // メディアリストの取得
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);
    if (mediaList) {
      // 投稿数をカウント
      const postsCount = mediaList.length;

      // メディアタイプごとのインサイトを集計
      for (const media of mediaList) {
        const date = new Date(media.timestamp).toISOString().split('T')[0];
        if (!dailyInsights[date]) continue;

        const insights = await getMediaInsights(media.id, accessToken);
        if (!insights) continue;

        const mediaType = media.media_product_type || media.media_type;
        const metrics = dailyInsights[date].mediaTypeMetrics[mediaType];
        if (metrics) {
          insights.forEach(insight => {
            switch (insight.name) {
              case 'reach':
                metrics.reach += insight.values[0]?.value || 0;
                break;
              case 'likes':
                metrics.likes += insight.values[0]?.value || 0;
                break;
              case 'comments':
                metrics.comments += insight.values[0]?.value || 0;
                break;
              case 'saved':
                metrics.saves += insight.values[0]?.value || 0;
                break;
              case 'shares':
                metrics.shares += insight.values[0]?.value || 0;
                break;
            }
          });
        }
      }

      // 各日付のデータにposts数を追加
      Object.values(dailyInsights).forEach(dayData => {
        dayData.posts = postsCount;
      });
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
        const { mediaTypeMetrics, ...basicMetrics } = metrics;
        
        await prisma.accountInsight.upsert({
          where: {
            companyId_igId_date: {
              companyId: company.id,
              igId: company.igId,
              date: new Date(date)
            }
          },
          update: {
            followers: basicMetrics.follower_count || 0,
            follows: 0,
            posts: basicMetrics.posts || 0,
            reachTotal: basicMetrics.reach || 0,
            impressions: basicMetrics.impressions || 0,
            profileVisits: 0,
            webTaps: 0,
            // メディアタイプ別のメトリクス
            adReach: mediaTypeMetrics.AD.reach,
            adLikes: mediaTypeMetrics.AD.likes,
            adComments: mediaTypeMetrics.AD.comments,
            adSaves: mediaTypeMetrics.AD.saves,
            adShares: mediaTypeMetrics.AD.shares,
            feedReach: mediaTypeMetrics.FEED.reach,
            feedLikes: mediaTypeMetrics.FEED.likes,
            feedComments: mediaTypeMetrics.FEED.comments,
            feedSaves: mediaTypeMetrics.FEED.saves,
            feedShares: mediaTypeMetrics.FEED.shares,
            storyReach: mediaTypeMetrics.STORY.reach,
            storyLikes: mediaTypeMetrics.STORY.likes,
            storyComments: mediaTypeMetrics.STORY.comments,
            storySaves: mediaTypeMetrics.STORY.saves,
            storyShares: mediaTypeMetrics.STORY.shares,
            reelReach: mediaTypeMetrics.REEL.reach,
            reelLikes: mediaTypeMetrics.REEL.likes,
            reelComments: mediaTypeMetrics.REEL.comments,
            reelSaves: mediaTypeMetrics.REEL.saves,
            reelShares: mediaTypeMetrics.REEL.shares,
            carouselReach: mediaTypeMetrics.CAROUSEL_ALBUM.reach,
            carouselLikes: mediaTypeMetrics.CAROUSEL_ALBUM.likes,
            carouselComments: mediaTypeMetrics.CAROUSEL_ALBUM.comments,
            carouselSaves: mediaTypeMetrics.CAROUSEL_ALBUM.saves,
            carouselShares: mediaTypeMetrics.CAROUSEL_ALBUM.shares,
          },
          create: {
            companyId: company.id,
            igId: company.igId,
            date: new Date(date),
            followers: basicMetrics.follower_count || 0,
            follows: 0,
            posts: basicMetrics.posts || 0,
            reachTotal: basicMetrics.reach || 0,
            impressions: basicMetrics.impressions || 0,
            profileVisits: 0,
            webTaps: 0,
            likesTotal: 0,
            commentsTotal: 0,
            savesTotal: 0,
            sharesTotal: 0,
            // メディアタイプ別のメトリクス
            adReach: mediaTypeMetrics.AD.reach,
            adLikes: mediaTypeMetrics.AD.likes,
            adComments: mediaTypeMetrics.AD.comments,
            adSaves: mediaTypeMetrics.AD.saves,
            adShares: mediaTypeMetrics.AD.shares,
            feedReach: mediaTypeMetrics.FEED.reach,
            feedLikes: mediaTypeMetrics.FEED.likes,
            feedComments: mediaTypeMetrics.FEED.comments,
            feedSaves: mediaTypeMetrics.FEED.saves,
            feedShares: mediaTypeMetrics.FEED.shares,
            storyReach: mediaTypeMetrics.STORY.reach,
            storyLikes: mediaTypeMetrics.STORY.likes,
            storyComments: mediaTypeMetrics.STORY.comments,
            storySaves: mediaTypeMetrics.STORY.saves,
            storyShares: mediaTypeMetrics.STORY.shares,
            reelReach: mediaTypeMetrics.REEL.reach,
            reelLikes: mediaTypeMetrics.REEL.likes,
            reelComments: mediaTypeMetrics.REEL.comments,
            reelSaves: mediaTypeMetrics.REEL.saves,
            reelShares: mediaTypeMetrics.REEL.shares,
            carouselReach: mediaTypeMetrics.CAROUSEL_ALBUM.reach,
            carouselLikes: mediaTypeMetrics.CAROUSEL_ALBUM.likes,
            carouselComments: mediaTypeMetrics.CAROUSEL_ALBUM.comments,
            carouselSaves: mediaTypeMetrics.CAROUSEL_ALBUM.saves,
            carouselShares: mediaTypeMetrics.CAROUSEL_ALBUM.shares,
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
