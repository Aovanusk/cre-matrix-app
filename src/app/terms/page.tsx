"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function TermsPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">{t('nav.back')}</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">{t('terms.title')}</h1>
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p><strong>{t('terms.p1.title')}</strong><br/>
        {t('terms.p1.text')}</p>
        
        <p><strong>{t('terms.p2.title')}</strong><br/>
        {t('terms.p2.text')}</p>
        
        <p><strong>{t('terms.p3.title')}</strong><br/>
        {t('terms.p3.text')}</p>
        
        <p><strong>{t('terms.p4.title')}</strong><br/>
        {t('terms.p4.text')}</p>
        
        <p><strong>{t('terms.p5.title')}</strong><br/>
        {t('terms.p5.text')}<br/>
        Email: support.cre.matrix@gmail.com</p>
      </div>
    </div>
  );
}
