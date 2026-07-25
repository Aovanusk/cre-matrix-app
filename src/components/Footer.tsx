"use client";

import Link from "next/link";
import { CreditCard, Wallet, Bitcoin } from "lucide-react";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.about.title')}</h3>
          <p className="text-sm mb-4">
            {t('footer.about.desc')}
          </p>
          <p className="text-sm">
            {t('footer.support')} <a href="mailto:support.cre.matrix@gmail.com" className="text-blue-400 hover:underline">support.cre.matrix@gmail.com</a>
          </p>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.legal.title')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                {t('footer.legal.terms')}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                {t('footer.legal.privacy')}
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                {t('footer.legal.refund')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">{t('footer.payment.title')}</h3>
          <p className="text-sm mb-4">{t('footer.payment.desc')}</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded text-white text-xs font-medium">
              <CreditCard className="w-4 h-4 text-blue-400" /> VISA
            </div>
            <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded text-white text-xs font-medium">
              <CreditCard className="w-4 h-4 text-amber-500" /> MasterCard
            </div>
            <div className="flex items-center gap-1 bg-slate-800 px-3 py-1.5 rounded text-white text-xs font-medium">
              <Wallet className="w-4 h-4 text-emerald-400" /> МИР
            </div>
          </div>
        </div>

      </div>
      
      <div className="max-w-5xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
        {t('footer.rights').replace('{0}', new Date().getFullYear().toString())}
      </div>
    </footer>
  );
}
