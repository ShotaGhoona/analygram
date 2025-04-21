import { create } from 'zustand';

type Company = {
  id: string;
  name: string;
  igId: string;
};

interface CompanyState {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  selectedCompany: null,
  setSelectedCompany: (company) => set({ selectedCompany: company }),
})); 