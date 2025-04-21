import { create } from 'zustand';
import { Company } from '@prisma/client';

interface SelectedCompanyState {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
}

const useSelectedCompanyStore = create<SelectedCompanyState>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
}));

export const useSelectedCompany = () => {
  const { selectedCompany, setSelectedCompany } = useSelectedCompanyStore();
  return { selectedCompany, setSelectedCompany };
}; 