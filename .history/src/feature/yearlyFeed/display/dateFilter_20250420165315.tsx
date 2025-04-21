'use client';

import { useState } from 'react';

interface DateFilterProps {
  onDateChange: (startDate: Date, endDate: Date) => void;
}

const DateFilter = ({ onDateChange }: DateFilterProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setStartDate(newDate);
    onDateChange(newDate, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setEndDate(newDate);
    onDateChange(startDate, newDate);
  };

  return (
    <div className="flex items-center space-x-4">
      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
          開始日
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate.toISOString().split('T')[0]}
          onChange={handleStartDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          終了日
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate.toISOString().split('T')[0]}
          onChange={handleEndDateChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DateFilter; 