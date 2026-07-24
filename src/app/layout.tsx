import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "CRE Matrix | AI Assistant for Commercial Real Estate",
  description: "Automate Commercial Real Estate underwriting. Extract NOI, Cap Rates, and Tenant Data from Offering Memorandums and flyers in seconds using AI.",
  keywords: ["Commercial Real Estate", "AI Underwriting", "CRE tech", "NOI extraction", "Offering Memorandum analyzer"],
  openGraph: {
    title: "CRE Matrix | AI Assistant",
    description: "Automate Commercial Real Estate underwriting with AI. Stop manual data entry.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen`}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
