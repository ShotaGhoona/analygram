'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateReelData } from '@/components/calucurate/accountCalculate';
import { useMemo } from 'react';
import InsightStackedGraph from '@/components/yearly/InsightStackedGraph';

const ReelGraph = () => {
  const graphData = useMemo(() => {
    return aggregateReelData(accountInsightData);
  }, []);

  const bars = [
    {
      key: 'reel_likes',
      name: 'リールいいね',
      fill: '#D3D3D3',
    },
    {
      key: 'reel_comments',
      name: 'リールコメント',
      fill: '#20B2AA',
    },
    {
      key: 'reel_shares',
      name: 'リールシェア',
      fill: '#4682B4',
    },
    {
      key: 'reel_saves',
      name: 'リール保存',
      fill: '#6B8E23',
    },
  ];

  const line = {
    key: 'reel_reach',
    name: 'リールリーチ',
    stroke: '#DAA520',
  };

  return <InsightStackedGraph data={graphData} bars={bars} line={line} />;
};

export default ReelGraph; 