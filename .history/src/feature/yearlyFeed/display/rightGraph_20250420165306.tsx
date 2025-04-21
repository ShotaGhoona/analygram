'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AccountInsight } from '@/types/accountInsight';

interface RightGraphProps {
  insights: AccountInsight[];
}

const RightGraph = ({ insights }: RightGraphProps) => {
  const data = insights.map(insight => ({
    date: new Date(insight.date).toLocaleDateString('ja-JP'),
    reachTotal: insight.reachTotal,
    impressions: insight.impressions,
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
          <Line type="monotone" dataKey="reachTotal" stroke="#ffc658" name="リーチ数" />
          <Line type="monotone" dataKey="impressions" stroke="#ff7300" name="インプレッション数" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RightGraph; 