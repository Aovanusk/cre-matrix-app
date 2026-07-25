"use client";

import { useState } from "react";
import { Loader2, Zap, Star } from "lucide-react";
import { useI18n } from "./I18nProvider";

interface PricingProps {
  session: any;
}

const PACKAGES = [
  { id: 'starter', credits: 50, priceUSD: 100, name: "Starter", recommended: false },
  { id: 'pro', credits: 150, priceUSD: 250, name: "Pro B2B", recommended: true },
  { id: 'enterprise', credits: 400, priceUSD: 500, name: "Enterprise", recommended: false }
];

export default function Pricing({ session }: PricingProps) {
  const [loadingPkg, setLoadingPkg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const handleBuy = async (packageId: string) => {
    if (!session) {
      setError(t('pricing.err.login'));
      return;
    }

    setLoadingPkg(packageId);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ packageId })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || t('pricing.err.fail'));
      }

      window.location.href = data.paymentUrl;
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoadingPkg(null);
    }
  };

  return (
    <div id="pricing" className="w-full max-w-5xl mx-auto mt-24 pb-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
          {t('pricing.title')}
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">{t('pricing.desc')}</p>
      </div>

      {error && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center font-medium shadow-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {PACKAGES.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`relative bg-white rounded-3xl p-8 flex flex-col items-center transition-all duration-300 ${
              pkg.recommended 
                ? 'border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.15)] md:-translate-y-4 md:scale-105 z-10' 
                : 'border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
            }`}
          >
            {pkg.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-blue-500/30">
                <Star className="w-3 h-3 fill-current" /> Recommended
              </div>
            )}
            
            <h3 className={`text-lg font-bold uppercase tracking-wider mb-2 ${pkg.recommended ? 'text-blue-600' : 'text-slate-500'}`}>
              {pkg.name}
            </h3>
            
            <div className="my-6 text-5xl font-extrabold text-slate-900 tracking-tight">
              ${pkg.priceUSD}
            </div>
            
            <div className={`font-semibold mb-8 px-6 py-2 rounded-full text-sm ${
              pkg.recommended ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-600'
            }`}>
              {pkg.credits} {t('pricing.credits')}
            </div>
            
            <ul className="w-full space-y-3 mb-8 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Instant API Access</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Excel Exports</li>
              <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-emerald-500" /> Enot.io Secure Payment</li>
            </ul>
            
            <button
              onClick={() => handleBuy(pkg.id)}
              disabled={loadingPkg !== null}
              className={`w-full mt-auto py-4 px-6 font-bold rounded-2xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 ${
                pkg.recommended 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50' 
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {loadingPkg === pkg.id ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('pricing.loading')}
                </>
              ) : (
                t('pricing.btn')
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
