'use client';

import { PostInsight } from '@/types/post';
import { useEffect, useState } from 'react';

interface DataTableProps {
  companyId: string;
  startDate?: string;
  endDate?: string;
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
}

const DataTable = ({ companyId, startDate, endDate, selectedTypes }: DataTableProps) => {
  const [data, setData] = useState<PostInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams({ 
          companyId,
          mediaTypes: selectedTypes.join(',')
        });
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await fetch(`/api/posts?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const posts = await response.json();
        setData(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

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
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              投稿日
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 text-center py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(post.timestamp).toLocaleDateString('ja-JP')}
              </td>
            ))}
          </tr>
          <tr className="h-[100px]">
            <th className="min-w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              サムネイル
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-2 py-2 whitespace-nowrap text-center">
                <img
                  src={post.mediaProductType === 'FEED' ? post.mediaUrl : post.thumbnailUrl}
                  alt="サムネイル"
                  className="h-[100px] w-auto object-cover rounded mx-auto"
                />
              </td>
            ))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">リーチ</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.reach}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">いいね</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.likes}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">コメント</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.comments}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">保存</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.saved}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">シェア</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.shares}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">メディア種別</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.mediaProductType}</td>))}
          </tr>
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">インプレッション</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.impressions}</td>))}
          </tr>
          {/* Reels専用の再生回数 */}
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">再生回数</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.plays || '-'}</td>))}
          </tr>
          {/* Story専用のリプライ数 */}
          <tr>
            <th className="w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">リプライ</th>
            {data.map((post) => (<td key={post.id} className="px-6 text-center whitespace-nowrap text-sm text-gray-900">{post.replies || '-'}</td>))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 