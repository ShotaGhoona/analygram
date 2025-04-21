'use client';

import { useState, useEffect } from 'react';

type Company = {
  id: string;
  name: string;
  igId: string;
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("アヤホーム/滋賀/分譲地/新築戸建/注文住宅");
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <header className="pl-[250px] bg-white shadow">
      <div className="w-full px-4 py-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Instagram分析</h1>
          <div className="flex items-center ml-auto relative">
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              <p className="mr-2">{selectedCompany}</p>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
            
            {isOpen && (
              <div className="absolute top-full right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                <div className="py-2">
                  {companies.map((company) => (
                    <div 
                      key={company.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCompany(company.name);
                        setIsOpen(false);
                      }}
                    >
                      {company.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 