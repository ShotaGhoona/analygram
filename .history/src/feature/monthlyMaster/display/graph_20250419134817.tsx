'use client';

import { PostInsight } from '@/types/post';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphProps {
  data: PostInsight[];
}

const Graph = ({ data }: GraphProps) => {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.作成日).getTime() - new Date(b.作成日).getTime()
  );

  const chartData = sortedData.map(post => ({
    date: new Date(post.作成日).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' }),
    リーチ: Number(post.リーチ),
    いいね: post.いいね,
    コメント: post.コメント,
    保存: post.保存,
    シェア: post.シェア,
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            yAxisId="left"
            orientation="left"
            domain={[0, 30]}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 1000]}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="いいね" stackId="a" fill="#E5E7EB" yAxisId="left" />
          <Bar dataKey="コメント" stackId="a" fill="#93C5FD" yAxisId="left" />
          <Bar dataKey="保存" stackId="a" fill="#6B7280" yAxisId="left" />
          <Bar dataKey="シェア" stackId="a" fill="#10B981" yAxisId="left" />
          <Line
            type="monotone"
            dataKey="リーチ"
            stroke="#C5BC9D"
            strokeWidth={2}
            yAxisId="right"
            dot={{ fill: '#C5BC9D' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph; 