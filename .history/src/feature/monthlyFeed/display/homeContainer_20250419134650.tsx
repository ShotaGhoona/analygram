'use client';

import { useEffect, useState } from 'react';
import postData from '@/data/post_insights_mock.json';
import { PostInsight } from '@/types/post';
import DataTable from './dataTable';
import Graph from './graph';

const convertToPostInsight = (data: any): PostInsight => {
  return {
    ...data,
    メディアのプロダクト種別: data.メディアのプロダクト種別 as 'FEED' | 'REELS' | 'STORY',
    メディアの種別: data.メディアの種別 as 'CAROUSEL_ALBUM' | 'VIDEO',
  };
};

const HomeContainer = () => {
  const [monthlyData, setMonthlyData] = useState<PostInsight[]>([]);

  useEffect(() => {
    const filteredData = postData
      .filter(post => post.作成月 === '2025/03')
      .map(convertToPostInsight)
      .sort((a, b) => new Date(b.作成日).getTime() - new Date(a.作成日).getTime());
    setMonthlyData(filteredData);
  }, []);

  return (
    <div className="p-4 space-y-6">
      <DataTable data={monthlyData} />
      <Graph data={monthlyData} />
    </div>
  );
};

export default HomeContainer; 