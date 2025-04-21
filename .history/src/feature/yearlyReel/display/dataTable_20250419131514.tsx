'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateReelData } from '@/components/calucurate/insightCalculate';
import { useMemo } from 'react';
import InsightDataTable from '@/components/yearly/InsightDataTable';

const DataTable = () => {
  const aggregatedData = useMemo(() => {
    return aggregateReelData(accountInsightData);
  }, []);

  const columns = [
    { key: 'yearMonth', label: '月' },
    { key: 'reel_reach', label: 'リールリーチ' },
    { key: 'reel_engagement', label: 'リールエンゲージメント' },
    { key: 'reel_likes', label: 'リールいいね' },
    { key: 'reel_comments', label: 'リールコメント' },
    { key: 'reel_shares', label: 'リールシェア' },
    { key: 'reel_saves', label: 'リール保存' },
  ];

  return <InsightDataTable data={aggregatedData} columns={columns} />;
};

export default DataTable; 