"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Info, AlertTriangle, ArrowRight } from "lucide-react";

export default function InstruksiUjianPage() {
  const [agreed, setAgreed] = useState(false);

  const instructions = [
    "Bacalah setiap soal dengan seksama sebelum menjawab.",
    "Pilih jawaban yang paling tepat dan klik untuk memilih.",
    "Anda dapat mengubah jawaban kapan saja sebelum waktu ujian habis.",
    "Perhatikan batas waktu pengerjaan ujian (90 menit).",
    "Sistem akan otomatis menyimpan jawaban Anda setiap kali memilih opsi.",
    "Pastikan koneksi internet Anda stabil selama pengerjaan ujian.",
    "Jangan membuka tab atau aplikasi lain selama ujian berlangsung.",
    "Setelah waktu habis, sistem akan otomatis mengirim jawaban Anda.",
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-[680px] space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-10 border-b border-slate-100 bg-slate-50/30">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <GraduationCap className="text-white text-2xl" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instruksi Pengerjaan</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight leading-tight">
                Ujian Akhir Semester Genap — Matematika Peminatan
              </h1>

              <div className="flex flex-wrap gap-2 pt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  Kelas X IPA
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  40 Soal
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  90 Menit
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Status: Berlangsung
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Info className="text-zinc-500 text-lg" />
                Petunjuk Pengerjaan Ujian
              </h2>
              <ul className="space-y-3">
                {instructions.map((inst, i) => (
                  <li key={i} className="relative pl-8 text-[13px] text-slate-600 leading-relaxed">
                    <span className="absolute left-0 top-0 w-5 h-5 bg-zinc-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    {inst}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-red-50/50 border border-red-100 rounded-xl p-6 space-y-3">
              <h3 className="text-[13px] font-semibold text-red-900 flex items-center gap-2">
                <AlertTriangle className="text-red-600" />
                Peringatan: Larangan Kecurangan & Plagiarism
              </h3>
              <div className="text-[12px] text-red-800/80 leading-relaxed space-y-2">
                <p>Pengerjaan ujian ini diawasi oleh sistem monitoring otomatis. Sistem kami dapat mendeteksi:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tab switching atau minimize window (akan dihitung sebagai pelanggaran)</li>
                  <li>Copy-paste konten soal atau jawaban</li>
                  <li>Penggunaan tools eksternal (kalkulator, search engine, ChatGPT, dll)</li>
                  <li>Akses ke browser history atau bookmark</li>
                  <li>Multiple submissions atau login dari device berbeda</li>
                </ul>
                <p className="font-medium pt-1">
                  Setiap pelanggaran akan dicatat dan dapat mengakibatkan nilai ujian dibatalkan atau tindakan disiplin lebih lanjut sesuai kebijakan sekolah.
                </p>
              </div>
            </div>

            <div className="pt-4 space-y-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center mt-0.5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="peer h-5 w-5 appearance-none rounded border border-slate-300 bg-white checked:bg-zinc-900 checked:border-zinc-900 transition-all cursor-pointer"
                  />
                  <svg className="absolute text-white text-sm opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="text-[12px] text-slate-500 group-hover:text-zinc-900 transition-colors select-none">
                  Saya memahami dan setuju dengan petunjuk dan aturan di atas
                </span>
              </label>

              <div className="space-y-3">
                <Link
                  href="/siswa/ujian"
                  className={`w-full h-12 bg-zinc-900 text-white font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-300 hover:bg-zinc-800 ${
                    !agreed ? "opacity-40 pointer-events-none" : ""
                  }`}
                >
                  Mulai Ujian Sekarang
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-[11px] text-red-500 font-medium">
                  Harap tutup semua aplikasi lain sebelum memulai. Jangan minimize atau ganti tab selama ujian berlangsung.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 font-medium">
          Masalah teknis? <a href="#" className="text-slate-600 hover:text-zinc-900 underline underline-offset-4">Hubungi Pengawas Ujian</a>
        </p>
      </div>
    </div>
  );
}