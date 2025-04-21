'use client';

import DataTable from './dataTable';
import { 
  NewFollowersGraph, 
  ReachImpressionGraph, 
  WebsiteTapsGraph,
  WebsiteTapRateGraph 
} from './graphs';
import { useDateStore } from '@/store/dateStore';

const HomeContainer = () => {
  const { startDate, endDate } = useDateStore();

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* 左半分：データテーブル */}
        <div className="space-y-6">
            <DataTable 
              startDate={startDate}
              endDate={endDate}
            />
        </div>

        {/* 右半分：グラフ */}
        <div className="h-full">
          <div className="pt-6 h-1/4 max-h-[200px]">
            <NewFollowersGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <ReachImpressionGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <WebsiteTapsGraph 
              startDate={startDate}
              endDate={endDate}
            />
          </div>

          <div className="pt-6 h-1/4 max-h-[200px]">
            <WebsiteTapRateGraph 
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