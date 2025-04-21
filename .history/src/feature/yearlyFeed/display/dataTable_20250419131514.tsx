'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateFeedData } from '@/components/calucurate/insightCalculate';
import { useMemo } from 'react';

const DataTable = () => {
  const aggregatedData = useMemo(() => {
    return aggregateFeedData(accountInsightData);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-2 text-left font-medium">月</th>
            <th className="px-4 py-2 text-right font-medium">フィードリーチ</th>
            <th className="px-4 py-2 text-right font-medium">フィードエンゲージメント</th>
            <th className="px-4 py-2 text-right font-medium">フィードいいね</th>
            <th className="px-4 py-2 text-right font-medium">フィードコメント</th>
            <th className="px-4 py-2 text-right font-medium">フィードシェア</th>
            <th className="px-4 py-2 text-right font-medium">フィード保存</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{row.yearMonth}</td>
              <td className="px-4 py-2 text-right">{row.feed_reach.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.feed_engagement.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.feed_likes.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.feed_comments.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.feed_shares.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.feed_saves.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 