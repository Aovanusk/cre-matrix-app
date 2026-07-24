"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/i18n/translations';

type I18nContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
  dir: 'ltr' | 'rtl';
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  // Загружаем язык из localStorage при монтировании
  useEffect(() => {
    const saved = localStorage.getItem('cre_matrix_lang') as Language;
    if (saved && translations[saved]) {
      setLangState(saved);
    } else {
      // Пытаемся угадать язык браузера
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'ru' || browserLang === 'es' || browserLang === 'ar') {
        setLangState(browserLang as Language);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('cre_matrix_lang', newLang);
  };

  const t = (key: string, ...args: any[]): string => {
    // @ts-ignore
    let translation = translations[lang][key] || translations['en'][key] || key;
    
    args.forEach((arg, i) => {
      translation = translation.replace(`{${i}}`, String(arg));
    });
    
    return translation;
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      <div dir={dir}>{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
