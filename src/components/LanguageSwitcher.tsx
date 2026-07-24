"use client";

import { useI18n } from "./I18nProvider";
import { Globe } from "lucide-react";
import { Language } from "@/lib/i18n/translations";

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(e.target.value as Language);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-lg px-3 py-1.5 border border-slate-200">
      <Globe className="w-4 h-4 text-slate-500" />
      <select 
        value={lang} 
        onChange={handleLangChange}
        className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer appearance-none pr-4"
        style={{ backgroundImage: 'none' }}
      >
        <option value="en">EN</option>
        <option value="ru">RU</option>
        <option value="es">ES</option>
        <option value="ar">عربي</option>
      </select>
    </div>
  );
}
