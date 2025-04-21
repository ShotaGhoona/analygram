'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';
import LineGraph from '@/components/monthly/LineGraph';

export const NewFollowersGraph = () => {
  const monthlyData = useMemo(() => {
    return calculateNewFollowers(accountInsightData);
  }, []);

  const lines = [
    {
      key: 'newFollowers',
      name: '新規フォロワー数',
      stroke: '#8884d8',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} />;
};

export const ReachImpressionGraph = () => {
  const monthlyData = useMemo(() => {
    return calculateNewFollowers(accountInsightData);
  }, []);

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

  return <LineGraph data={monthlyData} lines={lines} />;
};

export const ProfileViewsGraph = () => {
  const monthlyData = useMemo(() => {
    return calculateNewFollowers(accountInsightData);
  }, []);

  const lines = [
    {
      key: 'profileViews',
      name: 'プロフィールのアクセス',
      stroke: '#ff7300',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} />;
};

export const WebsiteTapsGraph = () => {
  const monthlyData = useMemo(() => {
    return calculateNewFollowers(accountInsightData);
  }, []);

  const lines = [
    {
      key: 'websiteTaps',
      name: 'ウェブサイトのタップ',
      stroke: '#0088fe',
    },
  ];

  return <LineGraph data={monthlyData} lines={lines} />;
}; 