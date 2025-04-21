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
  const [startDate, setStartDate] = useState<string>('2025-03-01');
  const [endDate, setEndDate] = useState<string>('2025-03-31');

  useEffect(() => {
    const initialData = postData
      .map(convertToPostInsight)
      .filter(post => {
        const postDate = new Date(post.作成日);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return postDate >= start && postDate <= end;
      })
      .sort((a, b) => new Date(b.作成日).getTime() - new Date(a.作成日).getTime());
    setMonthlyData(initialData);
  }, [startDate, endDate]);

  useEffect(() => {
    const filtered = monthlyData.filter(post => 
      selectedTypes.includes(post.メディアのプロダクト種別)
    );
    setFilteredData(filtered);
  }, [monthlyData, selectedTypes]);

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="p-4 space-y-6">
      <Filter 
        selectedTypes={selectedTypes}
        onTypeChange={setSelectedTypes}
        startDate={startDate}
        endDate={endDate}
        onDateChange={handleDateChange}
      />
      <DataTable data={filteredData} />
      <Graph data={filteredData} />
    </div>
  );
};

export default HomeContainer; 