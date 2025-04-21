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

const BASE_URL = 'https://graph.facebook.com/v21.0';

const METRIC_MAP = {
  IMAGE: ['impressions', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'],
  VIDEO: ['impressions', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'],
  CAROUSEL_ALBUM: ['impressions', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'],
  REEL: ['plays', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'],
  STORY: ['impressions', 'reach', 'replies', 'taps_forward', 'taps_back']
};

async function getMediaInsights(mediaId, mediaType) {
  try {
    const metrics = METRIC_MAP[mediaType] ?? METRIC_MAP.IMAGE;
    
    const { data } = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: ACCESS_TOKEN,
        metric: metrics.join(','),
      },
    });

    const values = Object.fromEntries(
      data.data.map(m => [m.name, m.values?.[0]?.value ?? 0])
    );

    return {
      impressions: values.impressions ?? 0,
      plays: values.plays ?? 0,
      reach: values.reach ?? 0,
      likes: values.likes ?? 0,
      comments: values.comments ?? 0,
      shares: values.shares ?? 0,
      saved: values.saved ?? 0,
      replies: values.replies ?? 0,
      engagement: values.total_interactions ?? (values.likes + values.comments + values.shares + values.saved)
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
        const mediaInsights = await getMediaInsights(media.id, media.media_type);
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
        console.error(`skip ${media.id}:`, error?.response?.data?.error?.message ?? error);
      }
    }

    const outputPath = path.join(__dirname, '..', 'data', 'post_insights.json');
    fs.writeFileSync(outputPath, JSON.stringify(insights, null, 2));
    console.log('Data saved to post_insights.json');

    return insights;
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    throw error;
  }
}

export default fetchInstagramData; 