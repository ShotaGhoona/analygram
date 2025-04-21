'use client';

import { PostInsight } from '@/types/post';
import { useMemo } from 'react';

interface FeedTableProps {
  data: PostInsight[];
}

const FeedTable = ({ data }: FeedTableProps) => {
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => new Date(b.作成日).getTime() - new Date(a.作成日).getTime());
  }, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">投稿日</th>
            <th className="px-4 py-2 text-left">サムネイル</th>
            <th className="px-4 py-2 text-left">リーチ</th>
            <th className="px-4 py-2 text-left">いいね</th>
            <th className="px-4 py-2 text-left">コメント</th>
            <th className="px-4 py-2 text-left">保存</th>
            <th className="px-4 py-2 text-left">シェア</th>
            <th className="px-4 py-2 text-left">EG率</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((post, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{new Date(post.作成日).toLocaleDateString('ja-JP')}</td>
              <td className="px-4 py-2">
                <img 
                  src={post.メディアURL} 
                  alt="投稿サムネイル" 
                  className="w-16 h-16 object-cover rounded"
                />
              </td>
              <td className="px-4 py-2">{post.リーチ}</td>
              <td className="px-4 py-2">{post.いいね}</td>
              <td className="px-4 py-2">{post.コメント}</td>
              <td className="px-4 py-2">{post.保存}</td>
              <td className="px-4 py-2">{post.シェア}</td>
              <td className="px-4 py-2">{post.EG率}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedTable; 