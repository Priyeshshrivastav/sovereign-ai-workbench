import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SovereigntyBanner from "./SovereigntyBanner";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050912] text-slate-100">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <SovereigntyBanner />

        <main className="flex-1 px-4 py-6 md:px-7 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}