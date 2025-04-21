import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const mediaTypes = searchParams.get('mediaTypes')?.split(',') || [];

    console.log('クエリパラメータ:', { companyId, startDate, endDate, mediaTypes });

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // クエリ条件を作成
    const where: any = { companyId };

    // 日付フィルター
    if (startDate && endDate) {
      where.timestamp = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    // メディアタイプフィルター
    if (mediaTypes.length > 0) {
      where.mediaProductType = {
        in: mediaTypes,
      };
    }

    // クエリ条件をログ出力
    const queryCondition = {
      where,
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