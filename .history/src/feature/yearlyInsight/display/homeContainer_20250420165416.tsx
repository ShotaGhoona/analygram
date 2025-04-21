'use client';

import { useState } from 'react';
import DateFilter from '@/components/common/dateFilter';
import { useYearlyInsights } from '../hooks/useYearlyInsights';
import DataTable from './dataTable';
import Graph from './graph';

export const HomeContainer = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { insights, isLoading, error } = useYearlyInsights(selectedDate);

  const handleDateChange = (startDate: string, endDate: string) => {
    setSelectedDate(new Date(startDate));
  };

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
      <div className="grid grid-cols-1 gap-4">
        <DataTable insights={insights} />
        <Graph insights={insights} />
      </div>
    </div>
  );
};
