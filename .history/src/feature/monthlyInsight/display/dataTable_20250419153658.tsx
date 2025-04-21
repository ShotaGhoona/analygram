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
            <th className="w-1/6 px-4 py-2 text-center font-medium">日付</th>
            <th className="w-1/6 px-4 py-2 text-center font-medium">新規<br />フォロワー数</th>
            <th className="w-1/6 px-4 py-2 text-center font-medium">インプレッション</th>
            <th className="w-1/6 px-4 py-2 text-center font-medium">リーチ</th>
            <th className="w-1/6 px-4 py-2 text-center font-medium">プロフアクセス</th>
            <th className="w-1/6 px-4 py-2 text-center font-medium">ウェブサイトのタップ</th>
          </tr>
        </thead>
        <tbody>
          {monthlyData.map((row, index) => (
            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="text-[12px] py-0.5 px-2 text-center">{row.date}日</td>
              <td className="text-[12px] py-0.5 px-2 text-center">{row.newFollowers.toLocaleString()}</td>
              <td className="text-[12px] py-0.5 px-2 text-center">{row.impressions.toLocaleString()}</td>
              <td className="text-[12px] py-0.5 px-2 text-center">{row.reach.toLocaleString()}</td>
              <td className="text-[12px] py-0.5 px-2 text-center">{row.profileViews.toLocaleString()}</td>
              <td className="text-[12px] py-0.5 px-2 text-center">{row.websiteTaps.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 