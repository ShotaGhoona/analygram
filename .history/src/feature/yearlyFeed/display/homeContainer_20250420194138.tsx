'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import FeedGraph from './feedGraph';
import TypeChoice from '@/components/common/typeChoice';

type MediaType = 'FEED' | 'REELS' | 'STORY';

const HomeContainer = () => {
  const [selectedType, setSelectedType] = useState<MediaType>('FEED');

  return (
    <div className="space-y-6">
      {/* タイプ選択 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <TypeChoice
          selectedType={selectedType}
          onTypeChange={setSelectedType}
        />
      </div>

      {/* 上部のテーブル */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable selectedType={selectedType} />
      </div>

      {/* 下部のグラフ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FeedGraph selectedType={selectedType} />
      </div>
    </div>
  );
};

export default HomeContainer; 