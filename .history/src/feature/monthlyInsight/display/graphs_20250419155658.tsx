'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';
import LineGraph from '@/components/monthly/LineGraph';

interface GraphProps {
  startDate: string;
  endDate: string;
}

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const monthlyData = useMemo(() => {
    const data = calculateNewFollowers(accountInsightData);
    return data.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  const lines = [
    {
      key: 'newFollowers',
      name: '新規フォロワー数',
      stroke: '#8884d8',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} height="300px" />;
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const monthlyData = useMemo(() => {
    const data = calculateNewFollowers(accountInsightData);
    return data.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  const lines = [
    {
      key: 'impressions',
      name: 'インプレッション',
      stroke: '#82ca9d',
    },
    {
      key: 'reach',
      name: 'リーチ',
      stroke: '#ffc658',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} height="300px" />;
};

export const ProfileViewsGraph = ({ startDate, endDate }: GraphProps) => {
  const monthlyData = useMemo(() => {
    const data = calculateNewFollowers(accountInsightData);
    return data.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  const lines = [
    {
      key: 'profileViews',
      name: 'プロフィールのアクセス',
      stroke: '#ff7300',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} height="300px" />;
};

export const WebsiteTapsGraph = ({ startDate, endDate }: GraphProps) => {
  const monthlyData = useMemo(() => {
    const data = calculateNewFollowers(accountInsightData);
    return data.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });
  }, [startDate, endDate]);

  const lines = [
    {
      key: 'websiteTaps',
      name: 'ウェブサイトのタップ',
      stroke: '#0088fe',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} height="300px" />;
}; 