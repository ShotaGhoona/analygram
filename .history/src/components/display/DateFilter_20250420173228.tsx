'use client';

import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';

interface DateFilterProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateFilter = ({ selectedDate, onDateChange }: DateFilterProps) => {
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      onDateChange(date.toDate());
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DatePicker
        value={dayjs(selectedDate)}
        onChange={handleDateChange}
        format="YYYY-MM-DD"
        className="w-40"
      />
    </div>
  );
};

export default DateFilter; 