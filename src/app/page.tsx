"use client";

import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import ResultsTable, { PropertyData } from "@/components/ResultsTable";
import AuthModal from "@/components/AuthModal";
import Pricing from "@/components/Pricing";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import LandingSections from "@/components/LandingSections";
import HistoryDashboard from "@/components/HistoryDashboard";
import { Building2, LogOut, Zap, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/components/I18nProvider";

export default function Home() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchCredits(session.user.id);
      } else {
        setCredits(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();
    
    if (data) setCredits(data.credits_balance);
  };

  const handleExtractionSuccess = (data: any, fileName: string) => {
    setProperties((prev) => [
      {
        id: crypto.randomUUID(),
        fileName,
        ...data,
      },
      ...prev,
    ]);
    if (session) fetchCredits(session.user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900 bg-transparent relative">
      {/* Absolute Grid Background is applied in globals.css, this container is transparent */}
      
      {/* Top Header - Glassmorphism */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 mb-8">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                {t('page.header.title')}
              </h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
                AI Platform
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {session ? (
              <div className="flex items-center gap-3 bg-white/50 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {credits !== null ? credits : "..."}
                </div>
                <div className="w-px h-4 bg-slate-300"></div>
                <div className="text-sm font-medium text-slate-600 truncate max-w-[100px] md:max-w-[150px]">
                  {session.user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-red-500 transition-colors ml-1 p-1 rounded-full hover:bg-red-50"
                  title={t('header.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors"
              >
                {t('header.login')}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        
        {!session ? (
          <LandingSections onGetStarted={() => setIsAuthModalOpen(true)} />
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Secure Area Badge */}
            <div className="flex items-center justify-center gap-2 mb-8 text-emerald-600 bg-emerald-50 w-fit mx-auto px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-100 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> Secure Enterprise Environment
            </div>

            {/* Upload Zone */}
            <section className="bg-white/80 backdrop-blur-md p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">{t('page.upload.title')}</h2>
              
              {credits === 0 ? (
                <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-[1.5rem] bg-slate-50/50">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{t('page.empty.title')}</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto text-lg">{t('page.empty.desc')}</p>
                  <button
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1"
                  >
                    {t('page.empty.btn')}
                  </button>
                </div>
              ) : (
                <FileUploader onExtractionSuccess={handleExtractionSuccess} session={session} />
              )}
            </section>

            {/* History Dashboard */}
            <HistoryDashboard session={session} onViewData={handleExtractionSuccess} />
          </div>
        )}

        {/* Results Table Zone */}
        <section className={session ? "mt-12" : "mt-0"}>
          <ResultsTable data={properties} />
        </section>

        {/* Pricing Zone */}
        <Pricing session={session} />

      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}
