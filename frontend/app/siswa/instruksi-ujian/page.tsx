"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Info,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
            <GraduationCap className="text-zinc-800 w-7 h-7" />
          </div>
          <div className="text-center">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Instruksi Pengerjaan
            </h2>
            <p className="text-[13px] font-semibold text-zinc-600">
              SMA Negeri 1 Pekanbaru
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">

          {/* Judul */}
          <div className="p-5 border-b border-slate-50 bg-slate-50/30">
            <h1 className="text-[16px] font-bold text-zinc-900 leading-tight">
              Ujian Akhir Semester Genap — Matematika Peminatan
            </h1>

            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-600 border border-slate-200 shadow-sm">
                KELAS X IPA
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-600 border border-slate-200 shadow-sm">
                40 SOAL
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-zinc-600 border border-slate-200 shadow-sm">
                90 MENIT
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6">

            {/* Instructions */}
            <div className="space-y-3">
              <h2 className="text-[13px] font-bold text-zinc-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500" />
                Petunjuk
              </h2>

              <ul className="space-y-2">
                {instructions.map((inst, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[12px] text-slate-600"
                  >
                    <span className="min-w-[18px] h-[18px] bg-zinc-900 text-white text-[10px] rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            <div className="border border-red-100 bg-red-50/40 rounded-xl p-4 space-y-2">
              <h3 className="text-[12px] font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Larangan
              </h3>
              <ul className="text-[11px] text-red-700 space-y-1 list-disc pl-5">
                <li>Tab switching / minimize window</li>
                <li>Copy paste jawaban</li>
                <li>Menggunakan tools eksternal</li>
                <li>Login di device lain</li>
              </ul>
              <p className="text-[11px] text-red-700 font-medium">
                Pelanggaran dapat menyebabkan ujian dibatalkan.
              </p>
            </div>

            {/* Agreement */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-zinc-900 cursor-pointer"
                />
                <span className="text-[12px] text-slate-500">
                  Saya setuju dengan aturan ujian
                </span>
              </label>

              {/* Button */}
              <Link
                href="/siswa/ujian"
                className={`w-full h-11 bg-zinc-900 text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 transition ${
                  !agreed
                    ? "opacity-40 pointer-events-none"
                    : "hover:bg-zinc-800"
                }`}
              >
                Mulai Ujian
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-center text-[11px] text-red-500">
                Jangan keluar dari halaman selama ujian
              </p>
            </div>

          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400">
          Butuh bantuan?{" "}
          <a href="#" className="underline">
            Hubungi Pengawas
          </a>
        </p>
      </div>
    </div>
  );
}