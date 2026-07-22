"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { UploadCloud, Loader2 } from "lucide-react";

interface FileUploaderProps {
  onExtractionSuccess: (data: any, fileName: string) => void;
}

export default function FileUploader({ onExtractionSuccess }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Пожалуйста, загрузите PDF файл.");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // 1. Уникальное имя файла
      const uniqueFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;

      // 2. Загрузка в Supabase (прямо из браузера)
      const { data, error: uploadError } = await supabase.storage
        .from("om_pdfs")
        .upload(uniqueFileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Ошибка загрузки: ${uploadError.message}`);
      }

      // 3. Получаем публичную ссылку на файл
      const { data: publicUrlData } = supabase.storage
        .from("om_pdfs")
        .getPublicUrl(uniqueFileName);

      const fileUrl = publicUrlData.publicUrl;

      // 4. Отправляем URL на наш Next.js Backend (который вызовет Gemini)
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, fileName: file.name }),
      });

      const responseData = await res.json();

      if (!res.ok || !responseData.success) {
        throw new Error(responseData.error || "Ошибка обработки файла нейросетью");
      }

      // 5. Передаем данные наверх в таблицу
      onExtractionSuccess(responseData.data, file.name);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Что-то пошло не так");
    } finally {
      setIsUploading(false);
      // Сбрасываем input, чтобы можно было загрузить тот же файл еще раз, если надо
      event.target.value = '';
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer bg-slate-50 border-slate-300 hover:bg-slate-100 transition-all ${
          isUploading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isUploading ? (
            <Loader2 className="w-10 h-10 mb-3 text-blue-500 animate-spin" />
          ) : (
            <UploadCloud className="w-10 h-10 mb-3 text-slate-400" />
          )}
          <p className="mb-2 text-sm text-slate-500 font-semibold">
            {isUploading ? (
              "Идет загрузка и анализ (до 20 сек)..."
            ) : (
              <>Нажмите или перетащите PDF</>
            )}
          </p>
          <p className="text-xs text-slate-400">
            Презентации, флаеры, тизеры (PDF)
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </label>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
