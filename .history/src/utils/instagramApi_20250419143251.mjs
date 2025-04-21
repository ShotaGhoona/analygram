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

const PER_MEDIA_METRICS = [
  'impressions',
  'reach',
  'saved',
  'likes',
  'comments',
  'shares',
  'total_interactions'
];

async function getMediaInsights(mediaId) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: ACCESS_TOKEN,
        metric: PER_MEDIA_METRICS.join(','),
      },
    });

    const metrics = data.data.reduce((acc, m) => {
      acc[m.name] = m.values?.[0]?.value ?? 0;
      return acc;
    }, {});

    return {
      impressions: metrics.impressions,
      reach: metrics.reach,
      saved: metrics.saved,
      likes: metrics.likes,
      comments: metrics.comments,
      shares: metrics.shares,
      engagement: metrics.total_interactions
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

    return insights;
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    throw error;
  }
}

export default fetchInstagramData; 