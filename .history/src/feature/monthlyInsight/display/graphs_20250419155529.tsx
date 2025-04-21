'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphProps {
  startDate: string;
  endDate: string;
}

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    return monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(value) => `${value}日`} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="newFollowers" name="新規フォロワー数" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    return monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(value) => `${value}日`} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="reach" name="リーチ" stroke="#82ca9d" />
        <Line type="monotone" dataKey="impressions" name="インプレッション" stroke="#ffc658" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const ProfileViewsGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    return monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(value) => `${value}日`} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="profileViews" name="プロフィールアクセス" stroke="#ff7300" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const WebsiteTapsGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    return monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(value) => `${value}日`} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="websiteTaps" name="ウェブサイトのタップ" stroke="#0088fe" />
      </LineChart>
    </ResponsiveContainer>
  );
}; 