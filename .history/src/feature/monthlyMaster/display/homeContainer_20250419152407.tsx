'use client';

import { useEffect, useState } from 'react';
import postData from '@/data/post_insights.json';
import { PostInsight } from '@/types/post';
import DataTable from './dataTable';
import Graph from './graph';
import Filter from '../../../components/common/filter';

const convertToPostInsight = (data: any): PostInsight => {
  return {
    id: data.id,
    caption: data.caption,
    mediaType: data.mediaType,
    mediaProductType: data.mediaProductType,
    mediaUrl: data.mediaUrl,
    permalink: data.permalink,
    timestamp: data.timestamp,
    impressions: data.impressions,
    reach: data.reach,
    saved: data.saved,
    likes: data.likes,
    comments: data.comments,
    shares: data.shares,
    engagement: data.engagement,
    plays: data.plays || 0,
    replies: data.replies || 0,
    thumbnailUrl: data.thumbnailUrl || ''
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
        const postDate = new Date(post.timestamp);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return postDate >= start && postDate <= end;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setMonthlyData(initialData);
  }, [startDate, endDate]);

  useEffect(() => {
    const filtered = monthlyData.filter(post => 
      selectedTypes.includes(post.mediaProductType)
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