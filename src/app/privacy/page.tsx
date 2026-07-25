"use client";

import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";

export default function PrivacyPage() {
  const { t } = useI18n();
  
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 bg-white min-h-screen">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">{t('nav.back')}</Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">{t('privacy.title')}</h1>
      <div className="space-y-6 text-slate-700 leading-relaxed">
        <p><strong>{t('privacy.p1.title')}</strong><br/>
        {t('privacy.p1.text')}</p>
        
        <p><strong>{t('privacy.p2.title')}</strong><br/>
        {t('privacy.p2.text')}</p>
        
        <p><strong>{t('privacy.p3.title')}</strong><br/>
        {t('privacy.p3.text')}</p>
        
        <p><strong>{t('privacy.p4.title')}</strong><br/>
        {t('privacy.p4.text')}</p>
        
        <p><strong>{t('legal.contact')}</strong><br/>
        Email: support.cre.matrix@gmail.com</p>
      </div>
    </div>
  );
}
