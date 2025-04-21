'use client';

import { PostInsight } from '@/types/post';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

interface GraphProps {
  data: PostInsight[];
}

const Graph = ({ data }: GraphProps) => {
  const sortedData = [...data].sort((a, b) => 
    new Date(a.作成日).getTime() - new Date(b.作成日).getTime()
  );

  const labels = sortedData.map(post => 
    new Date(post.作成日).toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })
  );

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: 'リーチ',
        data: sortedData.map(post => Number(post.リーチ)),
        borderColor: '#C5BC9D',
        borderWidth: 2,
        fill: false,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'いいね',
        data: sortedData.map(post => post.いいね),
        backgroundColor: '#E5E7EB',
        stack: 'Stack 0',
      },
      {
        type: 'bar' as const,
        label: 'コメント',
        data: sortedData.map(post => post.コメント),
        backgroundColor: '#93C5FD',
        stack: 'Stack 0',
      },
      {
        type: 'bar' as const,
        label: '保存',
        data: sortedData.map(post => post.保存),
        backgroundColor: '#6B7280',
        stack: 'Stack 0',
      },
      {
        type: 'bar' as const,
        label: 'シェア',
        data: sortedData.map(post => post.シェア),
        backgroundColor: '#10B981',
        stack: 'Stack 0',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        position: 'left' as const,
        min: 0,
        max: 30,
      },
      y1: {
        position: 'right' as const,
        min: 0,
        max: 1000,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Graph; 