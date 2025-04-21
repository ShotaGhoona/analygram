type DailyData = {
  date: string;
  followers: number;
  follows: number;
  impressions: number;
  reach_total: number;
  profile_visits: number;
  website_taps: number;
};

export const filterMarchData = (data: DailyData[]) => {
  return data.filter(item => {
    const date = new Date(item.date);
    return date.getFullYear() === 2025 && date.getMonth() === 2; // 3月は2
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const calculateNewFollowers = (data: DailyData[]) => {
  const marchData = filterMarchData(data);
  return marchData.map((item, index) => {
    const prevFollowers = index > 0 ? marchData[index - 1].followers : item.followers;
    return {
      date: new Date(item.date).getDate(),
      newFollowers: item.followers - prevFollowers,
      impressions: item.impressions,
      reach: item.reach_total,
      profileViews: item.profile_visits,
      websiteTaps: item.website_taps,
    };
  });
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