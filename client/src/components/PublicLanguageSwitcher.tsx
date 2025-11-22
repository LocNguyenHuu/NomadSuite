import React from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LANGUAGES = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
];

export default function PublicLanguageSwitcher() {
  const [currentLang, setCurrentLang] = React.useState('en');

  React.useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLang(savedLang);
  }, []);

  const currentLanguage = LANGUAGES.find(lang => lang.code === currentLang) || LANGUAGES[0];

  const handleLanguageChange = (languageCode: string) => {
    setCurrentLang(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-public-language-switcher"
        >
          <span className="text-xl" aria-label={`Current language: ${currentLanguage.name}`}>
            {currentLanguage.flag}
          </span>
          <Languages className="h-3 w-3 absolute -bottom-0.5 -right-0.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`flex items-center gap-3 cursor-pointer ${
              currentLanguage.code === language.code ? 'bg-accent' : ''
            }`}
            data-testid={`public-language-option-${language.code}`}
          >
            <span className="text-xl">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
