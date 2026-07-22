"use client";

import { useState } from "react";
import FileUploader from "@/components/FileUploader";
import ResultsTable, { PropertyData } from "@/components/ResultsTable";
import { Building2 } from "lucide-react";

export default function Home() {
  const [properties, setProperties] = useState<PropertyData[]>([]);

  const handleExtractionSuccess = (data: any, fileName: string) => {
    // Добавляем новый результат в начало массива таблиц
    setProperties((prev) => [
      {
        id: crypto.randomUUID(), // Уникальный ID для React
        fileName,
        ...data,
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0 mx-auto md:mx-0">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              CRE Matrix Generator
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Загрузите PDF презентацию объекта (OM/Flyer). ИИ автоматически извлечет NOI, Cap Rate, Цену и Площадь.
            </p>
          </div>
        </header>

        {/* Upload Zone */}
        <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Загрузка файла</h2>
          <FileUploader onExtractionSuccess={handleExtractionSuccess} />
        </section>

        {/* Results Table Zone */}
        <section>
          <ResultsTable data={properties} />
        </section>

      </main>
    </div>
  );
}
