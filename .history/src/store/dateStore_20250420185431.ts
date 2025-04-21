import { create } from 'zustand';

interface DateState {
  startDate: string;
  endDate: string;
  setDateRange: (startDate: string, endDate: string) => void;
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  startDate: '',
  endDate: '',
  setDateRange: (startDate: string, endDate: string) => set({ startDate, endDate }),
  resetToDefault: (defaultStartDate: string, defaultEndDate: string) => 
    set({ startDate: defaultStartDate, endDate: defaultEndDate }),
})); 