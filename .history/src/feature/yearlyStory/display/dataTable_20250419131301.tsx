'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateStoryData } from '@/components/insightCalculate';
import { useMemo } from 'react';
import InsightDataTable from '@/components/yearly/InsightDataTable';

const DataTable = () => {
  const aggregatedData = useMemo(() => {
    return aggregateStoryData(accountInsightData);
  }, []);

  const columns = [
    { key: 'yearMonth', label: '月' },
    { key: 'story_reach', label: 'ストーリーリーチ' },
    { key: 'story_engagement', label: 'ストーリーエンゲージメント' },
    { key: 'story_likes', label: 'ストーリーいいね' },
    { key: 'story_comments', label: 'ストーリーコメント' },
    { key: 'story_shares', label: 'ストーリーシェア' },
    { key: 'story_saves', label: 'ストーリー保存' },
  ];

  return <InsightDataTable data={aggregatedData} columns={columns} />;
};

export default DataTable; 