// D:\Project\sistem-penilaian-siswa\frontend\components\Header.tsx
"use client";

import React from "react";
import { Bell, Menu, Download, Printer, ChevronRight } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  title: string;
  showHamburger?: boolean;
  onHamburgerClick?: () => void;
  breadcrumb?: React.ReactNode;
  showLaporanActions?: boolean;
}

export default function Header({ title, showHamburger, onHamburgerClick, breadcrumb, showLaporanActions }: HeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-5 md:px-8">
      <div className="flex items-center gap-3 min-w-0">
        {showHamburger && (
          <button
            onClick={onHamburgerClick}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500 flex-shrink-0"
          >
            <Menu className="text-xl" />
          </button>
        )}
        {breadcrumb ? (
          <nav className="flex items-center gap-1.5 text-[13px] font-medium min-w-0 overflow-hidden">
            {breadcrumb}
          </nav>
        ) : (
          <nav className="flex items-center gap-1.5 text-[13px] font-medium min-w-0">
            {title.split(" > ").length > 1 ? (
              <>
                <span className="text-slate-400">{title.split(" > ")[0]}</span>
                <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0" />
                <span className="text-zinc-900 font-semibold">{title.split(" > ")[1]}</span>
              </>
            ) : (
              <span className="text-zinc-900 font-semibold">{title}</span>
            )}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {showLaporanActions && (
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
              <Download className="text-[15px]" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button className="h-9 px-3 border border-slate-200 rounded-lg text-[12px] font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors">
              <Printer className="text-[15px]" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        )}
        {/* <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="text-xl text-slate-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-zinc-900 rounded-full border-2 border-white" />
        </button>
        <Image
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Budi"
          alt="avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
        /> */}
      </div>
    </header>
  );
}