'use client';

import { AccountInsight } from '@/types/accountInsight';
import { useEffect, useState } from 'react';
import { useCompanyStore } from '@/components/store/companyStore';
import { calculateNewFollowers } from '@/components/calucurate/monthlyCalculate';
import LineGraph from '@/components/monthly/LineGraph';

interface GraphProps {
  startDate: string;
  endDate: string;
}

const fetchInsights = async (companyId: string, startDate: string, endDate: string) => {
  const params = new URLSearchParams({
    companyId,
    startDate,
    endDate,
  });

  const response = await fetch(`/api/accountInsights?${params}`);
  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }

  return response.json();
};

export const NewFollowersGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formattedData = monthlyData.map(item => ({
    date: item.date ? item.date.slice(0, 10) : '',
    value: item.followers,
  }));

  const lines = [
    { key: 'value', name: '新規フォロワー数', stroke: '#8884d8' },
  ];

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ReachImpressionGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formattedData = monthlyData.map(item => ({
    date: item.date ? item.date.slice(0, 10) : '',
    value: item.impressions,
  }));

  const lines = [
    { key: 'value', name: 'インプレッション', stroke: '#82ca9d' },
  ];

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const ProfileVisitsGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formattedData = monthlyData.map(item => ({
    date: item.date ? item.date.slice(0, 10) : '',
    value: item.profile_visits,
  }));

  const lines = [
    { key: 'value', name: 'プロフィールアクセス', stroke: '#0088fe' },
  ];

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
};

export const WebsiteTapRateGraph = ({ startDate, endDate }: GraphProps) => {
  const [data, setData] = useState<AccountInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedCompany } = useCompanyStore();

  useEffect(() => {
    const loadData = async () => {
      if (!selectedCompany) return;
      try {
        setIsLoading(true);
        const insights = await fetchInsights(selectedCompany.id, startDate, endDate);
        setData(insights);
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedCompany, startDate, endDate]);

  const monthlyData = calculateNewFollowers(data, startDate, endDate);

  if (!selectedCompany || isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const formattedData = monthlyData.map(item => ({
    date: item.date ? item.date.slice(0, 10) : '',
    value: item.website_tap_rate,
  }));

  const lines = [
    { key: 'value', name: 'ウェブサイトのタップ率', stroke: '#8884d8' },
  ];

  return <LineGraph data={formattedData} lines={lines} height="100%" />;
}; 