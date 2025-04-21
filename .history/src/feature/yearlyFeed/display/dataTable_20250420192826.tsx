'use client';

import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/store/companyStore';
import { useDateStore } from '@/store/dateStore';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateFeedData } from '@/components/calucurate/accountCalculate';
import InsightDataTable from '@/components/yearly/InsightDataTable';

const DataTable = () => {
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

  const aggregatedData = aggregateFeedData(insights);

  const columns = [
    { key: 'yearMonth', label: '月' },
    { key: 'feed_reach', label: 'フィードリーチ' },
    { key: 'feed_engagement', label: 'フィードエンゲージメント' },
    { key: 'feed_likes', label: 'フィードいいね' },
    { key: 'feed_comments', label: 'フィードコメント' },
    { key: 'feed_shares', label: 'フィードシェア' },
    { key: 'feed_saves', label: 'フィード保存' },
  ];

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return <InsightDataTable data={aggregatedData} columns={columns} />;
};

export default DataTable; 