'use client';

import { useEffect, useState } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import TypeFilter from '@/components/common/typeFilter';
import DateFilter from '@/components/common/dateFilter';
import { useCompanyStore } from '@/store/companyStore';

const HomeContainer = () => {
  const [selectedTypes, setSelectedTypes] = useState<('FEED' | 'REELS' | 'STORY')[]>(['FEED', 'REELS', 'STORY']);
  const [startDate, setStartDate] = useState<string>('2024-11-01');
  const [endDate, setEndDate] = useState<string>('2025-03-31');
  const { selectedCompany } = useCompanyStore();

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (!selectedCompany) {
    return <div className="text-center py-4">会社を選択してください</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <TypeFilter 
          selectedTypes={selectedTypes}
          onTypeChange={setSelectedTypes}
        />
        <DateFilter 
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
        />
      </div>
      <DataTable 
        companyId={selectedCompany.id}
        startDate={startDate}
        endDate={endDate}
      />
      <Graph 
        companyId={selectedCompany.id}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default HomeContainer; 