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

async function getMediaInsights(mediaId, accessToken, metrics) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: accessToken,
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

async function fetchCompanyInstagramData(company) {
  try {
    console.log(`Fetching Instagram data for company: ${company.name}...`);
    
    const response = await axios.get(`${BASE_URL}/${company.igId}/media`, {
      params: {
        access_token: company.longToken,
        fields: 'id,caption,media_type,media_product_type,media_url,permalink,thumbnail_url,timestamp',
        limit: 50,
      },
    });

    const mediaData = response.data.data;
    const insights = [];

    for (const media of mediaData) {
      try {
        const metrics = getMetrics(media.media_type, media.media_product_type);
        const mediaInsights = await getMediaInsights(media.id, company.longToken, metrics);
        
        const postData = {
          id: media.id,
          companyId: company.id,
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
        console.error(`Skip ${media.id} for company ${company.name}:`, error?.response?.data?.error?.message ?? error);
      }
    }

    return insights;
  } catch (error) {
    console.error(`Failed to fetch Instagram data for company ${company.name}:`, error);
    return [];
  }
}

async function fetchAllCompaniesInstagramData() {
  try {
    const companies = await prisma.company.findMany();
    console.log(`Found ${companies.length} companies`);

    const allInsights = [];
    
    for (const company of companies) {
      const companyInsights = await fetchCompanyInstagramData(company);
      allInsights.push(...companyInsights);
    }

    const outputPath = path.join(__dirname, '..', 'data', 'post_insights.json');
    fs.writeFileSync(outputPath, JSON.stringify(allInsights, null, 2));
    console.log(`Saved ${allInsights.length} items to database and JSON file ✔`);

    return allInsights;
  } catch (error) {
    console.error('Failed to fetch all companies Instagram data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchAllCompaniesInstagramData; 