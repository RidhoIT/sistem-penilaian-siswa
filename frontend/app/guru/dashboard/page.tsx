"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BookOpen,
  ClipboardList,
  Users,
  TrendingUp,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  isLive?: boolean;
}

function StatCard({ icon, value, label, badge, isLive }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start mb-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">{icon}</div>
        {badge && <span className="badge badge-green">{badge}</span>}
        {isLive && (
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-600">Live</span>
          </div>
        )}
      </div>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-[13px] text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

export default function GuruDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const matpelData = {
    total: 5,
    breakdown: [
      { label: "Ujian", count: 12, color: "badge-blue" },
      { label: "Latihan", count: 34, color: "badge-green" },
      { label: "Ulangan", count: 18, color: "badge-slate" },
      { label: "Kuis", count: 27, color: "badge-slate" },
    ],
  };

  const examData = [
    { name: "UAS Matematika Peminatan", kelas: "X IPA", peserta: "23/35", status: "BERLANGSUNG", statusBadge: "badge-blue" },
    { name: "UH Trigonometri", kelas: "XI IPA", peserta: "-", status: "AKTIF", statusBadge: "badge-green" },
    { name: "Quiz Fungsi Komposisi", kelas: "X IPA", peserta: "32/32", status: "SELESAI", statusBadge: "badge-slate" },
  ];

  const activities = [
    { text: "Soal baru:", highlight: "'Integral Substitusi'", time: "5 menit lalu", color: "bg-zinc-900 ring-zinc-200" },
    { text: "Ujian", highlight: "'UAS Matematika'", suffix: " diaktifkan", time: "1 jam lalu", color: "bg-blue-500 ring-blue-200" },
    { text: "", highlight: "3 siswa", suffix: " mengerjakan 'UH Trigonometri'", time: "2 jam lalu", color: "bg-slate-400 ring-slate-200" },
    { text: "Kisi-kisi", highlight: "'UAS Genap 2026'", suffix: " dibuat", time: "3 hari lalu", color: "bg-zinc-900 ring-zinc-200" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}>
        <Sidebar role="guru" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Dashboard" showHamburger onHamburgerClick={() => setSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10 space-y-8 fade-up">
            {/* Welcome Banner */}
            <div className="bg-zinc-900 rounded-2xl p-7 md:p-8 relative overflow-hidden fade-up">
              <div className="relative z-10 space-y-2">
                <p className="text-zinc-400 text-[12px] font-semibold uppercase tracking-widest">Selamat Pagi</p>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Budi Santosa 👋</h1>
                <p className="text-zinc-400 text-sm">Rabu, 22 April 2026</p>
                <div className="pt-3">
                  <Link href="/guru/mata-pelajaran" className="inline-flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-sm">
                    Kelola Mata Pelajaran
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-zinc-800/50 rounded-full blur-3xl" />
              <div className="absolute right-12 top-4 w-24 h-24 bg-zinc-700/30 rounded-full blur-xl" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up-1">
              <StatCard icon={<BookOpen className="text-zinc-600 text-lg" />} value={142} label="Total Soal" badge="+8 bulan ini" />
              <StatCard icon={<ClipboardList className="text-zinc-600 text-lg" />} value={3} label="Ujian Aktif" isLive />
              <StatCard icon={<Users className="text-zinc-600 text-lg" />} value={87} label="Total Peserta" />
              <StatCard icon={<TrendingUp className="text-zinc-600 text-lg" />} value={78.5} label="Rata-rata Nilai" />
            </div>

            {/* Mata Pelajaran Card */}
          
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-up-2">
              {/* Exam Table */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-zinc-900">Ujian Berlangsung & Mendatang</h2>
                  <button className="text-[13px] text-slate-400 hover:text-zinc-900 font-medium transition-colors">Lihat Semua →</button>
                </div>
                <div className="content-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead className="border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Ujian</th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Kelas</th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Peserta</th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                          <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {examData.map((exam, i) => (
                          <tr key={i}>
                            <td className="px-5 py-3.5 font-medium text-zinc-900">{exam.name}</td>
                            <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{exam.kelas}</td>
                            <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{exam.peserta}</td>
                            <td className="px-5 py-3.5">
                              <span className={`badge ${exam.statusBadge}`}>
                                {exam.status === "BERLANGSUNG" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                                {exam.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button className={`h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors ${exam.status === "DRAFT" ? "text-slate-400" : ""}`}>
                                {exam.status === "SELESAI" ? "Laporan" : exam.status === "DRAFT" ? "Edit" : "Detail"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-4">
                <h2 className="text-base font-bold text-zinc-900">Aktivitas Terbaru</h2>
                <div className="content-card p-5">
                  <div className="relative space-y-5 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-slate-100">
                    {activities.map((activity, i) => (
                      <div key={i} className="relative flex items-start pl-8">
                        <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white ${activity.color}`} />
                        <div>
                          <p className="text-[13px] text-zinc-700">
                            {activity.text && <span>{activity.text} </span>}
                            <span className="font-semibold text-zinc-900">{activity.highlight}</span>
                            {activity.suffix}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}