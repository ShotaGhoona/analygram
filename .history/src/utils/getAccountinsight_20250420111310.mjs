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
    const metrics = [
      'impressions',
      'reach',
      'saved',
      'likes',
      'comments',
      'shares',
      'plays',
      'total_interactions'
    ].join(',');

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media insights for media ${mediaId}:`, data);
      return null;
    }

    const insights = {};
    data.data.forEach(metric => {
      insights[metric.name] = metric.values[0]?.value || 0;
    });

    return insights;
  } catch (error) {
    console.error(`Error fetching media insights for media ${mediaId}:`, error);
    return null;
  }
}

async function getAccountInsights(igId, accessToken, startDate, endDate) {
  try {
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);
    const mediaInsights = {};
    const mediaTypeCount = {
      AD: 0,
      FEED: 0,
      STORY: 0,
      REEL: 0,
      CAROUSEL_ALBUM: 0
    };

    for (const media of mediaList) {
      const mediaType = media.media_type;
      mediaTypeCount[mediaType] = (mediaTypeCount[mediaType] || 0) + 1;

      const insights = await getMediaInsights(media.id, accessToken);
      if (insights) {
        const date = new Date(media.timestamp).toISOString().split('T')[0];
        if (!mediaInsights[date]) {
          mediaInsights[date] = {
            date,
            posts: 1,
            adReach: 0,
            feedReach: 0,
            storyReach: 0,
            reelReach: 0,
            carouselReach: 0,
            adLikes: 0,
            feedLikes: 0,
            storyLikes: 0,
            reelLikes: 0,
            carouselLikes: 0,
            adComments: 0,
            feedComments: 0,
            storyComments: 0,
            reelComments: 0,
            carouselComments: 0,
            adSaves: 0,
            feedSaves: 0,
            storySaves: 0,
            reelSaves: 0,
            carouselSaves: 0,
            adShares: 0,
            feedShares: 0,
            storyShares: 0,
            reelShares: 0,
            carouselShares: 0
          };
        } else {
          mediaInsights[date].posts++;
        }

        const typePrefix = mediaType.toLowerCase();
        mediaInsights[date][`${typePrefix}Reach`] += insights.reach || 0;
        mediaInsights[date][`${typePrefix}Likes`] += insights.likes || 0;
        mediaInsights[date][`${typePrefix}Comments`] += insights.comments || 0;
        mediaInsights[date][`${typePrefix}Saves`] += insights.saved || 0;
        mediaInsights[date][`${typePrefix}Shares`] += insights.shares || 0;
      }
    }

    return {
      insights: Object.values(mediaInsights),
      mediaTypeCount
    };
  } catch (error) {
    console.error('Error in getAccountInsights:', error);
    return {
      insights: [],
      mediaTypeCount: {
        AD: 0,
        FEED: 0,
        STORY: 0,
        REEL: 0,
        CAROUSEL_ALBUM: 0
      }
    };
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
