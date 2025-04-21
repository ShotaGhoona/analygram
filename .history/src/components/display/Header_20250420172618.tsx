'use client';

import { useState, useEffect } from 'react';
import CompanyDropdown from '../common/CompanyDropdown';
import { useCompanyStore } from '@/store/companyStore';
import Link from 'next/link';
import Image from 'next/image';

type Company = {
  id: string;
  name: string;
  igId: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const { selectedCompany, setSelectedCompany } = useCompanyStore();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanies(data);
        
        // 初回読み込み時に最初の会社を選択
        if (data.length > 0 && !selectedCompany) {
          setSelectedCompany(data[0]);
        }
      } catch (error) {
        console.error('会社情報の取得に失敗:', error);
      }
    };

    fetchCompanies();
  }, [selectedCompany, setSelectedCompany]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
  };

  return (
    <header className="">
      <div className="w-full p-4 bg-gray-100 shadow">
        <div className="flex items-center">
          <div className="flex items-center gap-6">
            <Image src="/SVG/logo.svg" alt="logo" width={32} height={32} />
            <h1 className="text-xl font-bold">AnalyGram</h1>
          </div>
          <div className="flex items-center ml-auto relative">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <p className="mr-2">{selectedCompany?.name || '会社を選択'}</p>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            
            <CompanyDropdown
              isOpen={isOpen}
              companies={companies}
              onSelect={handleCompanySelect}
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex items-center px-12 py-4 gap-4">
          <Link href="/yearly">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">年間インサイト</h2>
          </Link>
          <Link href="/yearly/feed">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">年間フィード</h2>
          </Link>
          <Link href="/yearly/story">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">年間ストーリー</h2>
          </Link>
          <Link href="/yearly/reel">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">年間リール</h2>
          </Link>
          <Link href="/monthly">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">月間インサイト</h2>
          </Link>
          <Link href="/monthly/master">
            <h2 className="text-medium font-semibold mb-2 bg-gray-100 py-2 px-8 rounded-full shadow-md">月間マスター</h2>
          </Link>

      </div>
    </header>
  );
} 