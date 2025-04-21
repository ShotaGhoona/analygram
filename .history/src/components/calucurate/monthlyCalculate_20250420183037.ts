import { PostInsight } from "@/types/post";
import { AccountInsight } from '@/types/accountInsight';

export interface DailyData {
  date: string;
  followers: number;
  follows: number;
  impressions: number;
  reach_total: number;
  profile_visits: number;
  website_taps: number;
}

export const filterMarchData = (data: DailyData[], startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return data.filter(item => {
    const date = new Date(item.date);
    return date >= start && date <= end;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateNewFollowers = (
  data: AccountInsight[],
  startDate: string,
  endDate: string
): DailyData[] => {
  if (!data || data.length === 0) return [];

  const start = new Date(startDate);
  const end = new Date(endDate);
  const result: DailyData[] = [];

  // 日付ごとのデータを集計
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayData = data.find(item => 
      new Date(item.date).toISOString().split('T')[0] === dateStr
    );

    if (dayData) {
      result.push({
        date: d.getDate().toString(),
        followers: dayData.followers - (data.find(item => 
          new Date(item.date).toISOString().split('T')[0] === 
          new Date(d.getTime() - 86400000).toISOString().split('T')[0]
        )?.followers || dayData.followers),
        follows: dayData.follows,
        impressions: dayData.impressions,
        reach_total: dayData.reachTotal,
        profile_visits: dayData.profileVisits,
        website_taps: dayData.webTaps,
      });
    } else {
      result.push({
        date: d.getDate().toString(),
        followers: 0,
        follows: 0,
        impressions: 0,
        reach_total: 0,
        profile_visits: 0,
        website_taps: 0,
      });
    }
  }

  return result;
};

export type MonthlyFollowData = {
  yearMonth: string;
  followers: number;
  follows: number;
};

export const aggregateFollowData = (data: DailyData[]): MonthlyFollowData[] => {
  const monthlyData = data.reduce<Record<string, { followers: number; follows: number }>>(
    (acc, item) => {
      const date = new Date(item.date);
      const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          followers: item.followers,
          follows: item.follows,
        };
      } else {
        acc[yearMonth] = {
          followers: Math.max(acc[yearMonth].followers, item.followers),
          follows: Math.max(acc[yearMonth].follows, item.follows),
        };
      }
      return acc;
    },
    {}
  );

  return Object.entries(monthlyData)
    .map(([yearMonth, data]) => ({
      yearMonth,
      followers: data.followers,
      follows: data.follows,
    }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}; 

export const filterMonthlyData = (data: PostInsight[], targetMonth: string) => {
    return data.filter(post => post.作成月 === targetMonth);
  };
  
  export const calculatePostMetrics = (posts: PostInsight[]) => {
    const totalImpressions = posts.reduce((sum, post) => sum + Number(post.インプレッション || 0), 0);
    const totalReach = posts.reduce((sum, post) => sum + Number(post.リーチ), 0);
    const totalEngagements = posts.reduce((sum, post) => sum + post.合計, 0);
    const totalLikes = posts.reduce((sum, post) => sum + post.いいね, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.コメント, 0);
    const totalSaves = posts.reduce((sum, post) => sum + post.保存, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.シェア, 0);
    const totalViews = posts.reduce((sum, post) => sum + Number(post.視聴数 || 0), 0);
  
    const avgEngagementRate = (posts.reduce((sum, post) => {
      const rate = parseFloat(post.EG率.replace('%', ''));
      return sum + rate;
    }, 0) / posts.length).toFixed(2);
  
    return {
      totalImpressions,
      totalReach,
      totalEngagements,
      totalLikes,
      totalComments,
      totalSaves,
      totalShares,
      totalViews,
      avgEngagementRate,
      postCount: posts.length,
    };
  };
  
  export const calculatePostTypeDistribution = (posts: PostInsight[]) => {
    const feedPosts = posts.filter(post => post.メディアのプロダクト種別 === 'FEED').length;
    const reelsPosts = posts.filter(post => post.メディアのプロダクト種別 === 'REELS').length;
  
    return {
      feed: feedPosts,
      reels: reelsPosts,
    };
  };
  
  export const calculateDailyEngagement = (posts: PostInsight[]) => {
    return posts.map(post => ({
      date: post.作成日.split(' ')[0],
      engagements: post.合計,
      likes: post.いいね,
      comments: post.コメント,
      saves: post.保存,
      shares: post.シェア,
    }));
  }; 