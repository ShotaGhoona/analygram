'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AccountInsight } from '@/types/accountInsight';

interface LeftGraphProps {
  insights: AccountInsight[];
}

const LeftGraph = ({ insights }: LeftGraphProps) => {
  const data = insights.map(insight => ({
    date: new Date(insight.date).toLocaleDateString('ja-JP'),
    followers: insight.followers,
    follows: insight.follows,
  }));

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="followers" stroke="#8884d8" name="フォロワー数" />
          <Line type="monotone" dataKey="follows" stroke="#82ca9d" name="フォロー数" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeftGraph; 