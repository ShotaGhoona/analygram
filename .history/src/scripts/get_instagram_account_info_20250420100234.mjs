
import 'dotenv/config';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FB_API = 'https://graph.facebook.com/v18.0';

/* ---------- 共通ラッパー ---------- */
async function fetchJson(url, label) {
  console.log(`\n======= ${label} =======`);
  console.log(`GET ${url}\n`);
  const res  = await fetch(url);
  const text = await res.text();
  console.log(`[status] ${res.status}`);
  console.log(`[raw]    ${text}\n`);
  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    throw new Error(`[${label}] JSON 解析失敗`);
  }
}
/* ---------- メイン ---------- */
async function getInstagramAccountInfo() {
  try {
    const { FB_APP_ID, FB_APP_SECRET, FB_SHORT_LIVED_TOKEN } = process.env;
    if (!FB_APP_ID || !FB_APP_SECRET || !FB_SHORT_LIVED_TOKEN) {
      throw new Error(
        '環境変数 FB_APP_ID / FB_APP_SECRET / FB_SHORT_LIVED_TOKEN を設定してください。'
      );
    }

    /* 1) 長期アクセストークン取得 */
    const longLivedTokenData = await fetchJson(
      `${FB_API}/oauth/access_token` +
        `?grant_type=fb_exchange_token` +
        `&client_id=${FB_APP_ID}` +
        `&client_secret=${FB_APP_SECRET}` +
        `&fb_exchange_token=${FB_SHORT_LIVED_TOKEN}`,
      'exchange_token'
    );

    const longLivedToken = longLivedTokenData.access_token;
    if (!longLivedToken) {
      throw new Error('長期アクセストークンの取得に失敗');
    }

    /* 2) Facebook ページ一覧取得 */
    const pagesData = await fetchJson(
      `${FB_API}/me/accounts?access_token=${longLivedToken}`,
      'me/accounts'
    );

    if (!pagesData.data?.length) {
      throw new Error('Facebookページが見つかりませんでした');
    }

    /* 3) 各ページの IG ビジネスアカウント確認とDB保存 */
    for (const page of pagesData.data) {
      const igData = await fetchJson(
        `${FB_API}/${page.id}` +
          `?fields=instagram_business_account{id,username}` +
          `&access_token=${longLivedToken}`,
        `page_${page.id}`
      );

      if (igData.instagram_business_account) {
        const { id: igId, username: name } = igData.instagram_business_account;
        
        // Upsert: 既存のレコードは更新、存在しない場合は新規作成
        await prisma.company.upsert({
          where: { igId },
          update: {
            name,
            longToken,
          },
          create: {
            name,
            igId,
            longToken,
          },
        });
        
        console.log(`✓ 保存完了: ${name}`);
      }
    }

    console.log('\n処理が完了しました');
  } catch (error) {
    console.error('エラー:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

getInstagramAccountInfo();
