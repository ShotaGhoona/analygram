import { AccountInsight } from '@/types/accountInsight';

type ContentType = {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  reach?: number;
};

type DailyData = {
  date: string;
  followers: number;
  follows: number;
  impressions: number;
  ad?: ContentType;
  feed?: ContentType;
  story?: ContentType;
  reel?: ContentType;
  carousel?: ContentType;
  reach_total?: number;
  profile_visits?: number;
  website_taps?: number;
};

export const calculateTotalEngagement = (data: DailyData) => {
  const calculateTotal = (metric: keyof ContentType) => {
    return (
      (data.ad?.[metric] || 0) +
      (data.feed?.[metric] || 0) +
      (data.story?.[metric] || 0) +
      (data.reel?.[metric] || 0) +
      (data.carousel?.[metric] || 0)
    );
  };

  return {
    likes: calculateTotal('likes'),
    comments: calculateTotal('comments'),
    shares: calculateTotal('shares'),
    saves: calculateTotal('saves'),
  };
};

interface MonthlyData {
  year_month: string;
  followers: number;
  follows: number;
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

interface FollowData {
  yearMonth: string;
  followers: number;
  follows: number;
}

export const aggregateMonthlyData = (insights: AccountInsight[]): MonthlyData[] => {
  const monthlyData = new Map<string, MonthlyData>();

  // データを月ごとにグループ化
  insights.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        year_month: yearMonth,
        followers: 0,
        follows: 0,
        new_followers: 0,
        reach: 0,
        impressions: 0,
        profile_views: 0,
        website_taps: 0,
        likes: 0,
        comments: 0,
        saves: 0,
        shares: 0,
      });
    }

    const monthData = monthlyData.get(yearMonth)!;
    monthData.followers = insight.followers;
    monthData.follows = insight.follows;
    monthData.reach += insight.reachTotal;
    monthData.impressions += insight.impressions;
    monthData.profile_views += insight.profileVisits;
    monthData.website_taps += insight.webTaps;
    monthData.likes += insight.likesTotal;
    monthData.comments += insight.commentsTotal;
    monthData.saves += insight.savesTotal;
    monthData.shares += insight.sharesTotal;
  });

  // 新規フォロワー数の計算
  const sortedData = Array.from(monthlyData.values()).sort((a, b) => 
    a.year_month.localeCompare(b.year_month)
  );

  for (let i = 1; i < sortedData.length; i++) {
    sortedData[i].new_followers = sortedData[i].followers - sortedData[i - 1].followers;
  }

  return sortedData;
};

export const aggregateFollowData = (insights: AccountInsight[]): FollowData[] => {
  const monthlyData = new Map<string, FollowData>();

  // データを月ごとにグループ化
  insights.forEach((insight) => {
    const date = new Date(insight.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;

    if (!monthlyData.has(yearMonth)) {
      monthlyData.set(yearMonth, {
        yearMonth,
        followers: insight.followers,
        follows: insight.follows,
      });
    }
  });

  return Array.from(monthlyData.values()).sort((a, b) => 
    a.yearMonth.localeCompare(b.yearMonth)
  );
};

export const aggregateFeedData = (insights: AccountInsight[]) => {
  const monthlyData = insights.reduce<Record<string, any>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        yearMonth,
        feed_reach: 0,
        feed_engagement: 0,
        feed_likes: 0,
        feed_comments: 0,
        feed_shares: 0,
        feed_saves: 0,
      };
    }
    
    acc[yearMonth].feed_reach += curr.feedReach || 0;
    acc[yearMonth].feed_likes += curr.feedLikes || 0;
    acc[yearMonth].feed_comments += curr.feedComments || 0;
    acc[yearMonth].feed_shares += curr.feedShares || 0;
    acc[yearMonth].feed_saves += curr.feedSaves || 0;
    acc[yearMonth].feed_engagement = 
      acc[yearMonth].feed_likes +
      acc[yearMonth].feed_comments +
      acc[yearMonth].feed_shares +
      acc[yearMonth].feed_saves;
    
    return acc;
  }, {});

  return Object.values(monthlyData).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
};

export const aggregateReelData = (dailyData: DailyData[]) => {
  const monthlyData = dailyData.reduce<Record<string, any>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        yearMonth,
        reel_reach: (curr.reel?.reach || 0),
        reel_engagement: (
          (curr.reel?.likes || 0) +
          (curr.reel?.comments || 0) +
          (curr.reel?.shares || 0) +
          (curr.reel?.saves || 0)
        ),
        reel_likes: (curr.reel?.likes || 0),
        reel_comments: (curr.reel?.comments || 0),
        reel_shares: (curr.reel?.shares || 0),
        reel_saves: (curr.reel?.saves || 0),
      };
    } else {
      acc[yearMonth].reel_reach += (curr.reel?.reach || 0);
      acc[yearMonth].reel_engagement += (
        (curr.reel?.likes || 0) +
        (curr.reel?.comments || 0) +
        (curr.reel?.shares || 0) +
        (curr.reel?.saves || 0)
      );
      acc[yearMonth].reel_likes += (curr.reel?.likes || 0);
      acc[yearMonth].reel_comments += (curr.reel?.comments || 0);
      acc[yearMonth].reel_shares += (curr.reel?.shares || 0);
      acc[yearMonth].reel_saves += (curr.reel?.saves || 0);
    }
    
    return acc;
  }, {});

  return Object.values(monthlyData).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
};

export const aggregateStoryData = (dailyData: DailyData[]) => {
  const monthlyData = dailyData.reduce<Record<string, any>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        yearMonth,
        story_reach: (curr.story?.reach || 0),
        story_engagement: (
          (curr.story?.likes || 0) +
          (curr.story?.comments || 0) +
          (curr.story?.shares || 0) +
          (curr.story?.saves || 0)
        ),
        story_likes: (curr.story?.likes || 0),
        story_comments: (curr.story?.comments || 0),
        story_shares: (curr.story?.shares || 0),
        story_saves: (curr.story?.saves || 0),
      };
    } else {
      acc[yearMonth].story_reach += (curr.story?.reach || 0);
      acc[yearMonth].story_engagement += (
        (curr.story?.likes || 0) +
        (curr.story?.comments || 0) +
        (curr.story?.shares || 0) +
        (curr.story?.saves || 0)
      );
      acc[yearMonth].story_likes += (curr.story?.likes || 0);
      acc[yearMonth].story_comments += (curr.story?.comments || 0);
      acc[yearMonth].story_shares += (curr.story?.shares || 0);
      acc[yearMonth].story_saves += (curr.story?.saves || 0);
    }
    
    return acc;
  }, {});

  return Object.values(monthlyData).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
}; 