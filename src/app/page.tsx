"use client";

import { useState, useEffect } from "react";
import FileUploader from "@/components/FileUploader";
import ResultsTable, { PropertyData } from "@/components/ResultsTable";
import AuthModal from "@/components/AuthModal";
import Pricing from "@/components/Pricing";
import { Building2, LogOut, Loader2, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
    // После успешной загрузки баланс уменьшился на бэкенде, обновляем его на фронте
    if (session) fetchCredits(session.user.id);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                CRE Matrix
              </h1>
              <p className="text-slate-500 mt-1 text-sm md:text-base">
                AI Assistant for Commercial Real Estate
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Кредиты: {credits !== null ? credits : "..."}
                </div>
                <div className="w-px h-4 bg-slate-200"></div>
                <div className="text-sm text-slate-500 truncate max-w-[120px]">
                  {session.user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Выйти"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium shadow-sm shadow-blue-500/20 transition-colors"
              >
                Войти
              </button>
            )}
          </div>
        </header>

        {/* Upload Zone */}
        <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Загрузка файла (OM / Flyer)</h2>
          
          {!session ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Для загрузки файлов необходимо войти</h3>
              <p className="text-slate-500 mb-6">Получите 3 бесплатных кредита при регистрации</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
              >
                Авторизоваться
              </button>
            </div>
          ) : credits === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">У вас закончились кредиты</h3>
              <p className="text-slate-500 mb-6">Пополните баланс, чтобы продолжить обработку файлов.</p>
              <button
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-sm"
              >
                Пополнить баланс
              </button>
            </div>
          ) : (
            <FileUploader onExtractionSuccess={handleExtractionSuccess} session={session} />
          )}
        </section>

        {/* Results Table Zone */}
        <section>
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
