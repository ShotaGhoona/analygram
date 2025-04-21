import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    console.log('クエリパラメータ:', { companyId, startDate, endDate });

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // 日付フィルターの条件を作成
    const dateFilter: { timestamp?: { gte: Date; lte: Date } } = {};
    if (startDate && endDate) {
      dateFilter.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // クエリ条件をログ出力
    const queryCondition = {
      where: {
        companyId,
        ...dateFilter,
      },
      orderBy: {
        timestamp: 'desc',
      },
    };
    console.log('クエリ条件:', JSON.stringify(queryCondition, null, 2));

    const posts = await prisma.postInsight.findMany(queryCondition);
    
    console.log(`取得した投稿数: ${posts.length}`);
    if (posts.length === 0) {
      console.log('投稿が見つかりませんでした。データベースを確認してください。');
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 