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

interface GraphProps {
  insights: AccountInsight[];
}

const Graph = ({ insights }: GraphProps) => {
  const data = insights.map((insight) => ({
    date: new Date(insight.date).toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
    }),
    followers: insight.followers,
    reachTotal: insight.reachTotal,
    impressions: insight.impressions,
    profileViews: insight.profileViews,
    websiteClicks: insight.websiteClicks,
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
          <Line
            type="monotone"
            dataKey="followers"
            stroke="#8884d8"
            name="フォロワー数"
          />
          <Line
            type="monotone"
            dataKey="reachTotal"
            stroke="#82ca9d"
            name="リーチ数"
          />
          <Line
            type="monotone"
            dataKey="impressions"
            stroke="#ffc658"
            name="インプレッション数"
          />
          <Line
            type="monotone"
            dataKey="profileViews"
            stroke="#ff7300"
            name="プロフィール閲覧数"
          />
          <Line
            type="monotone"
            dataKey="websiteClicks"
            stroke="#0088fe"
            name="ウェブサイトクリック数"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph; 