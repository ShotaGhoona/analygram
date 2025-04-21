'use client';

import { PostInsight } from '@/types/post';
import { useState } from 'react';

interface FilterProps {
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
  onTypeChange: (types: ('FEED' | 'REELS' | 'STORY')[]) => void;
  startDate: string;
  endDate: string;
  onDateChange: (startDate: string, endDate: string) => void;
}

const Filter = ({ selectedTypes, onTypeChange, startDate, endDate, onDateChange }: FilterProps) => {
  const types: ('FEED' | 'REELS' | 'STORY')[] = ['FEED', 'REELS', 'STORY'];
  const typeLabels = {
    'FEED': 'フィード',
    'REELS': 'リール',
    'STORY': 'ストーリー'
  };

  const handleTypeClick = (type: 'FEED' | 'REELS' | 'STORY') => {
    if (selectedTypes.includes(type)) {
      onTypeChange(selectedTypes.filter(t => t !== type));
    } else {
      onTypeChange([...selectedTypes, type]);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'end') => {
    const date = e.target.value;
    if (type === 'start') {
      onDateChange(date, endDate);
    } else {
      onDateChange(startDate, date);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        {types.map(type => (
          <button
            key={type}
            onClick={() => handleTypeClick(type)}
            className={`px-4 py-2 rounded-lg border ${
              selectedTypes.includes(type)
                ? 'bg-[#C5BC9D] text-white border-[#C5BC9D]'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {typeLabels[type]}
          </button>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="text-sm text-gray-700">開始日:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => handleDateChange(e, 'start')}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="endDate" className="text-sm text-gray-700">終了日:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => handleDateChange(e, 'end')}
            className="px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Filter; 