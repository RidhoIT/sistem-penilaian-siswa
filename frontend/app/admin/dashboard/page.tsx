"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BookOpen,
  ClipboardList,
  Users,
  TrendingUp,
  ArrowRight,
  Bell,
  ChevronRight,
  PlusCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const COLORS = {
  zinc: { bg: "#f4f4f5", icon: "#18181b", dot: "#52525b" },
  blue: { bg: "#eff6ff", icon: "#2563eb", dot: "#3b82f6" },
};

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  badgeColor?: string;
}

function StatCard({ icon, value, label, badge, badgeColor }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-[14px] p-[22px_24px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)] hover:translate-y-[-1px] transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">{icon}</div>
        {badge && (
          <span className={`badge ${badgeColor || "badge-green"}`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-[13px] text-slate-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

const SUBJECTS = [
  { id: 1, name: "Matematika", kelas: "XII IPA", soal: 48, color: "zinc" },
  { id: 2, name: "Matematika", kelas: "XI IPA", soal: 32, color: "blue" },
  { id: 3, name: "Kimia", kelas: "XII IPS", soal: 20, color: "emerald" },
  { id: 4, name: "Fisika", kelas: "XI IPA", soal: 15, color: "violet" },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const examData = [
    { name: "UAS Matematika Peminatan", kelas: "X IPA", peserta: "23/35", status: "BERLANGSUNG", statusBadge: "badge-blue" },
    { name: "UH Trigonometri", kelas: "XI IPA", peserta: "-", status: "AKTIF", statusBadge: "badge-green" },
    { name: "Remedial Limit", kelas: "XII IPA", peserta: "0/12", status: "DRAFT", statusBadge: "badge-amber" },
    { name: "Quiz Fungsi Komposisi", kelas: "X IPA", peserta: "32/32", status: "SELESAI", statusBadge: "badge-slate" },
  ];

  const activities = [
    { text: "Soal baru: 'Integral Substitusi'", time: "5 menit lalu", color: "bg-zinc-900" },
    { text: "Ujian 'UAS Matematika' diaktifkan", time: "1 jam lalu", color: "bg-blue-500" },
    { text: "3 siswa mengerjakan 'UH Trigonometri'", time: "2 jam lalu", color: "bg-slate-400" },
    { text: "Kisi-kisi 'UAS Genap 2026' dibuat", time: "3 hari lalu", color: "bg-zinc-900" },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 ml-[248px]">
        <Header title="Dashboard" />
        
        <div className="p-6 md:p-10 space-y-8">
          {/* Welcome Banner */}
          <div className="bg-zinc-900 rounded-2xl p-7 md:p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <p className="text-zinc-400 text-[12px] font-semibold uppercase tracking-widest">Selamat Pagi</p>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Budi Santosa 👋</h1>
              <p className="text-zinc-400 text-sm">Rabu, 22 April 2026</p>
              <div className="pt-3">
                <button className="inline-flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-sm">
                  Kelola Mata Pelajaran
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-zinc-800/50 rounded-full blur-[100px]" />
            <div className="absolute right-12 top-4 w-24 h-24 bg-zinc-700/30 rounded-full blur-[60px]" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<BookOpen className="text-zinc-600 text-lg" />} value={142} label="Total Soal" badge="+8 bulan ini" badgeColor="badge-green" />
            <StatCard icon={<ClipboardList className="text-zinc-600 text-lg" />} value={3} label="Ujian Aktif" badge="Live" badgeColor="badge-blue" />
            <StatCard icon={<Users className="text-zinc-600 text-lg" />} value={87} label="Total Peserta" />
            <StatCard icon={<TrendingUp className="text-zinc-600 text-lg" />} value={78.5} label="Rata-rata Nilai" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exam Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900">Ujian Berlangsung & Mendatang</h2>
                <button className="text-[13px] text-slate-400 hover:text-zinc-900 font-medium transition-colors">
                  Lihat Semua →
                </button>
              </div>
              <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
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
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 font-medium text-zinc-900">{exam.name}</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{exam.kelas}</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">{exam.peserta}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                              exam.status === "BERLANGSUNG" ? "bg-blue-50 text-blue-600 border border-blue-200" :
                              exam.status === "AKTIF" ? "bg-emerald-50 text-emerald-600 border border-emerald-200" :
                              exam.status === "DRAFT" ? "bg-amber-50 text-amber-600 border border-amber-200" :
                              "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {exam.status === "BERLANGSUNG" && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                              {exam.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                              {exam.status === "SELESAI" ? "Laporan" : "Detail"}
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
              <div className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="relative space-y-5 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-slate-100">
                  {activities.map((activity, i) => (
                    <div key={i} className="relative flex items-start pl-8">
                      <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white ${activity.color} ring-1 ring-slate-200`} />
                      <div>
                        <p className="text-[13px] text-zinc-700">
                          {activity.text.split(":")[0]}
                          <span className="font-semibold text-zinc-900">{activity.text.split(":")[1]}</span>
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
  );
}