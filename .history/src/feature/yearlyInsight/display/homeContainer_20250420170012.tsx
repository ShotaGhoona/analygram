'use client';

import { useState } from 'react';
import DateFilter from '@/components/common/dateFilter';
import { useYearlyInsights } from '../hooks/useYearlyInsights';
import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useSelectedCompany } from '@/hooks/useSelectedCompany';

const HomeContainer = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { selectedCompany } = useSelectedCompany();
  const { insights, isLoading, error } = useYearlyInsights(selectedDate, selectedCompany?.id || '');

  const handleDateChange = (startDate: string, endDate: string) => {
    setSelectedDate(new Date(startDate));
  };

  if (!selectedCompany) {
    return <div className="p-4">会社を選択してください</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <DateFilter
          startDate={selectedDate.toISOString().split('T')[0]}
          endDate={selectedDate.toISOString().split('T')[0]}
          onDateChange={handleDateChange}
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
