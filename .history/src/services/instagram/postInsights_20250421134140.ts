import { prisma } from '@/lib/prisma';
import { getPostInsights } from '@/services/instagram/postInsights';
import { logger } from '@/services/utils/logger';
import { getDateRange } from '@/job/utils/dateUtils';
import type { Company } from '@prisma/client';

export async function fetchPostInsights(company: Company) {
  try {
    const { startDate, endDate } = getDateRange();
    
    const posts = await getPostInsights(
      company.igId,
      startDate,
      endDate
    );

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