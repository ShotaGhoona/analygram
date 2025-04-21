import { MonthlyInsightData } from '../types/types';
import monthlyData from '@/data/monthly_insights.json';
import { useMemo } from 'react';

const DataTable = () => {
  // 月ごとのデータを集計
  const aggregatedData = useMemo(() => {
    const data: MonthlyInsightData[] = monthlyData;
    
    // 月ごとにグループ化して集計
    const monthlyAggregated = data.reduce((acc, curr) => {
      const yearMonth = curr.year_month;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          year_month: yearMonth,
          followers: curr.followers, // 最大値を使用
          new_followers: curr.new_followers,
          reach: curr.reach,
          impressions: curr.impressions,
          profile_views: curr.profile_views,
          website_taps: curr.website_taps,
          likes: curr.likes,
          comments: curr.comments,
          saves: curr.saves,
          shares: curr.shares
        };
      } else {
        // フォロワー数は最大値を使用
        acc[yearMonth].followers = Math.max(acc[yearMonth].followers, curr.followers);
        // その他の指標は合計
        acc[yearMonth].reach += curr.reach;
        acc[yearMonth].impressions += curr.impressions;
        acc[yearMonth].profile_views += curr.profile_views;
        acc[yearMonth].website_taps += curr.website_taps;
        acc[yearMonth].likes += curr.likes;
        acc[yearMonth].comments += curr.comments;
        acc[yearMonth].saves += curr.saves;
        acc[yearMonth].shares += curr.shares;
      }
      
      return acc;
    }, {} as Record<string, MonthlyInsightData>);

    // 配列に変換して日付の降順でソート
    return Object.values(monthlyAggregated).sort((a, b) => 
      b.year_month.localeCompare(a.year_month)
    );
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-2 text-left font-medium">年, 月</th>
            <th className="px-4 py-2 text-right font-medium">フォロワー数</th>
            <th className="px-4 py-2 text-right font-medium">新規フォロワー数</th>
            <th className="px-4 py-2 text-right font-medium">リーチ</th>
            <th className="px-4 py-2 text-right font-medium">インプレッション数</th>
            <th className="px-4 py-2 text-right font-medium">プロフィールのアクセス</th>
            <th className="px-4 py-2 text-right font-medium">ウェブサイトのタップ</th>
            <th className="px-4 py-2 text-right font-medium">いいね</th>
            <th className="px-4 py-2 text-right font-medium">コメント</th>
            <th className="px-4 py-2 text-right font-medium">保存</th>
            <th className="px-4 py-2 text-right font-medium">シェア</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{row.year_month}</td>
              <td className="px-4 py-2 text-right">{row.followers.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.new_followers.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.reach.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.impressions.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.profile_views.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.website_taps.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.likes.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.comments.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.saves.toLocaleString()}</td>
              <td className="px-4 py-2 text-right">{row.shares.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable; 