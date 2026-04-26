"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Hash,
  User,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Key,
  GraduationCap,
} from "lucide-react";

export default function AksesUjianPage() {
  const [form, setForm] = useState({
    nisn: "",
    name: "",
    kelas: "",
    token: "",
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <GraduationCap className="text-zinc-800 w-7 h-7" />
          </div>
          <div className="text-center">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Sistem Penilaian Digital
            </h2>
            <p className="text-[13px] font-semibold text-zinc-600">
              SMA Negeri 1 Pekanbaru
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* Info Ujian (DISPLAY ONLY) */}
          <div className="p-5 border-b border-slate-50 bg-slate-50/30">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  Ujian Aktif
                </span>
              </div>

              <h1 className="text-[16px] font-bold text-zinc-900 leading-tight">
                Ujian Akhir Semester Genap — Matematika Peminatan
              </h1>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-600 border border-slate-200 shadow-sm">
                  KELAS X IPA
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-600 border border-slate-200 shadow-sm">
                  90 MENIT
                </span>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form className="p-5 space-y-4">

            {/* NISN */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-zinc-700">
                NISN
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="nisn"
                  value={form.nisn}
                  onChange={handleChange}
                  type="text"
                  maxLength={10}
                  placeholder="10 Digit"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
                />
              </div>
            </div>

            {/* Nama */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-zinc-700">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
                />
              </div>
            </div>

            {/* Kelas */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-zinc-700">
                Kelas
              </label>
              <div className="relative">
                <select
                  name="kelas"
                  value={form.kelas}
                  onChange={handleChange}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[13px] bg-white appearance-none focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5 cursor-pointer"
                >
                  <option value="">Pilih...</option>
                  <option value="XIPA1">X IPA 1</option>
                  <option value="XIPA2">X IPA 2</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Token */}
            <div className="pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[12px] font-bold text-zinc-700">
                    Token Akses
                  </label>
                  <div className="group relative">
                    <HelpCircle className="text-slate-400 w-3.5 h-3.5 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-40 p-2 bg-zinc-900 text-white text-[9px] rounded-md opacity-0 group-hover:opacity-100 transition-all">
                      Mintalah token ke pengawas.
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    name="token"
                    value={form.token}
                    onChange={handleChange}
                    type="text"
                    placeholder="XXXXXX"
                    className="w-full h-10 pl-9 pr-4 rounded-lg border border-zinc-200 bg-slate-50 text-[13px] font-mono uppercase tracking-[0.3em] focus:outline-none focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/5"
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <Link
              href="/siswa/instruksi-ujian"
              className="w-full h-11 bg-zinc-900 text-white text-[13px] font-bold rounded-xl hover:bg-zinc-800 flex items-center justify-center gap-2 mt-2"
            >
              Mulai Ujian
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Info */}
            <div className="flex gap-2 pt-2 border-t border-slate-50">
              <ShieldCheck className="text-slate-400 w-4 h-4" />
              <p className="text-[11px] text-slate-400">
                Sistem mendeteksi tab switching & screenshot.
              </p>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}