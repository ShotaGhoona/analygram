import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface GraphProps {
  companyId: number;
  startDate: string;
  endDate: string;
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
}

const NewFollowersGraph = ({ companyId, startDate, endDate, selectedTypes }: GraphProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          companyId: companyId.toString(),
          startDate,
          endDate,
          mediaTypes: selectedTypes.join(','),
        });
        const response = await fetch(`/api/insights/followers?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center py-4">データがありません</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="followers" stroke="#8884d8" name="フォロワー数" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ReachImpressionGraph = ({ companyId, startDate, endDate, selectedTypes }: GraphProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          companyId: companyId.toString(),
          startDate,
          endDate,
          mediaTypes: selectedTypes.join(','),
        });
        const response = await fetch(`/api/insights/reach?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center py-4">データがありません</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="reach" stroke="#82ca9d" name="リーチ数" />
        <Line type="monotone" dataKey="impressions" stroke="#ffc658" name="インプレッション数" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const ProfileViewsGraph = ({ companyId, startDate, endDate, selectedTypes }: GraphProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          companyId: companyId.toString(),
          startDate,
          endDate,
          mediaTypes: selectedTypes.join(','),
        });
        const response = await fetch(`/api/insights/profile-views?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center py-4">データがありません</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="profileViews" stroke="#8884d8" name="プロフィール閲覧数" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const WebsiteTapsGraph = ({ companyId, startDate, endDate, selectedTypes }: GraphProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          companyId: companyId.toString(),
          startDate,
          endDate,
          mediaTypes: selectedTypes.join(','),
        });
        const response = await fetch(`/api/insights/website-taps?${params}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companyId, startDate, endDate, selectedTypes]);

  if (loading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (data.length === 0) return <div className="text-center py-4">データがありません</div>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="websiteTaps" stroke="#82ca9d" name="ウェブサイトタップ数" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export { NewFollowersGraph, ReachImpressionGraph, ProfileViewsGraph, WebsiteTapsGraph }; 