'use client';

import { useEffect, useState } from 'react';
import FeedTable from './display/feedTable';
import FeedSummary from './display/feedSummary';
import postData from '@/data/post_insights_mock.json';
import { PostInsight } from '@/types/post';

const MonthlyFeedPage = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2025/03');
  const [monthlyData, setMonthlyData] = useState<PostInsight[]>([]);

  useEffect(() => {
    const filteredData = postData.filter(post => post.作成月 === selectedMonth);
    setMonthlyData(filteredData);
  }, [selectedMonth]);

  const months = Array.from(new Set(postData.map(post => post.作成月))).sort().reverse();

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">月次投稿分析</h1>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <FeedSummary data={monthlyData} />
      <FeedTable data={monthlyData} />
    </div>
  );
};

export default MonthlyFeedPage; 