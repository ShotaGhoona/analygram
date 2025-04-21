import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const INSTAGRAM_ID = process.env.INSTAGRAM_ID;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const COMPANY_ID = process.env.COMPANY_ID;

if (!INSTAGRAM_ID || !ACCESS_TOKEN || !COMPANY_ID) {
  throw new Error('INSTAGRAM_ID, ACCESS_TOKEN, and COMPANY_ID must be set in .env file');
}

const BASE_URL = 'https://graph.facebook.com/v21.0';

const getMetrics = (mediaType, productType) => {
  if (productType === 'REELS') {
    return ['plays', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'];
  }
  if (mediaType === 'STORY') {
    return ['impressions', 'reach', 'replies', 'taps_forward', 'taps_back'];
  }
  // IMAGE / VIDEO / CAROUSEL
  return ['impressions', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'];
};

async function getMediaInsights(mediaId, metrics) {
  try {
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
        fields: 'id,caption,media_type,media_product_type,media_url,permalink,thumbnail_url,timestamp',
        limit: 50,
      },
    });

    const mediaData = response.data.data;
    const insights = [];

    for (const media of mediaData) {
      try {
        const metrics = getMetrics(media.media_type, media.media_product_type);
        const mediaInsights = await getMediaInsights(media.id, metrics);
        
        const postData = {
          id: media.id,
          companyId: COMPANY_ID,
          igId: INSTAGRAM_ID,
          caption: media.caption,
          mediaType: media.media_type,
          mediaProductType: media.media_product_type,
          mediaUrl: media.media_url,
          permalink: media.permalink,
          thumbnailUrl: media.thumbnail_url,
          timestamp: new Date(media.timestamp),
          ...mediaInsights,
        };

        insights.push(postData);

        await prisma.postInsight.upsert({
          where: { id: media.id },
          update: postData,
          create: postData,
        });

      } catch (error) {
        console.error(`skip ${media.id}:`, error?.response?.data?.error?.message ?? error);
      }
    }

    const outputPath = path.join(__dirname, '..', 'data', 'post_insights.json');
    fs.writeFileSync(outputPath, JSON.stringify(insights, null, 2));
    console.log(`saved ${insights.length} items to database and JSON file ✔`);

    return insights;
  } catch (error) {
    console.error('Failed to fetch Instagram data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchInstagramData; 