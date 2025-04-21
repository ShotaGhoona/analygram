import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_product_type: 'FEED' | 'REELS' | 'STORY';
  permalink: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp: string;
  insights: {
    data: Array<{
      name: string;
      values: Array<{
        value: number;
      }>;
    }>;
  };
}

interface PostInsight {
  id: string;
  作成月: string;
  作成日: string;
  キャプション: string;
  メディアのプロダクト種別: 'FEED' | 'REELS' | 'STORY';
  メディアの種別: 'CAROUSEL_ALBUM' | 'VIDEO';
  メディアURL: string;
  パーマリンク: string;
  インプレッション: string;
  リーチ: string;
  EG率: string;
  合計: number;
  いいね: number;
  コメント: number;
  保存: number;
  シェア: number;
  視聴数?: string;
  サムネイル: string;
}

const INSTAGRAM_ID = process.env.INSTAGRAM_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!INSTAGRAM_ID || !ACCESS_TOKEN) {
  throw new Error('Instagram ID and Access Token are required in .env file');
}

const BASE_URL = 'https://graph.facebook.com/v18.0';

const getMediaInsights = async (mediaId: string): Promise<{
  impressions: number;
  reach: number;
  engagement: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  videoViews?: number;
}> => {
  const response = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
    params: {
      access_token: ACCESS_TOKEN,
      metric: 'impressions,reach,engagement,likes,comments,saves,shares,video_views',
    },
  });

  const insights = response.data.data.reduce((acc: any, item: any) => {
    acc[item.name] = item.values[0].value;
    return acc;
  }, {});

  return {
    impressions: insights.impressions || 0,
    reach: insights.reach || 0,
    engagement: insights.engagement || 0,
    likes: insights.likes || 0,
    comments: insights.comments || 0,
    saves: insights.saves || 0,
    shares: insights.shares || 0,
    videoViews: insights.video_views,
  };
};

const fetchInstagramData = async (): Promise<PostInsight[]> => {
  try {
    // 1ヶ月前の日付を計算
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // メディアデータを取得
    const response = await axios.get(`${BASE_URL}/${INSTAGRAM_ID}/media`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,media_type,media_product_type,permalink,thumbnail_url,caption,timestamp',
        since: Math.floor(oneMonthAgo.getTime() / 1000),
      },
    });

    const mediaData: InstagramMedia[] = response.data.data;
    const postInsights: PostInsight[] = [];

    // 各メディアのインサイトデータを取得
    for (const media of mediaData) {
      const insights = await getMediaInsights(media.id);

      const postDate = new Date(media.timestamp);
      const formattedDate = postDate.toISOString().replace('T', ' ').split('.')[0];

      const postInsight: PostInsight = {
        id: media.id,
        作成月: `${postDate.getFullYear()}/${String(postDate.getMonth() + 1).padStart(2, '0')}`,
        作成日: formattedDate,
        キャプション: media.caption || '',
        メディアのプロダクト種別: media.media_product_type,
        メディアの種別: media.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL_ALBUM' : 'VIDEO',
        メディアURL: media.thumbnail_url || '',
        パーマリンク: media.permalink,
        インプレッション: insights.impressions.toString(),
        リーチ: insights.reach.toString(),
        EG率: `${((insights.engagement / insights.reach) * 100).toFixed(2)}%`,
        合計: insights.engagement,
        いいね: insights.likes,
        コメント: insights.comments,
        保存: insights.saves,
        シェア: insights.shares,
        視聴数: insights.videoViews?.toString(),
        サムネイル: media.thumbnail_url || '',
      };

      postInsights.push(postInsight);
    }

    // データをJSONファイルとして保存
    const outputPath = path.join(process.cwd(), 'src', 'data', 'post_insights.json');
    fs.writeFileSync(outputPath, JSON.stringify(postInsights, null, 2));

    return postInsights;
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    throw error;
  }
};

export default fetchInstagramData; 