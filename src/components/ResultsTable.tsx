"use client";

import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export interface PropertyData {
  id: string; // Уникальный ID для ключа React
  fileName: string;
  property_address: string | null;
  asking_price: number | null;
  noi: number | null;
  cap_rate: number | null;
  occupancy_rate: number | null;
  gla_sqft: number | null;
  property_type: string | null;
}

interface ResultsTableProps {
  data: PropertyData[];
}

export default function ResultsTable({ data }: ResultsTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-2xl border border-slate-100 shadow-sm mt-6">
        <p className="text-slate-400">Нет данных. Загрузите первый PDF.</p>
      </div>
    );
  }

  const handleExportToExcel = () => {
    // Подготавливаем данные для экселя, делаем красивые заголовки
    const exportData = data.map((item) => ({
      "File Name": item.fileName,
      "Property Name / Address": item.property_address || "N/A",
      "Property Type": item.property_type || "N/A",
      "Asking Price ($)": item.asking_price || "N/A",
      "NOI ($)": item.noi || "N/A",
      "Cap Rate (%)": item.cap_rate || "N/A",
      "Occupancy (%)": item.occupancy_rate || "N/A",
      "GLA (Sq Ft)": item.gla_sqft || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "CRE Matrix");
    XLSX.writeFile(workbook, "cre_matrix_export.xlsx");
  };

  // Функция для красивого форматирования денег
  const formatMoney = (val: number | null) => {
    if (!val) return "-";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">Извлеченные данные</h2>
        <button
          onClick={handleExportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Download className="w-4 h-4" />
          Экспорт в Excel
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Объект / Адрес</th>
              <th className="px-6 py-4 font-medium">Тип</th>
              <th className="px-6 py-4 font-medium">Цена</th>
              <th className="px-6 py-4 font-medium">NOI</th>
              <th className="px-6 py-4 font-medium">Cap Rate</th>
              <th className="px-6 py-4 font-medium">Площадь (sqft)</th>
              <th className="px-6 py-4 font-medium">Заполн.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{item.property_address || "-"}</div>
                  <div className="text-xs text-slate-400 mt-1">{item.fileName}</div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-600">
                    {item.property_type || "-"}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-emerald-600">{formatMoney(item.asking_price)}</td>
                <td className="px-6 py-4 text-slate-600">{formatMoney(item.noi)}</td>
                <td className="px-6 py-4 font-medium text-blue-600">
                  {item.cap_rate ? `${item.cap_rate}%` : "-"}
                </td>
                <td className="px-6 py-4 text-slate-600">{item.gla_sqft ? item.gla_sqft.toLocaleString() : "-"}</td>
                <td className="px-6 py-4 text-slate-600">
                  {item.occupancy_rate ? `${item.occupancy_rate}%` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
