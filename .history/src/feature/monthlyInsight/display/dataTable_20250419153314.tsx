'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';

const DataTable = () => {
  const monthlyData = useMemo(() => {
    return calculateNewFollowers(accountInsightData);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-1/6 px-4 py-2 text-left font-medium">日付</th>
            <th className="w-1/6 px-4 py-2 text-right font-medium">新規フォロワー数</th>
            <th className="w-1/6 px-4 py-2 text-right font-medium">インプレッション</th>
            <th className="w-1/6 px-4 py-2 text-right font-medium">リーチ</th>
            <th className="w-1/6 px-4 py-2 text-right font-medium">プロフィールのアクセス</th>
            <th className="w-1/6 px-4 py-2 text-right font-medium">ウェブサイトのタップ</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="text-[10px] px-2">{row.date}日</td>
              <td className="text-[10px] px-2 text-right">{row.newFollowers.toLocaleString()}</td>
              <td className="text-[10px] px-2 text-right">{row.impressions.toLocaleString()}</td>
              <td className="text-[10px] px-2 text-right">{row.reach.toLocaleString()}</td>
              <td className="text-[10px] px-2 text-right">{row.profileViews.toLocaleString()}</td>
              <td className="text-[10px] px-2 text-right">{row.websiteTaps.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 