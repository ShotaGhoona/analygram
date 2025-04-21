'use client';

import accountInsightData from '@/data/account_insights_mock.json';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

interface GraphProps {
  startDate: string;
  endDate: string;
}

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    const filteredData = monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });

    return {
      labels: filteredData.map(row => `${row.date}日`),
      datasets: [
        {
          label: '新規フォロワー数',
          data: filteredData.map(row => row.newFollowers),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [startDate, endDate]);

  return <Line data={data} />;
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    const filteredData = monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });

    return {
      labels: filteredData.map(row => `${row.date}日`),
      datasets: [
        {
          label: 'リーチ',
          data: filteredData.map(row => row.reach),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'インプレッション',
          data: filteredData.map(row => row.impressions),
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };
  }, [startDate, endDate]);

  return <Line data={data} />;
};

export const ProfileViewsGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    const filteredData = monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });

    return {
      labels: filteredData.map(row => `${row.date}日`),
      datasets: [
        {
          label: 'プロフィールアクセス',
          data: filteredData.map(row => row.profileViews),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [startDate, endDate]);

  return <Line data={data} />;
};

export const WebsiteTapsGraph = ({ startDate, endDate }: GraphProps) => {
  const data = useMemo(() => {
    const monthlyData = calculateNewFollowers(accountInsightData);
    const filteredData = monthlyData.filter(row => {
      const rowDate = new Date(2025, 2, row.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return rowDate >= start && rowDate <= end;
    });

    return {
      labels: filteredData.map(row => `${row.date}日`),
      datasets: [
        {
          label: 'ウェブサイトのタップ',
          data: filteredData.map(row => row.websiteTaps),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };
  }, [startDate, endDate]);

  return <Line data={data} />;
}; 