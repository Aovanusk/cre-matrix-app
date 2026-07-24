"use client";

import { useI18n } from "./I18nProvider";
import { Zap, Target, Download } from "lucide-react";

interface LandingSectionsProps {
  onGetStarted: () => void;
}

export default function LandingSections({ onGetStarted }: LandingSectionsProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {t('landing.hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          {t('landing.hero.desc')}
        </p>
        <button
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-105"
        >
          {t('landing.hero.btn')}
        </button>
      </section>

      {/* Features Section */}
      <section className="py-12 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-center mb-12">{t('landing.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('landing.features.1.title')}</h3>
            <p className="text-slate-500 text-sm">{t('landing.features.1.desc')}</p>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('landing.features.2.title')}</h3>
            <p className="text-slate-500 text-sm">{t('landing.features.2.desc')}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{t('landing.features.3.title')}</h3>
            <p className="text-slate-500 text-sm">{t('landing.features.3.desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
