'use client';

import { useEffect, useState } from 'react';
import postData from '@/data/post_insights_mock.json';
import { PostInsight } from '@/types/post';
import DataTable from './dataTable';
import Graph from './graph';
import Filter from '../filter';

const convertToPostInsight = (data: any): PostInsight => {
  return {
    ...data,
    メディアのプロダクト種別: data.メディアのプロダクト種別 as 'FEED' | 'REELS' | 'STORY',
    メディアの種別: data.メディアの種別 as 'CAROUSEL_ALBUM' | 'VIDEO',
  };
};

const HomeContainer = () => {
  const [monthlyData, setMonthlyData] = useState<PostInsight[]>([]);
  const [filteredData, setFilteredData] = useState<PostInsight[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<('FEED' | 'REELS' | 'STORY')[]>(['FEED', 'REELS', 'STORY']);

  useEffect(() => {
    const initialData = postData
      .filter(post => post.作成月 === '2025/03')
      .map(convertToPostInsight)
      .sort((a, b) => new Date(b.作成日).getTime() - new Date(a.作成日).getTime());
    setMonthlyData(initialData);
  }, []);

  useEffect(() => {
    const filtered = monthlyData.filter(post => 
      selectedTypes.includes(post.メディアのプロダクト種別)
    );
    setFilteredData(filtered);
  }, [monthlyData, selectedTypes]);

  return (
    <div className="p-4 space-y-6">
      <Filter 
        selectedTypes={selectedTypes}
        onTypeChange={setSelectedTypes}
      />
      <DataTable data={filteredData} />
      <Graph data={filteredData} />
    </div>
  );
};

export default HomeContainer; 