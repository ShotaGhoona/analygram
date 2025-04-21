import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("アヤホーム/滋賀/分譲地/新築戸建/注文住宅");

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
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
                  {/* 会社リストは後で追加 */}
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCompany("アヤホーム/滋賀/分譲地/新築戸建/注文住宅");
                      setIsOpen(false);
                    }}
                  >
                    アヤホーム/滋賀/分譲地/新築戸建/注文住宅
                  </div>
                  <div 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCompany("ドルフィン八戸店");
                      setIsOpen(false);
                    }}
                  >
                    ドルフィン八戸店
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 