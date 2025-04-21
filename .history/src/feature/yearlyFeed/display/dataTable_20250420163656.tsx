'use client';

import { useEffect, useState } from 'react';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateFeedData } from '../utils/aggregateFeedData';

export default function DataTable() {
  const [accountInsightData, setAccountInsightData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/accountInsights');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        setAccountInsightData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>データを読み込み中...</div>;
  }

  const aggregatedData = aggregateFeedData(accountInsightData);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メトリクス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              値
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィードリーチ
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedReach.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィードエンゲージメント
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedEngagement.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィードいいね
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedLikes.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィードコメント
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedComments.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィードシェア
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedShares.toLocaleString()}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              フィード保存
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {aggregatedData.feedSaves.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 