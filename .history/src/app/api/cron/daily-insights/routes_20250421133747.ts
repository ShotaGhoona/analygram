import { NextResponse } from 'next/server';
import { fetchAccountInsights } from '@/services/instagram/accountInsights';
import { fetchPostInsights } from '@/services/instagram/postInsights';
import { prisma } from '@/lib/prisma';
import { logger } from '@/services/utils/logger';

// Vercelの認証トークンを検証
const validateToken = (request: Request) => {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    throw new Error('Unauthorized');
  }
};

export async function GET(request: Request) {
  try {
    // 認証チェック
    validateToken(request);

    // 全企業の取得
    const companies = await prisma.company.findMany();
    logger.info(`開始: ${companies.length}社の日次データ取得`);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // 各企業のデータを取得
    for (const company of companies) {
      try {
        await Promise.all([
          fetchAccountInsights(company),
          fetchPostInsights(company)
        ]);
        results.success++;
        logger.info(`完了: ${company.name}`);
      } catch (error) {
        results.failed++;
        results.errors.push(`${company.name}: ${error.message}`);
        logger.error(`失敗: ${company.name}`, error);
      }
    }

    return NextResponse.json({
      status: 'success',
      message: '日次データ取得完了',
      results
    });

  } catch (error) {
    logger.error('日次データ取得エラー:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: error.message 
      },
      { status: error.message === 'Unauthorized' ? 401 : 500 }
    );
  }
}

// Vercel Cron Job設定
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 最大実行時間を5分に設定