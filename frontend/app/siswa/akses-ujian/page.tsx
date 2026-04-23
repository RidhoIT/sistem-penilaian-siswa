"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Hash, User, ChevronDown, ArrowRight, ShieldCheck, HelpCircle, Key } from "lucide-react";

export default function AksesUjianPage() {
  const [tokenInput, setTokenInput] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[460px] flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border border-slate-300">
            <svg className="text-slate-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10h16M4 14h16M10 4v16"/>
            </svg>
          </div>
          <span className="text-[13px] font-medium text-slate-500 uppercase tracking-wider">SMA Negeri 1 Pekanbaru</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <h1 className="text-[18px] font-semibold text-zinc-900 leading-snug">
                Ujian Akhir Semester Genap — Matematika Peminatan
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">Matematika</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">Kelas X IPA</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">90 Menit</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[13px] font-medium text-emerald-700">Ujian Sedang Berlangsung</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-tighter">Waktu Tersisa</span>
                  <span className="text-[14px] font-mono font-medium text-zinc-900">01:23:45</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[65%] rounded-full transition-all duration-1000"></div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <svg className="text-sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                <span className="text-[13px]">12 April 2026, 08:00 – 10:00 WIB</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center px-6">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Identitas Peserta</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <form className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">NISN</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input type="text" maxLength={10} placeholder="10 digit NISN" className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input type="text" placeholder="Nama sesuai kartu pelajar" className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-900">Kelas</label>
              <div className="relative">
                <select className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-zinc-900/5">
                  <option value="" disabled selected>Pilih kelas...</option>
                  <option value="XIPA1">X IPA 1</option>
                  <option value="XIPA2">X IPA 2</option>
                  <option value="XIPA3">X IPA 3</option>
                  <option value="XIPS1">X IPS 1</option>
                  <option value="XIPS2">X IPS 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-900">Token Ujian</label>
                <div className="group relative cursor-help">
                  <HelpCircle className="text-slate-400 text-sm" />
                  <span className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    Token diberikan oleh pengawas atau guru Anda saat ujian dimulai.
                  </span>
                </div>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                <input type="text" placeholder="CONTOH: ABC123" className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-zinc-900/5" />
              </div>
            </div>

            <Link href="/siswa/instruksi-ujian" className="w-full h-12 bg-zinc-900 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
              Mulai Ujian Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-start gap-2 pt-2">
              <ShieldCheck className="text-slate-400 text-base mt-0.5 flex-shrink-0" />
              <p className="text-[12px] leading-snug text-slate-400">
                Data Anda aman dan hanya digunakan untuk keperluan verifikasi peserta ujian pada sistem ini.
              </p>
            </div>
          </form>
        </div>

        <p className="text-center text-[13px] text-slate-500">
          Butuh bantuan? <a href="#" className="text-zinc-900 font-medium hover:underline">Hubungi Panitia Ujian</a>
        </p>
      </div>
    </div>
  );
}