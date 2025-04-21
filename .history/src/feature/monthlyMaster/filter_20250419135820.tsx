'use client';

import { PostInsight } from '@/types/post';

interface FilterProps {
  selectedTypes: ('FEED' | 'REELS' | 'STORY')[];
  onTypeChange: (types: ('FEED' | 'REELS' | 'STORY')[]) => void;
}

const Filter = ({ selectedTypes, onTypeChange }: FilterProps) => {
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

  return (
    <div className="flex gap-2 mb-4">
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
  );
};

export default Filter; 