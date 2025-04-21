import fetch from 'node-fetch';

interface MediaInsights {
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

interface DayMetrics {
  date: string;
  posts: number;
  adReach: number;
  adLikes: number;
  adComments: number;
  adSaves: number;
  adShares: number;
  feedReach: number;
  feedLikes: number;
  feedComments: number;
  feedSaves: number;
  feedShares: number;
  storyReach: number;
  storyLikes: number;
  storyComments: number;
  storySaves: number;
  storyShares: number;
  reelReach: number;
  reelLikes: number;
  reelComments: number;
  reelSaves: number;
  reelShares: number;
  carouselReach: number;
  carouselLikes: number;
  carouselComments: number;
  carouselSaves: number;
  carouselShares: number;
}

interface MediaTypeCount {
  AD: number;
  FEED: number;
  STORY: number;
  REEL: number;
  CAROUSEL_ALBUM: number;
}

interface AccountInsightsResult {
  insights: DayMetrics[];
  mediaTypeCount: MediaTypeCount;
}

// メディアリストを取得する関数
async function getMediaList(igId: string, accessToken: string, since: string, until: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${igId}/media?fields=id,media_type,media_product_type,timestamp&since=${since}&until=${until}&limit=50&access_token=${accessToken}`
    );
    const data = await response.json();

    if (data.error) {
      console.error(`Error fetching media list for account ${igId}:`, data.error);
      console.error(`Error details:`, {
        message: data.error.message,
        type: data.error.type,
        code: data.error.code,
        fbtrace_id: data.error.fbtrace_id
      });
      return null;
    }

    if (!data.data || data.data.length === 0) {
      console.log(`No media found for account ${igId} between ${since} and ${until}`);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error(`Error fetching media list for account ${igId}:`, error);
    return null;
  }
}

// メディアインサイトを取得する関数
async function getMediaInsights(mediaId: string, accessToken: string): Promise<MediaInsights | null> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${mediaId}/insights?metric=reach,saved,shares,comments,likes&access_token=${accessToken}`
    );
    const data = await response.json();

    if (!data || !data.data) {
      console.log(`No insights data available for media ${mediaId}`);
      return null;
    }

    const insights: MediaInsights = {
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

export async function getAccountInsights(igId: string, accessToken: string, startDate: string, endDate: string): Promise<AccountInsightsResult> {
  try {
    const mediaList = await getMediaList(igId, accessToken, startDate, endDate);
    if (!mediaList || mediaList.length === 0) {
      console.log('No media found for the specified date range');
      return { insights: [], mediaTypeCount: {} as MediaTypeCount };
    }

    const mediaTypeCount: MediaTypeCount = {
      AD: 0,
      FEED: 0,
      STORY: 0,
      REEL: 0,
      CAROUSEL_ALBUM: 0
    };

    // 日付ごとのメトリクスを初期化
    const dateMetrics: { [key: string]: DayMetrics } = {};
    for (let d = new Date(startDate); d <= new Date(endDate); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateMetrics[dateStr] = {
        date: dateStr,
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
    }

    // 各メディアのインサイトを取得
    for (const media of mediaList) {
      const mediaDate = new Date(media.timestamp).toISOString().split('T')[0];
      if (!dateMetrics[mediaDate]) continue;

      const mediaType = media.media_type;
      mediaTypeCount[mediaType] = (mediaTypeCount[mediaType] || 0) + 1;
      dateMetrics[mediaDate].posts += 1;

      const mediaInsights = await getMediaInsights(media.id, accessToken);
      if (!mediaInsights) continue;

      // メディタイプに応じてメトリクスを更新
      const typePrefix = mediaType.toLowerCase().replace('_', '');
      dateMetrics[mediaDate][`${typePrefix}Reach`] += mediaInsights.reach || 0;
      dateMetrics[mediaDate][`${typePrefix}Likes`] += mediaInsights.likes || 0;
      dateMetrics[mediaDate][`${typePrefix}Comments`] += mediaInsights.comments || 0;
      dateMetrics[mediaDate][`${typePrefix}Saves`] += mediaInsights.saves || 0;
      dateMetrics[mediaDate][`${typePrefix}Shares`] += mediaInsights.shares || 0;
    }

    // 日付ごとのメトリクスを配列に変換
    const insightsArray = Object.values(dateMetrics);

    return {
      insights: insightsArray,
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