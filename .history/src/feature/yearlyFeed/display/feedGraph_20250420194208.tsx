'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/store/companyStore';
import { useDateStore } from '@/store/dateStore';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateFeedData, aggregateReelsData, aggregateStoryData } from '@/components/calucurate/accountCalculate';

interface FeedGraphProps {
  selectedType: 'FEED' | 'REELS' | 'STORY';
}

const FeedGraph = ({ selectedType }: FeedGraphProps) => {
  const [insights, setInsights] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();
  const { startDate, endDate } = useDateStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) {
        setError('会社が選択されていません');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/yearlyFeeds?companyId=${selectedCompany.id}&startDate=${startDate}&endDate=${endDate}`
        );

        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const data = await response.json();
        setInsights(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, startDate, endDate]);

  const getAggregatedData = () => {
    switch (selectedType) {
      case 'FEED':
        return aggregateFeedData(insights);
      case 'REELS':
        return aggregateReelsData(insights);
      case 'STORY':
        return aggregateStoryData(insights);
      default:
        return [];
    }
  };

  const graphData = getAggregatedData();

  if (isLoading) {
    return <div className="text-center py-4">グラフデータを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="yearMonth" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="reach" fill="#8884d8" name="リーチ数" />
          <Line yAxisId="right" type="monotone" dataKey="engagement" stroke="#82ca9d" name="エンゲージメント" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedGraph; 