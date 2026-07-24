"use client";

import { useState } from "react";
import { Loader2, Zap } from "lucide-react";

interface PricingProps {
  session: any;
}

const PACKAGES = [
  { credits: 50, priceRUB: 900, name: "Starter" },
  { credits: 150, priceRUB: 2500, name: "Pro" },
  { credits: 400, priceRUB: 5500, name: "Enterprise" }
];

export default function Pricing({ session }: PricingProps) {
  const [loadingPkg, setLoadingPkg] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (credits: number, priceRUB: number) => {
    if (!session) {
      setError("Пожалуйста, авторизуйтесь для покупки кредитов.");
      return;
    }

    setLoadingPkg(credits);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ amount: priceRUB, credits })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Ошибка создания платежа");
      }

      // Редирект на AAio
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
          Пополнение баланса
        </h2>
        <p className="text-slate-500 mt-2">Оплачивайте банковской картой РФ, СБП или криптовалютой.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKAGES.map((pkg) => (
          <div key={pkg.credits} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col items-center hover:border-blue-300 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-slate-500 uppercase tracking-wider">{pkg.name}</h3>
            <div className="my-4 text-4xl font-extrabold text-slate-900">
              {pkg.priceRUB} ₽
            </div>
            <div className="text-blue-600 font-medium mb-6 bg-blue-50 px-4 py-1 rounded-full">
              {pkg.credits} кредитов
            </div>
            
            <button
              onClick={() => handleBuy(pkg.credits, pkg.priceRUB)}
              disabled={loadingPkg !== null}
              className="w-full mt-auto py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loadingPkg === pkg.credits ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Перенаправление...
                </>
              ) : (
                "Оплатить (AAio)"
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
