'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';

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
          <div className="p-6">
            <DataTable insights={insights} />
          </div>

          {/* 下部のグリッド */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6">
              <LeftGraph insights={insights} />
            </div>
            <div className="p-6">
              <RightGraph insights={insights} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer;
