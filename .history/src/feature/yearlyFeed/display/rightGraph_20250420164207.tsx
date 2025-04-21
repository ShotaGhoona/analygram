'use client';

import { AccountInsight } from '@/types/accountInsight';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RightGraphProps {
  insights: AccountInsight[];
}

const RightGraph = ({ insights }: RightGraphProps) => {
  const data = insights.map(insight => ({
    date: new Date(insight.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
    reach: insight.reachTotal,
    impressions: insight.impressions
  }));

  return (
    <div className="h-[300px]">
      <h2 className="text-lg font-semibold mb-4">リーチとインプレッションの推移</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="reach" stroke="#82ca9d" name="リーチ" />
          <Line type="monotone" dataKey="impressions" stroke="#ffc658" name="インプレッション" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RightGraph; 