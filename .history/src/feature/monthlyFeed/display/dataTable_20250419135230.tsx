'use client';

import { PostInsight } from '@/types/post';

interface DataTableProps {
  data: PostInsight[];
}

const DataTable = ({ data }: DataTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">投稿日 ↑</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">サムネイル</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">メディア種別</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">リーチ</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">いいね</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">コメント</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">保存</th>
            <th className="bg-[#C5BC9D] text-white p-2 text-left">シェア</th>
          </tr>
        </thead>
        <tbody>
          {data.map((post, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{new Date(post.作成日).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}</td>
              <td className="p-2">
                <img 
                  src={post.メディアURL} 
                  alt="投稿サムネイル" 
                  className="w-16 h-16 object-cover"
                />
              </td>
              <td className="p-2">{post.メディアのプロダクト種別}</td>
              <td className="p-2">{post.リーチ}</td>
              <td className="p-2">{post.いいね}</td>
              <td className="p-2">{post.コメント}</td>
              <td className="p-2">{post.保存}</td>
              <td className="p-2">{post.シェア}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 