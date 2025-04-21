export interface PostInsight {
  作成月: string;
  作成日: string;
  キャプション: string;
  メディアのプロダクト種別: 'FEED' | 'REELS';
  メディアの種別: 'CAROUSEL_ALBUM' | 'VIDEO';
  メディアURL: string;
  パーマリンク: string;
  インプレッション: number;
  リーチ: number;
  EG率: string;
  合計: number;
  いいね: number;
  コメント: number;
  保存: number;
  シェア: number;
  視聴数?: number;
} 