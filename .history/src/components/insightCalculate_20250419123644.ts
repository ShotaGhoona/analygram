type ContentType = {
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
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

export const aggregateMonthlyData = (dailyData: DailyData[]) => {
  const monthlyData = dailyData.reduce<Record<string, any>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    const engagement = calculateTotalEngagement(curr);
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        year_month: yearMonth,
        followers: curr.followers,
        new_followers: 0, // 後で計算
        impressions: curr.impressions || 0,
        likes: engagement.likes,
        comments: engagement.comments,
        shares: engagement.shares,
        saves: engagement.saves,
      };
    } else {
      acc[yearMonth].followers = Math.max(acc[yearMonth].followers, curr.followers);
      acc[yearMonth].impressions += curr.impressions || 0;
      acc[yearMonth].likes += engagement.likes;
      acc[yearMonth].comments += engagement.comments;
      acc[yearMonth].shares += engagement.shares;
      acc[yearMonth].saves += engagement.saves;
    }
    
    return acc;
  }, {});

  // 新規フォロワー数を計算
  const monthlyArray = Object.values(monthlyData);
  monthlyArray.sort((a: any, b: any) => b.year_month.localeCompare(a.year_month));

  for (let i = 0; i < monthlyArray.length; i++) {
    const nextMonth = monthlyArray[i + 1];
    if (nextMonth) {
      monthlyArray[i].new_followers = monthlyArray[i].followers - nextMonth.followers;
    } else {
      monthlyArray[i].new_followers = monthlyArray[i].followers;
    }
  }

  return monthlyArray;
};

export const aggregateFollowData = (dailyData: DailyData[]) => {
  // 月ごとにデータをグループ化
  const monthlyData = dailyData.reduce<Record<string, { followers: number; follows: number }>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        followers: curr.followers || 0,
        follows: curr.follows || 0,
      };
    } else {
      // その月の最大値を使用
      acc[yearMonth].followers = Math.max(acc[yearMonth].followers, curr.followers || 0);
      acc[yearMonth].follows = Math.max(acc[yearMonth].follows, curr.follows || 0);
    }
    
    return acc;
  }, {});

  // グラフ用のデータ配列を作成
  return Object.entries(monthlyData)
    .map(([yearMonth, data]) => ({
      yearMonth,
      followers: data.followers,
      follows: data.follows,
    }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}; 