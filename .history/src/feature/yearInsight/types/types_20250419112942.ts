// 日次データの型定義
export interface DailyInsightData {
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  profile_views: number;
  website_taps: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
}

// 月次集計データの型定義
export interface MonthlyInsightData {
  year_month: string;
  followers: number;
  new_followers: number;
  reach: number;
  impressions: number;
  profile_views: number;
  website_taps: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
} 