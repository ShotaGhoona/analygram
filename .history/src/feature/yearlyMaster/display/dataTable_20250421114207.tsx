'use client';

import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { useDateStore } from '@/components/store/dateStore';
import { AccountInsight } from '@/types/accountInsight';
import { aggregateFeedData, aggregateReelsData, aggregateStoryData } from '@/components/calucurate/accountCalculate';
import InsightDataTable from '@/components/yearly/InsightDataTable';

interface DataTableProps {
  selectedType: 'FEED' | 'REELS' | 'STORY';
}

const DataTable = ({ selectedType }: DataTableProps) => {
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
          `/api/yearlyMaster?companyId=${selectedCompany.id}&startDate=${startDate}&endDate=${endDate}`
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

  const getColumns = () => {
    const prefix = selectedType.toLowerCase();
    const typeLabel = {
      'feed': 'フィード',
      'reels': 'リール',
      'story': 'ストーリー'
    }[prefix];

    return [
      { key: 'yearMonth', label: '月' },
      { key: `${prefix}_reach`, label: `${typeLabel}リーチ` },
      { key: `${prefix}_engagement`, label: `${typeLabel}エンゲージメント` },
      { key: `${prefix}_likes`, label: `${typeLabel}いいね` },
      { key: `${prefix}_comments`, label: `${typeLabel}コメント` },
      { key: `${prefix}_shares`, label: `${typeLabel}シェア` },
      { key: `${prefix}_saves`, label: `${typeLabel}保存` },
    ];
  };

  const aggregatedData = getAggregatedData();
  const columns = getColumns();

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return <InsightDataTable data={aggregatedData} columns={columns} />;
};

export default DataTable; 