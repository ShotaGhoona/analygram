/**
 * get_instagram_account_info.mjs
 *
 *   ▸ 必要な環境変数
 *       FB_APP_ID
 *       FB_APP_SECRET
 *       FB_SHORT_LIVED_TOKEN
 *
 *   ▸ 使い方
 *       node src/scripts/get_instagram_account_info.mjs
 *
 *   ▸ 何をする？
 *       1. 短期トークン → 長期トークンへ交換
 *       2. /me/accounts でログインユーザーが管理する Facebook ページ一覧取得
 *       3. 各ページに紐づく instagram_business_account を確認
 *       4. 見つかった IG アカウント情報を JSON で標準出力
 *
 *   ▸ デバッグ強化ポイント
 *       fetchJson() ラッパーで
 *         - リクエスト URL
 *         - HTTP ステータス
 *         - 生のレスポンス文字列
 *       をすべてコンソールに出力
 */

import 'dotenv/config';
import fetch from 'node-fetch';

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

    /* 3) 各ページの IG ビジネスアカウント確認 */
    const instagramAccounts = [];

    for (const page of pagesData.data) {
      const igData = await fetchJson(
        `${FB_API}/${page.id}` +
          `?fields=instagram_business_account{id,username}` +
          `&access_token=${longLivedToken}`,
        `page_${page.id}`
      );

      if (igData.instagram_business_account) {
        instagramAccounts.push({
          accountName: igData.instagram_business_account.username,
          igId:        igData.instagram_business_account.id,
          longToken:   longLivedToken,
          fbPageId:    page.id
        });
      }
    }

    /* 4) 結果出力 */
    console.log('\n=== RESULT ===');
    console.log(JSON.stringify(instagramAccounts, null, 2));
  } catch (error) {
    console.error('\n--- ERROR DETAIL ---');
    console.error(error);
    console.error('--------------------');
    process.exit(1);
  }
}

getInstagramAccountInfo();
