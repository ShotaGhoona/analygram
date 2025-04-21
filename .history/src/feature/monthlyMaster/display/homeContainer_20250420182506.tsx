'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import { useCompanyStore } from '@/store/companyStore';
import { useDateStore } from '@/store/dateStore';
import TypeFilter from '@/components/common/typeFilter';

type MediaType = 'REELS' | 'FEED' | 'STORY';

export const HomeContainer = () => {
  const { selectedCompany } = useCompanyStore();
  const { startDate, endDate } = useDateStore();
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(['REELS', 'FEED', 'STORY']);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center pb-4">
          <TypeFilter selectedTypes={selectedTypes} onTypeChange={setSelectedTypes} />
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