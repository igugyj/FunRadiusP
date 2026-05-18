'use client';

import { useState } from 'react';
import { useLanguage, type Language } from '@/lib/i18n';

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className = '' }: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh' as Language, label: '中文', flag: '🇨🇳' },
    { code: 'en' as Language, label: 'English', flag: '🇺🇸' },
    { code: 'es' as Language, label: 'Español', flag: '🇪🇸' },
    { code: 'ja' as Language, label: '日本語', flag: '🇯🇵' },
    { code: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
    { code: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-1"
        aria-label={t('language.switch')}
        title={t('language.switch')}
      >
        <span className="text-lg">{currentLang.flag}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute right-0 mt-2 z-50 rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--secondary)',
            }}
          >
            <div className="py-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left transition-all duration-150 flex items-center gap-2 ${
                    language === lang.code
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-primary/5 hover:text-primary'
                  }`}
                  style={{ color: 'var(--text)' }}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
