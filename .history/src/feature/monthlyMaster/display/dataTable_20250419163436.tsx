'use client';

import { PostInsight } from '@/types/post';

interface DataTableProps {
  data: PostInsight[];
}

const DataTable = ({ data }: DataTableProps) => {
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
          <tr>
            <th className="min-w-[150px] px-1 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              サムネイル
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-2 py-2 max-h-[100px] whitespace-nowrap">
                <img
                  src={post.mediaProductType === 'FEED' ? post.mediaUrl : post.thumbnailUrl}
                  alt="サムネイル"
                  className="h-auto w-[100%] object-cover rounded"
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