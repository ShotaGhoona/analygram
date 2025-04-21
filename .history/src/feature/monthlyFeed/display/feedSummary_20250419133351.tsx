'use client';

import { PostInsight } from '@/types/post';
import { useMemo } from 'react';

interface FeedSummaryProps {
  data: PostInsight[];
}

interface SummaryData {
  totalReach: number;
  totalLikes: number;
  totalComments: number;
  totalSaves: number;
  totalShares: number;
  averageEG: number;
  postCount: number;
  feedCount: number;
  reelsCount: number;
}

const FeedSummary = ({ data }: FeedSummaryProps) => {
  const summary = useMemo<SummaryData>(() => {
    return data.reduce((acc, post) => {
      return {
        totalReach: acc.totalReach + Number(post.リーチ),
        totalLikes: acc.totalLikes + post.いいね,
        totalComments: acc.totalComments + post.コメント,
        totalSaves: acc.totalSaves + post.保存,
        totalShares: acc.totalShares + post.シェア,
        averageEG: acc.averageEG + parseFloat(post.EG率.replace('%', '')),
        postCount: acc.postCount + 1,
        feedCount: acc.feedCount + (post.メディアのプロダクト種別 === 'FEED' ? 1 : 0),
        reelsCount: acc.reelsCount + (post.メディアのプロダクト種別 === 'REELS' ? 1 : 0),
      };
    }, {
      totalReach: 0,
      totalLikes: 0,
      totalComments: 0,
      totalSaves: 0,
      totalShares: 0,
      averageEG: 0,
      postCount: 0,
      feedCount: 0,
      reelsCount: 0,
    });
  }, [data]);

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">投稿概要</h3>
        <div className="space-y-2">
          <p>総投稿数: {summary.postCount}件</p>
          <p>フィード: {summary.feedCount}件</p>
          <p>リール: {summary.reelsCount}件</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">リーチ＆エンゲージメント</h3>
        <div className="space-y-2">
          <p>総リーチ数: {summary.totalReach.toLocaleString()}</p>
          <p>平均EG率: {(summary.averageEG / summary.postCount).toFixed(2)}%</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">インタラクション</h3>
        <div className="space-y-2">
          <p>いいね: {summary.totalLikes.toLocaleString()}</p>
          <p>コメント: {summary.totalComments.toLocaleString()}</p>
          <p>保存: {summary.totalSaves.toLocaleString()}</p>
          <p>シェア: {summary.totalShares.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedSummary; 