import { PrismaClient } from '@prisma/client';
import { getAccountInsights } from '@/utils/getAccountinsight';
import { logger } from '@/services/utils/logger';
import { getDateRange } from '@/services/utils/dateUtils';

// Prisma型の定義
type Company = {
  id: string;
  name: string;
  igId: string;
};

export async function fetchAccountInsights(company: Company) {
  try {
    const { startDate, endDate } = getDateRange();
    
    const insights = await getAccountInsights(
      company.igId,
      startDate,
      endDate
    );

    const prisma = new PrismaClient();

    // データベースに保存
    await prisma.accountInsight.create({
      data: {
        companyId: company.id,
        igId: company.igId,
        date: new Date(),
        ...insights
      }
    });

    await prisma.$disconnect();

    logger.info(`アカウントインサイト取得成功: ${company.name}`);
  } catch (error) {
    logger.error(`アカウントインサイト取得失敗: ${company.name}`, error);
    throw error;
  }
} 