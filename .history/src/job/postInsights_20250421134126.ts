import { getPostInsights } from '@/services/instagram/postInsights';
import { logger } from '@/services/utils/logger';
import type { Company, PrismaClient } from '@prisma/client';

interface FetchPostInsightsParams {
  company: Company;
  startDate: Date;
  endDate: Date;
  prisma: PrismaClient;
}

export async function fetchPostInsights({
  company,
  startDate,
  endDate,
  prisma
}: FetchPostInsightsParams) {
  try {
    const posts = await getPostInsights(company.igId, startDate, endDate);
    
    // データベースに保存
    for (const post of posts) {
      await prisma.postInsight.create({
        data: {
          companyId: company.id,
          ...post
        }
      });
    }

    logger.info(`投稿インサイト取得成功: ${company.name}`);
  } catch (error) {
    logger.error(`投稿インサイト取得失敗: ${company.name}`, error);
    throw error;
  }
}