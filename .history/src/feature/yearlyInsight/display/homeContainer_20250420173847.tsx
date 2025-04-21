'use client';

import { useState } from 'react';
import DataTable from './dataTable';
import LeftGraph from './leftGraph';
import RightGraph from './rightGraph';
import { useYearlyInsights } from '@/feature/yearlyInsight/hooks/useYearlyInsights';

const HomeContainer = () => {
  const currentYear = new Date().getFullYear();
  const { insights, isLoading, error } = useYearlyInsights(currentYear);


  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="space-y-6">

      {isLoading ? (
        <div className="text-center py-4">データを読み込み中...</div>
      ) : (
        <>
          {/* 上部の大きなカード */}
          <div className="p-6">
            <DataTable insights={insights} />
          </div>

          {/* 下部のグリッド */}
          <div className="grid grid-cols-2 gap-6">
              <LeftGraph insights={insights} />
              <RightGraph insights={insights} />
          </div>
        </>
      )}
    </div>
  );
};

export default HomeContainer;
