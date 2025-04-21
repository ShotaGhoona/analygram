'use client';

import { useState, useEffect } from 'react';
import { aggregateFeedData } from '@/components/insightCalculate';
import { useCompanyStore } from '@/components/store/companyStore';
import { AccountInsight } from '@/types/accountInsight';

interface AggregatedData {
  yearMonth: string;
  feed_reach: number;
  feed_engagement: number;
  feed_likes: number;
  feed_comments: number;
  feed_shares: number;
  feed_saves: number;
}

const DataTable = () => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const response = await fetch(`/api/accountInsights?companyId=${selectedCompany.id}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const responseData = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany]);

  const aggregatedData = aggregateFeedData(data);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

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
          {aggregatedData.map((row: AggregatedData, index: number) => (
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