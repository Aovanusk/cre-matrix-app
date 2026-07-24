"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";
import { useI18n } from "./I18nProvider";

interface PricingProps {
  session: any;
}

const PACKAGES = [
  { id: 'starter', credits: 50, priceUSD: 100, name: "Starter" },
  { id: 'pro', credits: 150, priceUSD: 250, name: "Pro" },
  { id: 'enterprise', credits: 400, priceUSD: 500, name: "Enterprise" }
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
    <div id="pricing" className="w-full max-w-4xl mx-auto mt-16 pb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
          <Zap className="text-yellow-500 w-6 h-6" fill="currentColor" />
          {t('pricing.title')}
        </h2>
        <p className="text-slate-500 mt-2">{t('pricing.desc')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center hover:border-blue-300 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider">{pkg.name}</h3>
            <div className="my-4 text-4xl font-extrabold text-slate-900">
              ${pkg.priceUSD}
            </div>
            <div className="text-blue-600 font-medium mb-6 bg-blue-50 px-4 py-1 rounded-full">
              {pkg.credits} {t('pricing.credits')}
            </div>
            
            <button
              onClick={() => handleBuy(pkg.id)}
              disabled={loadingPkg !== null}
              className="w-full mt-auto py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loadingPkg === pkg.id ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
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
