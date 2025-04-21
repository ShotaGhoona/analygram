import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyInsightData } from '../types/types';
import accountInsightData from '@/data/account_insights_mock.json';
import { useMemo } from 'react';

const LeftGraph = () => {
  const graphData = useMemo(() => {
    const dailyData: DailyInsightData[] = accountInsightData;

    // 月ごとにデータをグループ化
    const monthlyData = dailyData.reduce<Record<string, { followers: number; follows: number }>>((acc, curr) => {
      const date = new Date(curr.date);
      const yearMonth = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          followers: curr.followers || 0,
          follows: curr.follows || 0,
        };
      } else {
        // その月の最大値を使用
        acc[yearMonth].followers = Math.max(acc[yearMonth].followers, curr.followers || 0);
        acc[yearMonth].follows = Math.max(acc[yearMonth].follows, curr.follows || 0);
      }
      
      return acc;
    }, {});

    // グラフ用のデータ配列を作成
    return Object.entries(monthlyData)
      .map(([yearMonth, data]) => ({
        yearMonth,
        followers: data.followers,
        follows: data.follows,
      }))
      .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
  }, []);

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="yearMonth"
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            domain={[0, 'auto']}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="followers"
            name="フォロワー数"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="follows"
            name="フォロー数"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeftGraph;
