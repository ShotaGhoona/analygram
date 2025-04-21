import { DailyInsightData, MonthlyInsightData } from '../types/types';
import accountInsightData from '@/data/account_insights_mock.json';
import { useMemo } from 'react';

const DataTable = () => {
  // 月ごとのデータを集計
  const aggregatedData = useMemo(() => {
    const dailyData: DailyInsightData[] = accountInsightData;
    
    // 日付でソートしてから処理
    const sortedData = [...dailyData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // 月ごとにグループ化して集計
    const monthlyData = sortedData.reduce<Record<string, MonthlyInsightData>>((acc, curr) => {
      const date = new Date(curr.date);
      const yearMonth = `${date.getFullYear()}年${date.getMonth() + 1}月`;
      
      if (!acc[yearMonth]) {
        // 新しい月のデータを初期化
        acc[yearMonth] = {
          year_month: yearMonth,
          followers: curr.followers || 0,
          new_followers: 0, // 後で計算
          reach: curr.reach_total || 0,
          impressions: curr.impressions || 0,
          profile_views: curr.profile_visits || 0,
          website_taps: curr.website_taps || 0,
          likes: curr.likes || 0,
          comments: curr.comments || 0,
          saves: curr.saves || 0,
          shares: curr.shares || 0
        };
      } else {
        // 既存の月のデータを更新
        acc[yearMonth].followers = Math.max(acc[yearMonth].followers, curr.followers || 0);
        acc[yearMonth].reach += curr.reach_total || 0;
        acc[yearMonth].impressions += curr.impressions || 0;
        acc[yearMonth].profile_views += curr.profile_visits || 0;
        acc[yearMonth].website_taps += curr.website_taps || 0;
        acc[yearMonth].likes += curr.likes || 0;
        acc[yearMonth].comments += curr.comments || 0;
        acc[yearMonth].saves += curr.saves || 0;
        acc[yearMonth].shares += curr.shares || 0;
      }
      
      return acc;
    }, {});

    // 新規フォロワー数を計算（前月との差分）
    const monthlyArray = Object.values(monthlyData);
    monthlyArray.sort((a, b) => b.year_month.localeCompare(a.year_month));

    for (let i = 0; i < monthlyArray.length; i++) {
      const nextMonth = monthlyArray[i + 1];
      if (nextMonth) {
        monthlyArray[i].new_followers = monthlyArray[i].followers - nextMonth.followers;
      } else {
        // 最古の月は、その月のフォロワー数を新規フォロワー数とする
        monthlyArray[i].new_followers = monthlyArray[i].followers;
      }
    }

    return monthlyArray;
  }, []);

  // 数値フォーマット関数
  const formatNumber = (value: number): string => {
    if (isNaN(value) || value === null || value === undefined) return '0';
    return value.toLocaleString();
  };

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
              <td className="px-4 py-2 text-right">{formatNumber(row.followers)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.new_followers)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.reach)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.impressions)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.profile_views)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.website_taps)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.likes)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.comments)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.saves)}</td>
              <td className="px-4 py-2 text-right">{formatNumber(row.shares)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
