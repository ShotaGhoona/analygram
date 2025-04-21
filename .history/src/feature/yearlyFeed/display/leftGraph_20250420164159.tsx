'use client';

import { AccountInsight } from '@/types/accountInsight';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LeftGraphProps {
  insights: AccountInsight[];
}

const LeftGraph = ({ insights }: LeftGraphProps) => {
  const data = insights.map(insight => ({
    date: new Date(insight.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
    followers: insight.followers
  }));

  return (
    <div className="h-[300px]">
      <h2 className="text-lg font-semibold mb-4">フォロワー数の推移</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="followers" stroke="#8884d8" name="フォロワー数" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeftGraph; 