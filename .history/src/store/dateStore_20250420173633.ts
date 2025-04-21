import { create } from 'zustand';

interface DateState {
  startDate: string;
  endDate: string;
  setDateRange: (startDate: string, endDate: string) => void;
}

const getInitialDates = () => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  return {
    startDate: thirtyDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0],
  };
};

export const useDateStore = create<DateState>((set) => ({
  ...getInitialDates(),
  setDateRange: (startDate: string, endDate: string) => set({ startDate, endDate }),
})); 