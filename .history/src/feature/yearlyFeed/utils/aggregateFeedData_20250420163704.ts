import { AccountInsight } from '@/types/accountInsight';

export interface AggregatedFeedData {
  feedReach: number;
  feedEngagement: number;
  feedLikes: number;
  feedComments: number;
  feedShares: number;
  feedSaves: number;
}

export function aggregateFeedData(data: AccountInsight[]): AggregatedFeedData {
  return data.reduce(
    (acc, insight) => ({
      feedReach: acc.feedReach + (insight.feedReach || 0),
      feedEngagement: acc.feedEngagement + (insight.feedEngagement || 0),
      feedLikes: acc.feedLikes + (insight.feedLikes || 0),
      feedComments: acc.feedComments + (insight.feedComments || 0),
      feedShares: acc.feedShares + (insight.feedShares || 0),
      feedSaves: acc.feedSaves + (insight.feedSaves || 0),
    }),
    {
      feedReach: 0,
      feedEngagement: 0,
      feedLikes: 0,
      feedComments: 0,
      feedShares: 0,
      feedSaves: 0,
    }
  );
} 