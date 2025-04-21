'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import DateFilter from '@/components/common/dateFilter';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';

const HomeContainer = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { insights, isLoading, error } = useYearlyInsights(selectedDate.getFullYear());

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* 日付の選択 */}
      <div className="flex justify-end">
        <DateFilter
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          {/* 上部の大きなカード */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <DataTable insights={insights} />
          </div>

          {/* 下部のグリッド */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <LeftGraph insights={insights} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RightGraph insights={insights} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer; 