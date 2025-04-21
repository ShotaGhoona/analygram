'use client';

import { useState, useEffect } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import { useCompanyStore } from '@/store/companyStore';
import { useDateStore } from '@/store/dateStore';
import TypeFilter from '@/components/common/typeFilter';
import { AccountInsight } from '@/types/accountInsight';

type MediaType = 'REELS' | 'FEED' | 'STORY';

export const HomeContainer = () => {
  const { selectedCompany } = useCompanyStore();
  const { startDate, endDate, resetToDefault } = useDateStore();
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(['REELS', 'FEED', 'STORY']);
  const [accountInsights, setAccountInsights] = useState<AccountInsight[]>([]);

  useEffect(() => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    
    resetToDefault(
      lastMonth.toISOString().split('T')[0],
      lastDayOfLastMonth.toISOString().split('T')[0]
    );
  }, [resetToDefault]);

  const fetchData = async (start: string, end: string) => {
    try {
      const response = await fetch(`/api/accountInsight?startDate=${start}&endDate=${end}`);
      const data = await response.json();
      setAccountInsights(data);
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  return (
    <div className="px-4">
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