'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import Graph from './graph';
import { useCompanyStore } from '@/store/companyStore';

type MediaType = 'FEED' | 'REELS' | 'STORY';

const HomeContainer = () => {
  const { selectedCompany } = useCompanyStore();
  const [selectedTypes, setSelectedTypes] = useState<MediaType[]>(['FEED', 'REELS', 'STORY']);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['FEED', 'REELS', 'STORY'] as MediaType[]).map((type) => (
          <button
            key={type}
            className={`px-4 py-2 rounded ${
              selectedTypes.includes(type)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => {
              setSelectedTypes((prev) =>
                prev.includes(type)
                  ? prev.filter((t) => t !== type)
                  : [...prev, type]
              );
            }}
          >
            {type}
          </button>
        ))}
      </div>
      <Graph
        companyId={selectedCompany.id}
        startDate="2024-03-01"
        endDate="2024-03-31"
        selectedTypes={selectedTypes}
      />
      <DataTable
        companyId={selectedCompany.id}
        startDate="2024-03-01"
        endDate="2024-03-31"
        selectedTypes={selectedTypes}
      />
    </div>
  );
};

export default HomeContainer; 