"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useI18n } from "./I18nProvider";
import { Clock, FileText, ChevronRight, Loader2 } from "lucide-react";
import { PropertyData } from "./ResultsTable";

interface HistoryDashboardProps {
  session: any;
  onViewData: (data: PropertyData[], fileName: string) => void;
}

export default function HistoryDashboard({ session, onViewData }: HistoryDashboardProps) {
  const { t } = useI18n();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchHistory();
    }
  }, [session]);

  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching history:", error);
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 mt-8">
        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-6 h-6 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">{t('history.title')}</h3>
        <p className="text-slate-500">{t('history.empty')}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-slate-400" />
        {t('history.title')}
      </h2>
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">{t('history.col.file')}</th>
                <th className="px-6 py-4 font-medium">{t('history.col.date')}</th>
                <th className="px-6 py-4 font-medium text-right">{t('history.col.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <span className="font-medium text-slate-700 truncate max-w-[200px] md:max-w-md">
                        {item.file_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewData([item.extracted_data], item.file_name)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-end gap-1 w-full"
                    >
                      {t('history.btn.view')}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
