import { useLandingI18n, type LandingLanguage } from '@/contexts/LandingI18nContext';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languageConfig: Record<LandingLanguage, { flag: string; label: string }> = {
  en: { flag: '🇬🇧', label: 'English' },
  de: { flag: '🇩🇪', label: 'Deutsch' },
  fr: { flag: '🇫🇷', label: 'Français' },
  vi: { flag: '🇻🇳', label: 'Tiếng Việt' },
  ja: { flag: '🇯🇵', label: '日本語' },
  zh: { flag: '🇨🇳', label: '中文' }
};

export default function PublicLanguageSwitcher() {
  const { language, setLanguage } = useLandingI18n();

  const handleLanguageChange = (lang: LandingLanguage) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 sm:h-10 px-2 sm:px-3"
          data-testid="button-language-switcher"
        >
          <span className="text-lg sm:text-xl mr-1 sm:mr-2">{languageConfig[language].flag}</span>
          <Globe className="h-4 w-4 hidden sm:inline" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(languageConfig) as [LandingLanguage, typeof languageConfig[LandingLanguage]][]).map(([lang, config]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={language === lang ? 'bg-accent' : ''}
            data-testid={`menu-item-language-${lang}`}
          >
            <span className="text-lg mr-2">{config.flag}</span>
            <span>{config.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
