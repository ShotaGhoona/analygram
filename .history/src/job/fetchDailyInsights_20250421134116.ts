import { PrismaClient } from '@prisma/client';
import { fetchAccountInsights } from './accountInsights';
import { fetchPostInsights } from './postInsights';
import { logger } from '@/services/utils/logger';
import { getDateRange } from '@/job/utils/dateUtils';
import { handleError } from '@/job/utils/errorHandler';

const prisma = new PrismaClient();

async function fetchDailyInsights() {
  try {
    // 全企業の取得
    const companies = await prisma.company.findMany();
    logger.info(`開始: ${companies.length}社の日次データ取得`);

    const { startDate, endDate } = getDateRange();
    
    for (const company of companies) {
      try {
        // アカウントインサイトの取得
        await fetchAccountInsights({
          company,
          startDate,
          endDate,
          prisma
        });

        // 投稿インサイトの取得
        await fetchPostInsights({
          company,
          startDate,
          endDate,
          prisma
        });

        logger.info(`完了: ${company.name}の日次データ取得`);
      } catch (error) {
        handleError(error, `企業: ${company.name}のデータ取得に失敗`);
      }
    }

    logger.info('全ての日次データ取得が完了しました');
  } catch (error) {
    handleError(error, '日次データ取得プロセスでエラーが発生');
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchDailyInsights;