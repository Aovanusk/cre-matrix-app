"use client";

import { useI18n } from "./I18nProvider";
import { Zap, Target, Download, FileSpreadsheet, ShieldCheck, Sparkles } from "lucide-react";

interface LandingSectionsProps {
  onGetStarted: () => void;
}

export default function LandingSections({ onGetStarted }: LandingSectionsProps) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-24 py-8">
      {/* Hero Section - Floating Dark Premium Card */}
      <section className="relative overflow-hidden bg-slate-950 text-white rounded-[2.5rem] shadow-2xl p-10 md:p-20 text-center border border-slate-800/60 animate-float">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-blue-200 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Underwriting for Brokers</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            {t('landing.hero.title')}
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-10 font-light">
            {t('landing.hero.desc')}
          </p>
          
          <button
            onClick={onGetStarted}
            className="group relative bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)]"
          >
            <span className="relative z-10">{t('landing.hero.btn')}</span>
            <div className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0 transition-opacity group-hover:opacity-100 blur-lg -z-10"></div>
          </button>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t('landing.features.title')}
          </h2>
          <p className="text-slate-500 text-lg">Stop manual data entry. Start closing deals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 - Large spanning */}
          <div className="md:col-span-2 glass rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-slate-200/50">
            <div className="w-14 h-14 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl mb-3 text-slate-900">{t('landing.features.1.title')}</h3>
            <p className="text-slate-600 text-lg leading-relaxed">{t('landing.features.1.desc')}</p>
          </div>
          
          {/* Feature 2 */}
          <div className="glass rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-slate-200/50">
            <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">{t('landing.features.2.title')}</h3>
            <p className="text-slate-600 leading-relaxed">{t('landing.features.2.desc')}</p>
          </div>

          {/* Feature 3 */}
          <div className="glass rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-slate-200/50">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900">{t('landing.features.3.title')}</h3>
            <p className="text-slate-600 leading-relaxed">{t('landing.features.3.desc')}</p>
          </div>

          {/* Feature 4 - New */}
          <div className="md:col-span-2 glass rounded-3xl p-8 hover:-translate-y-1 transition-transform duration-300 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="w-14 h-14 bg-white/10 text-blue-300 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-2xl mb-3 text-white">Enterprise-Grade Security</h3>
            <p className="text-slate-300 text-lg leading-relaxed">
              Built for commercial real estate professionals. Your Offering Memorandums (OMs) are processed via secure APIs and are strictly never used for public AI training models.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
