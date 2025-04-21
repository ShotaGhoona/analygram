'use client';

import DataTable from './dataTable';
import FeedGraph from './feedGraph';

const HomeContainer = () => {
  return (
    <div className="space-y-6">
      {/* 上部のテーブル */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <DataTable />
      </div>

      {/* 下部のグラフ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <FeedGraph />
      </div>
    </div>
  );
};

export default HomeContainer; 