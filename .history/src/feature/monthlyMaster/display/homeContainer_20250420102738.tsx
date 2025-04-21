'use client';

import { useEffect, useState } from 'react';
import { PostInsight } from '@/types/post';
import DataTable from './dataTable';
import Graph from './graph';
import TypeFilter from '@/components/common/typeFilter';
import DateFilter from '@/components/common/dateFilter';

const HomeContainer = () => {
  const [selectedTypes, setSelectedTypes] = useState<('FEED' | 'REELS' | 'STORY')[]>(['FEED', 'REELS', 'STORY']);
  const [startDate, setStartDate] = useState<string>('2024-11-01');
  const [endDate, setEndDate] = useState<string>('2025-03-31');
  const [companyId, setCompanyId] = useState<string>('');

  // 会社情報を取得
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await fetch('/api/companies');
        const companies = await response.json();
        if (companies.length > 0) {
          setCompanyId(companies[0].id);
        }
      } catch (error) {
        console.error('会社情報の取得に失敗:', error);
      }
    };

    fetchCompany();
  }, []);

  const handleDateChange = (newStartDate: string, newEndDate: string) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  if (!companyId) {
    return <div className="text-center py-4">会社情報を読み込み中...</div>;
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
        companyId={companyId}
        startDate={startDate}
        endDate={endDate}
      />
      <Graph 
        companyId={companyId}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  );
};

export default HomeContainer; 