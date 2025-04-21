import { PostInsight } from '@/types/post';

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