'use client';

import { useEffect, useState } from 'react';
import postData from '@/data/post_insights_mock.json';
import { PostInsight } from '@/types/post';

const convertToPostInsight = (data: any): PostInsight => {
  return {
    ...data,
    メディアのプロダクト種別: data.メディアのプロダクト種別 as 'FEED' | 'REELS' | 'STORY',
    メディアの種別: data.メディアの種別 as 'CAROUSEL_ALBUM' | 'VIDEO',
  };
};

const HomeContainer = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('2025/03');
  const [monthlyData, setMonthlyData] = useState<PostInsight[]>([]);

  useEffect(() => {
    const filteredData = postData
      .filter(post => post.作成月 === selectedMonth)
      .map(convertToPostInsight);
    setMonthlyData(filteredData);
  }, [selectedMonth]);

  const months = Array.from(new Set(postData.map(post => post.作成月))).sort().reverse();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
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
      {/* ここに新しいコンポーネントを追加していきます */}
    </div>
  );
};

export default HomeContainer; 