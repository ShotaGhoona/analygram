'use client';

import { PostInsight } from '@/types/post';

interface DataTableProps {
  data: PostInsight[];
}

const DataTable = ({ data }: DataTableProps) => {
  const getImageUrl = (post: PostInsight): string => {
    // デバッグログ
    console.log('Post data:', {
      mediaProductType: post.mediaProductType,
      thumbnailUrl: post.thumbnailUrl,
      mediaUrl: post.mediaUrl
    });

    if (post.mediaProductType === 'REELS') {
      return post.thumbnailUrl || post.mediaUrl || '';
    }
    return post.mediaUrl || '';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              投稿日
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(post.timestamp).toLocaleDateString('ja-JP')}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              サムネイル
            </th>
            {data.map((post) => {
              const imageUrl = getImageUrl(post);
              // デバッグログ
              console.log('Image URL for post', post.id, ':', imageUrl);
              
              return (
                <td key={post.id} className="px-6 py-4 whitespace-nowrap">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`サムネイル - ${post.mediaProductType}`}
                      className="h-16 w-16 object-cover rounded"
                      onError={(e) => {
                        console.error('Image load error:', imageUrl);
                        e.currentTarget.src = '/placeholder.png'; // プレースホルダー画像に置き換え
                      }}
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                  )}
                </td>
              );
            })}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              リーチ
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.reach}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              いいね
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.likes}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              コメント
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.comments}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              保存
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.saved}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              シェア
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.shares}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              メディア種別
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.mediaProductType}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              インプレッション
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.impressions}
              </td>
            ))}
          </tr>
          {/* Reels専用の再生回数 */}
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              再生回数
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.plays || '-'}
              </td>
            ))}
          </tr>
          {/* Story専用のリプライ数 */}
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              リプライ
            </th>
            {data.map((post) => (
              <td key={post.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {post.replies || '-'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 