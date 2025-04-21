'use client';

import { AccountInsight } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/store/companyStore';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';

interface DataTableProps {
  startDate: string;
  endDate: string;
}

const DataTable = ({ startDate, endDate }: DataTableProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedCompany) return;

      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({
          companyId: selectedCompany.id,
          startDate,
          endDate,
        });

        const response = await fetch(`/api/accountInsights?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const insights = await response.json();
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany) {
    return <div className="text-center py-4">企業を選択してください</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">データを読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-4">データが見つかりませんでした</div>;
  }

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