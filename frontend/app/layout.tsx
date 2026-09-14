import type { Metadata } from "next";
import "./globals.css";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SovereigntyBanner from "@/components/layout/SovereigntyBanner";

export const metadata: Metadata = {
  title: "Sovereign AI Workbench",
  description: "Sovereign On-Premise Agentic AI Workbench",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#050912] text-slate-100 antialiased">
        <div className="flex min-h-screen bg-[#050912]">
          <Sidebar />

          <div className="flex min-w-0 flex-1 flex-col">
            <Header />

            <SovereigntyBanner />

            <main className="flex-1 px-4 py-6 md:px-7 md:py-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}