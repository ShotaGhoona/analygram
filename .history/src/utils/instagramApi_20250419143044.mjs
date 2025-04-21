import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const INSTAGRAM_ID = process.env.INSTAGRAM_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

if (!INSTAGRAM_ID || !ACCESS_TOKEN) {
  throw new Error('INSTAGRAM_ID and ACCESS_TOKEN must be set in .env file');
}

const BASE_URL = 'https://graph.facebook.com/v18.0';

async function getMediaInsights(mediaId) {
  try {
    // エンゲージメント関連のメトリクス
    const engagementMetrics = ['engagement', 'saved'];
    const engagementResponse = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: ACCESS_TOKEN,
        metric: engagementMetrics.join(','),
      },
    });

    // リーチとインプレッション関連のメトリクス
    const reachMetrics = ['impressions', 'reach'];
    const reachResponse = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: ACCESS_TOKEN,
        metric: reachMetrics.join(','),
      },
    });

    // いいね、コメント、シェアの取得
    const mediaResponse = await axios.get(`${BASE_URL}/${mediaId}`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'likes.summary(true),comments.summary(true),shares',
      },
    });

    const engagementData = engagementResponse.data.data.reduce((acc, item) => {
      acc[item.name] = item.values[0].value;
      return acc;
    }, {});

    const reachData = reachResponse.data.data.reduce((acc, item) => {
      acc[item.name] = item.values[0].value;
      return acc;
    }, {});

    const likes = mediaResponse.data.likes?.summary?.total_count || 0;
    const comments = mediaResponse.data.comments?.summary?.total_count || 0;
    const shares = mediaResponse.data.shares?.count || 0;

    return {
      impressions: reachData.impressions || 0,
      reach: reachData.reach || 0,
      saved: engagementData.saved || 0,
      likes,
      comments,
      shares,
      engagement: likes + comments + shares + (engagementData.saved || 0),
    };
  } catch (error) {
    console.error('Error fetching media insights:', error);
    throw error;
  }
}

async function fetchInstagramData() {
  try {
    console.log('Fetching Instagram data...');
    
    const response = await axios.get(`${BASE_URL}/${INSTAGRAM_ID}/media`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,caption,media_type,media_url,permalink,thumbnail_url,timestamp',
        limit: 50,
      },
    });

    const mediaData = response.data.data;
    const insights = [];

    for (const media of mediaData) {
      try {
        const mediaInsights = await getMediaInsights(media.id);
        insights.push({
          id: media.id,
          caption: media.caption,
          mediaType: media.media_type,
          mediaUrl: media.media_url,
          permalink: media.permalink,
          thumbnailUrl: media.thumbnail_url,
          timestamp: media.timestamp,
          ...mediaInsights,
        });
      } catch (error) {
        console.error(`Error fetching insights for media ${media.id}:`, error);
      }
    }

    const outputPath = path.join(__dirname, '..', 'data', 'post_insights.json');
    fs.writeFileSync(outputPath, JSON.stringify(insights, null, 2));
    console.log('Data saved to post_insights.json');
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    throw error;
  }
}

export default fetchInstagramData; 