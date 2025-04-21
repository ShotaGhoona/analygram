'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DailyInsightData } from '../types/types';
import accountInsightData from '@/data/account_insights_mock.json';
import { useMemo } from 'react';

const RightGraph = () => {
  const graphData = useMemo(() => {
    const dailyData: DailyInsightData[] = accountInsightData;

    // 月ごとにデータをグループ化
    const monthlyData = dailyData.reduce<Record<string, any>>((acc, curr) => {
      const date = new Date(curr.date);
      const yearMonth = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      // 各コンテンツタイプのエンゲージメントを合計
      const totalLikes = (curr.ad?.likes || 0) + 
                        (curr.feed?.likes || 0) + 
                        (curr.story?.likes || 0) + 
                        (curr.reel?.likes || 0) + 
                        (curr.carousel?.likes || 0);

      const totalComments = (curr.ad?.comments || 0) + 
                          (curr.feed?.comments || 0) + 
                          (curr.story?.comments || 0) + 
                          (curr.reel?.comments || 0) + 
                          (curr.carousel?.comments || 0);

      const totalShares = (curr.ad?.shares || 0) + 
                         (curr.feed?.shares || 0) + 
                         (curr.story?.shares || 0) + 
                         (curr.reel?.shares || 0) + 
                         (curr.carousel?.shares || 0);

      const totalSaves = (curr.ad?.saves || 0) + 
                        (curr.feed?.saves || 0) + 
                        (curr.story?.saves || 0) + 
                        (curr.reel?.saves || 0) + 
                        (curr.carousel?.saves || 0);
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          yearMonth,
          impressions: curr.impressions || 0,
          likes: totalLikes,
          comments: totalComments,
          shares: totalShares,
          saves: totalSaves,
        };
      } else {
        acc[yearMonth].impressions += curr.impressions || 0;
        acc[yearMonth].likes += totalLikes;
        acc[yearMonth].comments += totalComments;
        acc[yearMonth].shares += totalShares;
        acc[yearMonth].saves += totalSaves;
      }
      
      return acc;
    }, {});

    // 配列に変換してソート
    return Object.values(monthlyData).sort((a: any, b: any) => 
      a.yearMonth.localeCompare(b.yearMonth)
    );
  }, []);

  return (
    <div className="h-64 w-full bg-white p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={graphData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis 
            dataKey="yearMonth"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12, fill: '#666' }}
            stroke="#e5e5e5"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '4px'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '10px'
            }}
          />
          <Bar 
            yAxisId="left"
            dataKey="likes" 
            name="いいね"
            stackId="engagement"
            fill="#D3D3D3"
          />
          <Bar 
            yAxisId="left"
            dataKey="comments" 
            name="コメント"
            stackId="engagement"
            fill="#20B2AA"
          />
          <Bar 
            yAxisId="left"
            dataKey="shares" 
            name="シェア"
            stackId="engagement"
            fill="#696969"
          />
          <Bar 
            yAxisId="left"
            dataKey="saves" 
            name="保存"
            stackId="engagement"
            fill="#40E0D0"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="impressions"
            name="インプレッション"
            stroke="#D4AF37"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RightGraph;