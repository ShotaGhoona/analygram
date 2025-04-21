import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }

    // 日付フィルターの条件を作成
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter['timestamp'] = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const posts = await prisma.postInsight.findMany({
      where: {
        companyId,
        ...dateFilter,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 