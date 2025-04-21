'use client';

import { AccountInsight } from '@/types/accountInsight';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RightGraphProps {
  insights: AccountInsight[];
}

export default function RightGraph({ insights }: RightGraphProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">リーチ数の推移</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={insights}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => new Date(date).toLocaleDateString()}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="reachTotal"
              stroke="#82ca9d"
              name="リーチ数"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 