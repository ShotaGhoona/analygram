'use client';

import { PostInsight } from '@/types/post';
import { useEffect, useState } from 'react';

interface DataTableProps {
  companyId: number;
  startDate: string;
  endDate: string;
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
}

const DataTable = ({ companyId, startDate, endDate, selectedTypes }: DataTableProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          companyId: companyId.toString(),
          startDate,
          endDate,
          mediaTypes: selectedTypes.join(','),
        });
        const response = await fetch(`/api/insights?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (loading) {
    return <div className="text-center py-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  if (data.length === 0) {
    return <div className="text-center py-4">データがありません</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイプ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">いいね数</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コメント数</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">保存数</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">シェア数</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">リーチ数</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">{row.date}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.mediaType}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.likes}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.comments}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.saves}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.shares}</td>
              <td className="px-6 py-4 whitespace-nowrap">{row.reach}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 