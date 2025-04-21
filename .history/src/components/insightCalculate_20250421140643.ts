import { AccountInsight } from '@/types/accountInsight';

export const aggregateFeedData = (insights: AccountInsight[]) => {
  const monthlyData = insights.reduce<Record<string, any>>((acc, curr) => {
    const date = new Date(curr.date);
    const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        yearMonth,
        feed_reach: curr.feedReach || 0,
        feed_engagement: (
          (curr.feedLikes || 0) +
          (curr.feedComments || 0) +
          (curr.feedShares || 0) +
          (curr.feedSaves || 0)
        ),
        feed_likes: curr.feedLikes || 0,
        feed_comments: curr.feedComments || 0,
        feed_shares: curr.feedShares || 0,
        feed_saves: curr.feedSaves || 0,
      };
    } else {
      acc[yearMonth].feed_reach += curr.feedReach || 0;
      acc[yearMonth].feed_engagement += (
        (curr.feedLikes || 0) +
        (curr.feedComments || 0) +
        (curr.feedShares || 0) +
        (curr.feedSaves || 0)
      );
      acc[yearMonth].feed_likes += curr.feedLikes || 0;
      acc[yearMonth].feed_comments += curr.feedComments || 0;
      acc[yearMonth].feed_shares += curr.feedShares || 0;
      acc[yearMonth].feed_saves += curr.feedSaves || 0;
    }
    
    return acc;
  }, {});

  return Object.values(monthlyData).sort((a, b) => b.yearMonth.localeCompare(a.yearMonth));
}; 