'use client';

import DataTable from './dataTable';
import { NewFollowersGraph, ReachImpressionGraph, ProfileViewsGraph, WebsiteTapsGraph } from './graphs';

const HomeContainer = () => {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* 左半分：データテーブル */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">2025年3月のデータ</h2>
          <DataTable />
        </div>
      </div>

      {/* 右半分：グラフ */}
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">新規フォロワー数の推移</h2>
          <NewFollowersGraph />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">インプレッション・リーチ数の推移</h2>
          <ReachImpressionGraph />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">プロフィールアクセス数の推移</h2>
          <ProfileViewsGraph />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">ウェブサイトタップ数の推移</h2>
          <WebsiteTapsGraph />
        </div>
      </div>
    </div>
  );
};

export default HomeContainer; 