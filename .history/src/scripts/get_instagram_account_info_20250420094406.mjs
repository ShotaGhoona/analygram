import 'dotenv/config';
import fetch from 'node-fetch';

async function getInstagramAccountInfo() {
  try {
    // Facebook Graph APIのエンドポイント
    const FB_API = 'https://graph.facebook.com/v18.0';
    
    // 環境変数から認証情報を取得
    const { FB_APP_ID, FB_APP_SECRET, FB_SHORT_LIVED_TOKEN } = process.env;
    
    if (!FB_APP_ID || !FB_APP_SECRET || !FB_SHORT_LIVED_TOKEN) {
      throw new Error('必要な環境変数が設定されていません。FB_APP_ID, FB_APP_SECRET, FB_SHORT_LIVED_TOKENを設定してください。');
    }

    // 長期アクセストークンを取得
    const longLivedTokenResponse = await fetch(
      `${FB_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${FB_APP_ID}&client_secret=${FB_APP_SECRET}&fb_exchange_token=${FB_SHORT_LIVED_TOKEN}`
    );
    const longLivedTokenData = await longLivedTokenResponse.json();
    
    if (!longLivedTokenData.access_token) {
      throw new Error('長期アクセストークンの取得に失敗しました: ' + JSON.stringify(longLivedTokenData));
    }
    
    const longLivedToken = longLivedTokenData.access_token;

    // ユーザーのFacebookページ一覧を取得
    const pagesResponse = await fetch(
      `${FB_API}/me/accounts?access_token=${longLivedToken}`
    );
    const pagesData = await pagesResponse.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      throw new Error('Facebookページが見つかりませんでした');
    }

    // 各ページに紐づくInstagramビジネスアカウント情報を取得
    const instagramAccounts = [];
    
    for (const page of pagesData.data) {
      const igResponse = await fetch(
        `${FB_API}/${page.id}?fields=instagram_business_account{id,username}&access_token=${longLivedToken}`
      );
      const igData = await igResponse.json();
      
      if (igData.instagram_business_account) {
        instagramAccounts.push({
          accountName: igData.instagram_business_account.username,
          igId: igData.instagram_business_account.id,
          longToken: longLivedToken
        });
      }
    }

    // 結果を出力
    console.log(JSON.stringify(instagramAccounts, null, 2));

  } catch (error) {
    console.error('エラーが発生しました:', error.message);
    process.exit(1);
  }
}

// スクリプトを実行
getInstagramAccountInfo(); 