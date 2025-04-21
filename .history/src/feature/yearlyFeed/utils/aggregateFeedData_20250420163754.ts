import { AccountInsight } from '@/types/accountInsight';

export interface AggregatedFeedData {
  feedReach: number;
  feedEngagement: number;
  feedLikes: number;
  feedComments: number;
  feedShares: number;
  feedSaves: number;
}

export const aggregateFeedData = (data: AccountInsight[]): AggregatedFeedData => {
  return data.reduce((acc, curr) => {
    return {
      feedReach: acc.feedReach + (curr.feedReach || 0),
      feedEngagement: acc.feedEngagement + (curr.feedEngagement || 0),
      feedLikes: acc.feedLikes + (curr.feedLikes || 0),
      feedComments: acc.feedComments + (curr.feedComments || 0),
      feedShares: acc.feedShares + (curr.feedShares || 0),
      feedSaves: acc.feedSaves + (curr.feedSaves || 0),
    };
  }, {
    feedReach: 0,
    feedEngagement: 0,
    feedLikes: 0,
    feedComments: 0,
    feedShares: 0,
    feedSaves: 0,
  });
}; 