"use client";

import Link from "next/link";
import { CreditCard, Wallet, Bitcoin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-20 border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">CRE Matrix</h3>
          <p className="text-sm mb-4">
            AI-powered data extraction for Commercial Real Estate professionals. 
            Automate underwriting and stop manual data entry.
          </p>
          <p className="text-sm">
            Contact Support: <a href="mailto:support@cre-matrix.com" className="text-blue-400 hover:underline">support@cre-matrix.com</a>
          </p>
        </div>

        {/* Legal Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Legal Information</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service (Договор оферты)
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy (Конфиденциальность)
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                Refund Policy (Правила возврата)
              </Link>
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Accepted Payments</h3>
          <p className="text-sm mb-4">We accept major credit cards and cryptocurrencies.</p>
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
        &copy; {new Date().getFullYear()} CRE Matrix. All rights reserved.
      </div>
    </footer>
  );
}
