'use client';

type Company = {
  id: string;
  name: string;
  igId: string;
};

type CompanyDropdownProps = {
  isOpen: boolean;
  companies: Company[];
  onSelect: (company: Company) => void;
  onClose: () => void;
};

export default function CompanyDropdown({ isOpen, companies, onSelect, onClose }: CompanyDropdownProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-100 bg-gray-100 rounded-lg shadow-3xg max-h-200 overflow-y-auto z-50">
      <div className="py-2">
        {companies.map((company) => (
          <div 
            key={company.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onSelect(company);
              onClose();
            }}
          >
            {company.name}
          </div>
        ))}
      </div>
    </div>
  );
} 