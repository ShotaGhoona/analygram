'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AccountInsight } from '@/types/accountInsight';
import { useMemo } from 'react';
import { aggregateFollowData } from '@/components/calucurate/accountCalculate';

interface LeftGraphProps {
  insights: AccountInsight[];
}

const LeftGraph = ({ insights }: LeftGraphProps) => {
  const graphData = useMemo(() => {
    return aggregateFollowData(insights);
  }, [insights]);

  return (
    <div className="h-64 w-full bg-white p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={graphData}
            margin={{ top: 5, right: 120, left: 20, bottom: 5 }}  // 右側に凡例の分だけ余白
          >
            <Line type="monotone" dataKey="followers" name="フォロワー数" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="follows"   name="フォロー数"   stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
            <XAxis  dataKey="yearMonth"   tick={{ fontSize: 12, fill: '#666' }} stroke="#e5e5e5" />
            <YAxis  tick={{ fontSize: 12, fill: '#666' }} stroke="#e5e5e5" domain={[0, 'auto']} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 4 }} />

            {/* ⬇️ ここだけ変更 */}
            <Legend
              layout="vertical"        // 縦並び
              align="right"            // 右側
              verticalAlign="middle"   // 縦方向中央
              iconType="circle"
            />
          </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default LeftGraph;
