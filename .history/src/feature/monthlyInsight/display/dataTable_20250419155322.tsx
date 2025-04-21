'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';

interface DataTableProps {
  startDate: string;
  endDate: string;
}

const DataTable = ({ startDate, endDate }: DataTableProps) => {
  const monthlyData = useMemo(() => {
    const data = calculateNewFollowers(accountInsightData);
    return data.filter(row => {
      const rowDate = new Date(2025, 2, row.date); // 2025年3月の日付を作成
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="w-1/6 px-1 py-2 text-center font-medium">日付</th>
            <th className="w-1/6 px-1 py-2 text-center font-medium">新規<br />フォロワー数</th>
            <th className="w-1/6 px-1 py-2 text-center font-medium">インプレッション</th>
            <th className="w-1/6 px-1 py-2 text-center font-medium">リーチ</th>
            <th className="w-1/6 px-1 py-2 text-center font-medium">プロフィール<br />アクセス</th>
            <th className="w-1/6 px-1 py-2 text-center font-medium">ウェブサイトの<br />タップ</th>
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