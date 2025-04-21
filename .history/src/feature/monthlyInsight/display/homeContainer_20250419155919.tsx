'use client';

import DataTable from './dataTable';
import { NewFollowersGraph, ReachImpressionGraph, ProfileViewsGraph, WebsiteTapsGraph } from './graphs';
import { useState } from 'react';
import DateFilter from '@/components/common/dateFilter';

const HomeContainer = () => {
  const [startDate, setStartDate] = useState<string>('2025-03-01');
  const [endDate, setEndDate] = useState<string>('2025-03-31');

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-end">
        <DateFilter 
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* 左半分：データテーブル */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <DataTable 
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>

        {/* 右半分：グラフ */}
        <div className="h-full">
          <div className="bg-white rounded-lg shadow-sm pt-6 h-1/4">
            <NewFollowersGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm pt-6 h-1/4">
            <ReachImpressionGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm pt-6 h-1/4">
            <ProfileViewsGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm pt-6 h-1/4">
            <WebsiteTapsGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContainer; 