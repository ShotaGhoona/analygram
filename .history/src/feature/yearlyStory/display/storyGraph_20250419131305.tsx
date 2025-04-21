'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateStoryData } from '@/components/insightCalculate';
import { useMemo } from 'react';
import InsightStackedGraph from '@/components/yearly/InsightStackedGraph';

const StoryGraph = () => {
  const graphData = useMemo(() => {
    return aggregateStoryData(accountInsightData);
  }, []);

  const bars = [
    {
      key: 'story_likes',
      name: 'ストーリーいいね',
      fill: '#D3D3D3',
    },
    {
      key: 'story_comments',
      name: 'ストーリーコメント',
      fill: '#20B2AA',
    },
    {
      key: 'story_shares',
      name: 'ストーリーシェア',
      fill: '#4682B4',
    },
    {
      key: 'story_saves',
      name: 'ストーリー保存',
      fill: '#6B8E23',
    },
  ];

  const line = {
    key: 'story_reach',
    name: 'ストーリーリーチ',
    stroke: '#DAA520',
  };

  return <InsightStackedGraph data={graphData} bars={bars} line={line} />;
};

export default StoryGraph; 