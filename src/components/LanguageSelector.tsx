
import React from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const languages = [
    { code: 'english' as Language, name: 'English', nativeName: 'English' },
    { code: 'odia' as Language, name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'hindi' as Language, name: 'Hindi', nativeName: 'हिंदी' },
  ];

  const currentLangData = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none">
        <Globe className="w-4 h-4" />
        <span>{currentLangData?.name}</span>
        <ChevronDown className="w-3 h-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => setLanguage(language.code)}
            className={`cursor-pointer ${
              currentLanguage === language.code ? 'bg-blue-50 text-blue-600' : ''
            }`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{language.name}</span>
              <span className="text-xs text-gray-500">{language.nativeName}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
