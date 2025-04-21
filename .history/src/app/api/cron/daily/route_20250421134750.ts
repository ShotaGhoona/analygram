import { NextResponse } from 'next/server';
import fetchDailyAccountInsights from '@/utils/getAccountInsightByDay';
import fetchDailyPostInsights from '@/utils/getPostInsightByDay';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5分のタイムアウト設定

export async function GET() {
  try {
    console.log('日次データ取得を開始します...');

    // アカウントインサイトの取得
    console.log('\n=== アカウントインサイトの取得を開始 ===');
    await fetchDailyAccountInsights();

    // 投稿インサイトの取得
    console.log('\n=== 投稿インサイトの取得を開始 ===');
    await fetchDailyPostInsights();

    console.log('\n全ての処理が完了しました');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 