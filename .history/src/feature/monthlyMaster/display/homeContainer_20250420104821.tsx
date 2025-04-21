'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import { useCompanyStore } from '@/store/companyStore';
import TypeFilter from '@/components/common/typeFilter';
import DateFilter from '@/components/common/dateFilter';
type MediaType = 'REELS' | 'FEED' | 'STORY';

export const HomeContainer = () => {
  const { selectedCompany } = useCompanyStore();
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(['REELS', 'FEED', 'STORY']);

  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center pb-4">
          <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
          <DateFilter  startDate={startDate} endDate={endDate} onDateChange={handleDateChange}/>
        </div>
        <div className="mb-8">
          <DataTable 
            companyId={selectedCompany.id} 
            startDate={startDate} 
            endDate={endDate}
            selectedTypes={selectedTypes}
          />
        </div>
        <Graph 
          companyId={selectedCompany.id} 
          startDate={startDate} 
          endDate={endDate}
          selectedTypes={selectedTypes}
        />
      </div>
    </div>
  );
};

export default HomeContainer; 