'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import accountInsightData from '@/data/account_insights_mock.json';
import { aggregateFeedData } from '@/components/calucurate/insightCalculate';
import { useMemo } from 'react';

const FeedGraph = () => {
  const graphData = useMemo(() => {
    return aggregateFeedData(accountInsightData);
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
            dataKey="feed_likes" 
            name="フィードいいね"
            stackId="engagement"
            fill="#D3D3D3"
          />
          <Bar 
            yAxisId="left"
            dataKey="feed_comments" 
            name="フィードコメント"
            stackId="engagement"
            fill="#20B2AA"
          />
          <Bar 
            yAxisId="left"
            dataKey="feed_shares" 
            name="フィードシェア"
            stackId="engagement"
            fill="#4682B4"
          />
          <Bar 
            yAxisId="left"
            dataKey="feed_saves" 
            name="フィード保存"
            stackId="engagement"
            fill="#6B8E23"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="feed_reach"
            name="フィードリーチ"
            stroke="#DAA520"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeedGraph; 