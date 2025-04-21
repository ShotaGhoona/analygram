import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const year = searchParams.get('year');

    if (!companyId || !year) {
      return NextResponse.json(
        { error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    const startDate = new Date(parseInt(year), 0, 1); // 1月1日
    const endDate = new Date(parseInt(year), 11, 31); // 12月31日

    const insights = await prisma.accountInsight.findMany({
      where: {
        companyId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching yearly insights:', error);
    return NextResponse.json(
      { error: 'データの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 