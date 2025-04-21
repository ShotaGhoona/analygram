import { create } from 'zustand';

interface DateState {
  startDate: string;
  endDate: string;
  setDateRange: (startDate: string, endDate: string) => void;
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => void;
}

const getInitialDates = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  return {
    startDate: firstDayOfMonth.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

export const useDateStore = create<DateState>((set) => ({
  ...getInitialDates(),
  setDateRange: (startDate: string, endDate: string) => set({ startDate, endDate }),
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => 
    set({ startDate: defaultStartDate, endDate: defaultEndDate }),
})); 