import axios from 'axios';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const BASE_URL = 'https://graph.facebook.com/v21.0';

// 昨日の日付範囲を取得する関数
function getYesterdayDateRange() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const startDate = yesterday.toISOString().split('T')[0];
  const endDate = startDate;

  return { startDate, endDate };
}

const getMetrics = (mediaType, productType) => {
  if (productType === 'REELS') {
    return ['plays', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'];
  }
  if (mediaType === 'STORY') {
    return ['impressions', 'reach', 'replies', 'taps_forward', 'taps_back'];
  }
  // IMAGE / VIDEO / CAROUSEL
  return ['impressions', 'reach', 'saved', 'likes', 'comments', 'shares', 'total_interactions'];
};

async function getMediaInsights(mediaId, accessToken, metrics) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${mediaId}/insights`, {
      params: {
        access_token: accessToken,
        metric: metrics.join(','),
      },
    });

    const values = Object.fromEntries(
      data.data.map(m => [m.name, m.values?.[0]?.value ?? 0])
    );

    return {
      impressions: values.impressions ?? 0,
      plays: values.plays ?? 0,
      reach: values.reach ?? 0,
      likes: values.likes ?? 0,
      comments: values.comments ?? 0,
      shares: values.shares ?? 0,
      saved: values.saved ?? 0,
      replies: values.replies ?? 0,
      engagement: values.total_interactions ?? (values.likes + values.comments + values.shares + values.saved)
    };
  } catch (error) {
    console.error(`メディアID ${mediaId} のインサイト取得に失敗:`, error?.response?.data?.error?.message ?? error.message);
    return null;
  }
}

async function fetchCompanyDailyInstagramData(company) {
  try {
    console.log(`\n[${company.name}] 昨日の投稿データの取得を開始...`);
    
    const { startDate, endDate } = getYesterdayDateRange();
    
    // 昨日の投稿一覧を取得
    const { data: { data: mediaList } } = await axios.get(
      `${BASE_URL}/${company.igId}/media`,
      {
        params: {
          access_token: company.longToken,
          fields: 'id,caption,media_type,media_product_type,media_url,permalink,thumbnail_url,timestamp',
          since: startDate,
          until: endDate,
        },
      }
    );

    console.log(`[${company.name}] ${mediaList.length}件の投稿を処理中...`);

    // 各投稿のインサイトを取得して保存
    for (const media of mediaList) {
      try {
        // インサイトを取得
        const metrics = getMetrics(media.media_type, media.media_product_type);
        const mediaInsights = await getMediaInsights(media.id, company.longToken, metrics);
        
        if (!mediaInsights) {
          console.log(`[${company.name}] 投稿 ${media.id} のインサイト取得をスキップ`);
          continue;
        }

        // データを整形
        const postData = {
          id: media.id,
          companyId: company.id,
          igId: company.igId,
          caption: media.caption ?? '',
          mediaType: media.media_type,
          mediaProductType: media.media_product_type,
          mediaUrl: media.media_url,
          thumbnailUrl: media.thumbnail_url,
          permalink: media.permalink,
          timestamp: new Date(media.timestamp),
          ...mediaInsights,
        };

        // DBに保存
        await prisma.postInsight.upsert({
          where: { id: media.id },
          update: postData,
          create: postData,
        });

        console.log(`[${company.name}] 投稿 ${media.id} を保存完了`);

      } catch (error) {
        console.error(`[${company.name}] 投稿 ${media.id} の処理中にエラー:`, error?.response?.data?.error?.message ?? error.message);
      }
    }

    console.log(`[${company.name}] 処理完了`);
  } catch (error) {
    console.error(`[${company.name}] データ取得に失敗:`, error?.response?.data?.error?.message ?? error.message);
  }
}

async function fetchAllCompaniesDailyInstagramData() {
  try {
    // アクティブな企業を取得
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        igId: true,
        longToken: true,
      },
    });

    console.log(`\n${companies.length}社の昨日の投稿データを取得します`);
    
    if (companies.length === 0) {
      console.log('警告: データベースに企業データが存在しません。');
      return;
    }

    // 各企業の投稿データを取得
    for (const company of companies) {
      await fetchCompanyDailyInstagramData(company);
    }

    console.log('\n全ての処理が完了しました');
  } catch (error) {
    console.error('エラー詳細:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export default fetchAllCompaniesDailyInstagramData;

// スクリプトを直接実行した場合のみ実行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchAllCompaniesDailyInstagramData().catch(console.error);
} 