"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, UserPlus, User, Mail, Building2, Lock, Eye, EyeOff, Search, Check, X, CheckCircle2, ChevronDown } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["Matematika", "Fisika"]);
  const [showPopover, setShowPopover] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subjects = [
    { category: "Sains & Matematika", items: ["Matematika", "Fisika", "Kimia", "Biologi"] },
    { category: "Bahasa", items: ["Bahasa Indonesia", "Bahasa Inggris"] },
    { category: "IPS", items: ["Sejarah", "Geografi", "Ekonomi", "Sosiologi"] },
  ];

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle2 className="text-6xl" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Akun Berhasil Dibuat!</h2>
          <p className="text-slate-500 mb-10 leading-relaxed">
            Pendaftaran Anda telah kami terima. Silakan masuk menggunakan email dan kata sandi yang telah Anda daftarkan.
          </p>
          <Link
            href="/auth/login"
            className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            Masuk Sekarang
            <ArrowLeft className="rotate-180" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[480px] bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 pb-0">
          <Link href="/auth/login" className="inline-flex items-center text-xs text-slate-500 hover:text-zinc-900 transition-colors mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Login
          </Link>
          <div className="space-y-2">
            <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center mb-4">
              <UserPlus className="text-zinc-900 text-2xl" />
            </div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">Daftar sebagai Guru</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Buat akun untuk mulai membuat dan mengelola ujian digital sekolah Anda.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Langkah 1: Data Diri
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Dr. Budi Santosa, S.Pd"
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="email"
                    placeholder="budi@sekolah.sch.id"
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">
                  NIP <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="19850101..."
                    className="w-full h-10 pl-10 pr-4 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Langkah 2: Mata Pelajaran
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-900">Mata Pelajaran Diampu</label>
              <p className="text-[11px] text-slate-500 mb-2">Anda dapat memilih lebih dari satu mata pelajaran.</p>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPopover(!showPopover)}
                  className="w-full h-10 px-3 flex items-center justify-between rounded-md border border-slate-200 text-sm text-slate-500 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span>Pilih mata pelajaran...</span>
                  <ChevronDown className="text-slate-400 h-4 w-4" />
                </button>

                {showPopover && (
                  <div className="absolute z-20 top-full left-0 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl">
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Cari mata pelajaran..."
                          className="w-full h-8 pl-8 pr-2 text-xs bg-slate-50 rounded border-none focus:ring-0"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto p-1">
                      {subjects.map((group) => (
                        <div key={group.category}>
                          <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                            {group.category}
                          </p>
                          {group.items.map((subject) => (
                            <button
                              key={subject}
                              type="button"
                              onClick={() => toggleSubject(subject)}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 rounded flex items-center justify-between"
                            >
                              <span>{subject}</span>
                              {selectedSubjects.includes(subject) && (
                                <Check className="text-zinc-900 h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {selectedSubjects.map((subject) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-900 text-xs font-medium rounded-md border border-zinc-200"
                  >
                    {subject}
                    <button type="button" onClick={() => removeSubject(subject)} className="text-zinc-400 hover:text-zinc-900">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Langkah 3: Keamanan
              </span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password-field"
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-10 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-zinc-900"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">
                      Kekuatan Sandi: <span className="text-amber-500">Cukup</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: "60%" }} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                    <div className="flex items-center gap-2 text-[10px] text-zinc-900">
                      <CheckCircle2 className="text-emerald-500 h-3 w-3" />
                      Min 8 karakter
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-900">
                      <CheckCircle2 className="text-emerald-500 h-3 w-3" />
                      Huruf kapital
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Angka
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-300">
                      <CheckCircle2 className="h-3 w-3" />
                      Simbol
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-900">Konfirmasi Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-10 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full h-11 bg-zinc-900 text-white text-sm font-medium rounded-md hover:bg-zinc-800 transition-all shadow-sm active:scale-[0.98]"
            >
              Buat Akun Guru
            </button>
            <p className="text-center text-xs text-slate-500 mt-6">
              Sudah punya akun?
              <Link href="/auth/login" className="text-zinc-900 font-semibold hover:underline ml-1">
                Masuk Sekarang
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}