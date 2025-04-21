'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CompanyDropdown from '../common/CompanyDropdown';
import { useCompanyStore } from '@/store/companyStore';
import Link from 'next/link';
import Image from 'next/image';
import DateFilter from '../common/dateFilter';

type Company = {
  id: string;
  name: string;
  igId: string;
};

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { selectedCompany, setSelectedCompany } = useCompanyStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanies(data);
        
        // 初回読み込み時に最初の会社を選択
        if (data.length > 0 && !selectedCompany) {
          setSelectedCompany(data[0].id);
        }
      } catch (error) {
        console.error('会社情報の取得に失敗:', error);
      }
    };

    fetchCompanies();
  }, [selectedCompany, setSelectedCompany]);

  useEffect(() => {
    // 選択された会社と日付に基づいてURLを更新
    if (selectedCompany) {
      const params = new URLSearchParams();
      params.set('companyId', selectedCompany);
      params.set('date', selectedDate.toISOString().split('T')[0]);
      router.push(`/?${params.toString()}`);
    }
  }, [selectedCompany, selectedDate, router]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company.id);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Instagram Analytics</h1>
            <CompanyDropdown
              selectedCompany={selectedCompany}
              onCompanyChange={handleCompanySelect}
            />
          </div>
          <DateFilter
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>
    </header>
  );
} 