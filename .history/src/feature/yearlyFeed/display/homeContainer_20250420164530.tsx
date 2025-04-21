'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import FeedGraph from './feedGraph';
import { useYearlyInsights } from '../hooks/useYearlyInsights';

const HomeContainer = () => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const { insights, isLoading, error } = useYearlyInsights(selectedYear);

  const years = Array.from(
    { length: 5 },
    (_, i) => currentYear - i
  );

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* 年の選択 */}
      <div className="flex justify-end">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded-md px-3 py-1"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}年
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          {/* 上部の大きなカード */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <DataTable insights={insights} />
          </div>

          {/* 下部のグラフ */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FeedGraph insights={insights} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer; 