import { prisma } from '@/lib/prisma';
import { getAccountInsights } from '@/utils/getAccountInsight';
import { logger } from '../utils/logger';
import { getDateRange } from '../utils/dateUtils';
import type { Company } from '@prisma/client';

export async function fetchAccountInsights(company: Company) {
  try {
    const { startDate, endDate } = getDateRange();
    
    const insights = await getAccountInsights(
      company.igId,
      startDate,
      endDate
    );

    // データベースに保存
    await prisma.accountInsight.create({
      data: {
        companyId: company.id,
        ...insights
      }
    });

    logger.info(`アカウントインサイト取得成功: ${company.name}`);
  } catch (error) {
    logger.error(`アカウントインサイト取得失敗: ${company.name}`, error);
    throw error;
  }
}