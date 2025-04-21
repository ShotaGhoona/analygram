import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const accountInsights = await prisma.accountInsight.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json(accountInsights);
  } catch (error) {
    console.error('Error fetching account insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account insights' },
      { status: 500 }
    );
  }
} 