import { getAccountInsights } from '@/utils/getAccountInsight';
import { logger } from '../utils/logger';
import type { Company, PrismaClient } from '@prisma/client';

interface FetchAccountInsightsParams {
  company: Company;
  startDate: Date;
  endDate: Date;
  prisma: PrismaClient;
}

export async function fetchAccountInsights({
  company,
  startDate,
  endDate,
  prisma
}: FetchAccountInsightsParams) {
  try {
    const insights = await getAccountInsights(company.igId, startDate, endDate);
    
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