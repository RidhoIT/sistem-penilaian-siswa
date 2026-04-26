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
  UserPlus,
  CheckCircle,
  XCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  badge?: string;
  isLive?: boolean;
}

interface ExamRow {
  name: string;
  namaSekolah: string;
  namaGuru: string;
  kelas: string;
  peserta: string;
  status: "BERLANGSUNG" | "AKTIF" | "SELESAI" | "DRAFT";
  statusBadge: string;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GURU";
  nip?: string;
  namaSekolah?: string;
  isActive: boolean;
  avatarInitials: string;
  avatarColor: string;
  createdAt: string;
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ icon, value, label, badge, isLive }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex justify-between items-start mb-3">
        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
          {icon}
        </div>
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

// ─── Static Data ──────────────────────────────────────────────────────────────

const examData: ExamRow[] = [
  {
    name: "UAS Matematika Peminatan",
    namaSekolah: "SMA Negeri 1 Jakarta",
    namaGuru: "Budi Santosa",
    kelas: "X IPA",
    peserta: "23/35",
    status: "BERLANGSUNG",
    statusBadge: "badge-blue",
  },
  {
    name: "UH Trigonometri",
    namaSekolah: "SMA Negeri 2 Bandung",
    namaGuru: "Sari Indrawati",
    kelas: "XI IPA",
    peserta: "-",
    status: "AKTIF",
    statusBadge: "badge-green",
  },
  {
    name: "Quiz Fungsi Komposisi",
    namaSekolah: "SMA Negeri 3 Surabaya",
    namaGuru: "Andi Prasetyo",
    kelas: "X IPA",
    peserta: "32/32",
    status: "SELESAI",
    statusBadge: "badge-slate",
  },
];

const activities = [
  {
    text: "Soal baru:",
    highlight: "'Integral Substitusi'",
    time: "5 menit lalu",
    color: "bg-zinc-900 ring-zinc-200",
  },
  {
    text: "Ujian",
    highlight: "'UAS Matematika'",
    suffix: " diaktifkan",
    time: "1 jam lalu",
    color: "bg-blue-500 ring-blue-200",
  },
  {
    text: "",
    highlight: "3 siswa",
    suffix: " mengerjakan 'UH Trigonometri'",
    time: "2 jam lalu",
    color: "bg-slate-400 ring-slate-200",
  },
  {
    text: "Kisi-kisi",
    highlight: "'UAS Genap 2026'",
    suffix: " dibuat",
    time: "3 hari lalu",
    color: "bg-zinc-900 ring-zinc-200",
  },
];

// 5 user baru (static) — sesuai model User di schema Prisma
const recentUsers: UserRow[] = [
  {
    id: "usr-001",
    name: "Sari Rahayu",
    email: "sari.rahayu@smandua.sch.id",
    role: "GURU",
    nip: "198703152010012005",
    namaSekolah: "SMA Negeri 2 Bandung",
    isActive: true,
    avatarInitials: "SR",
    avatarColor: "#6366f1",
    createdAt: "21 Apr 2026",
  },
  {
    id: "usr-002",
    name: "Andi Prasetyo",
    email: "andi.prasetyo@smantiga.sch.id",
    role: "GURU",
    nip: "199001202015011003",
    namaSekolah: "SMA Negeri 3 Surabaya",
    isActive: true,
    avatarInitials: "AP",
    avatarColor: "#f59e0b",
    createdAt: "20 Apr 2026",
  },
  {
    id: "usr-003",
    name: "Dewi Wulandari",
    email: "dewi.w@smansatu.sch.id",
    role: "GURU",
    nip: "198812052012012009",
    namaSekolah: "SMA Negeri 1 Jakarta",
    isActive: true,
    avatarInitials: "DW",
    avatarColor: "#10b981",
    createdAt: "19 Apr 2026",
  },
  {
    id: "usr-004",
    name: "Rizal Hakim",
    email: "rizal.hakim@admin.edu.id",
    role: "ADMIN",
    namaSekolah: "Dinas Pendidikan DKI",
    isActive: false,
    avatarInitials: "RH",
    avatarColor: "#ef4444",
    createdAt: "18 Apr 2026",
  },
  {
    id: "usr-005",
    name: "Nurul Pratiwi",
    email: "nurul.p@smanempat.sch.id",
    role: "GURU",
    nip: "199205182018012002",
    namaSekolah: "SMA Negeri 4 Medan",
    isActive: true,
    avatarInitials: "NP",
    avatarColor: "#8b5cf6",
    createdAt: "17 Apr 2026",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}
      >
        <Sidebar role="admin" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard"
          showHamburger
          onHamburgerClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-10 space-y-8 fade-up">

            {/* ── Welcome Banner ─────────────────────────────── */}
            <div className="bg-zinc-900 rounded-2xl p-7 md:p-8 relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <p className="text-zinc-400 text-[12px] font-semibold uppercase tracking-widest">
                  Selamat Pagi
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  Budi Santosa 👋
                </h1>
                <p className="text-zinc-400 text-sm">Rabu, 22 April 2026</p>
                <div className="pt-3">
                  <Link
                    href="/admin/mata-pelajaran"
                    className="inline-flex items-center gap-2 bg-white text-zinc-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-colors shadow-sm"
                  >
                    Kelola Mata Pelajaran
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-56 h-56 bg-zinc-800/50 rounded-full blur-3xl" />
              <div className="absolute right-12 top-4 w-24 h-24 bg-zinc-700/30 rounded-full blur-xl" />
            </div>

            {/* ── Stats ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 fade-up-1">
              <StatCard
                icon={<BookOpen className="text-zinc-600 text-lg" />}
                value={142}
                label="Total Soal"
                badge="+8 bulan ini"
              />
              <StatCard
                icon={<ClipboardList className="text-zinc-600 text-lg" />}
                value={3}
                label="Ujian Aktif"
                isLive
              />
              <StatCard
                icon={<Users className="text-zinc-600 text-lg" />}
                value={33}
                label="Total Guru"
              />
              <StatCard
                icon={<TrendingUp className="text-zinc-600 text-lg" />}
                value={78.5}
                label="Rata-rata Nilai"
              />
            </div>

            {/* ── Exam Table + Activity ───────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-up-2">

              {/* Exam Table — dengan kolom Nama Sekolah & Nama Guru */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-zinc-900">
                    Ujian Berlangsung & Mendatang
                  </h2>
                  <button className="text-[13px] text-slate-400 hover:text-zinc-900 font-medium transition-colors">
                    Lihat Semua →
                  </button>
                </div>
                <div className="content-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead className="border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Nama Ujian
                          </th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                            Nama Sekolah
                          </th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                            Nama Guru
                          </th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">
                            Kelas
                          </th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                            Peserta
                          </th>
                          <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Status
                          </th>
                          <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {examData.map((exam, i) => (
                          <tr key={i}>
                            <td className="px-5 py-3.5 font-medium text-zinc-900">
                              {exam.name}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">
                              {exam.namaSekolah}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                              {exam.namaGuru}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                              {exam.kelas}
                            </td>
                            <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">
                              {exam.peserta}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`badge ${exam.statusBadge}`}>
                                {exam.status === "BERLANGSUNG" && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                )}
                                {exam.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                                {exam.status === "SELESAI"
                                  ? "Laporan"
                                  : exam.status === "DRAFT"
                                  ? "Edit"
                                  : "Detail"}
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
                <h2 className="text-base font-bold text-zinc-900">
                  Aktivitas Terbaru
                </h2>
                <div className="content-card p-5">
                  <div className="relative space-y-5 before:absolute before:left-2 before:top-0 before:h-full before:w-0.5 before:bg-slate-100">
                    {activities.map((activity, i) => (
                      <div key={i} className="relative flex items-start pl-8">
                        <div
                          className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-4 border-white ${activity.color}`}
                        />
                        <div>
                          <p className="text-[13px] text-zinc-700">
                            {activity.text && <span>{activity.text} </span>}
                            <span className="font-semibold text-zinc-900">
                              {activity.highlight}
                            </span>
                            {activity.suffix}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pengguna Terbaru ────────────────────────────── */}
            <div className="space-y-4 fade-up-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-zinc-900">
                  Pengguna Terbaru
                </h2>
                <Link
                  href="/admin/pengguna"
                  className="text-[13px] text-slate-400 hover:text-zinc-900 font-medium transition-colors"
                >
                  Kelola Semua →
                </Link>
              </div>
              <div className="content-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm data-table">
                    <thead className="border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Pengguna
                        </th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">
                          NIP
                        </th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
                          Nama Sekolah
                        </th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Role
                        </th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Status
                        </th>
                        <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">
                          Bergabung
                        </th>
                        <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          {/* Nama + Email */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                                style={{ backgroundColor: user.avatarColor }}
                              >
                                {user.avatarInitials}
                              </div>
                              <div>
                                <p className="font-semibold text-zinc-900 text-[13px]">
                                  {user.name}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* NIP */}
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell text-[12px]">
                            {user.nip ?? "—"}
                          </td>
                          {/* Nama Sekolah */}
                          <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell text-[12px]">
                            {user.namaSekolah ?? "—"}
                          </td>
                          {/* Role */}
                          <td className="px-5 py-3.5">
                            <span
                              className={`badge ${
                                user.role === "ADMIN"
                                  ? "bg-zinc-900 text-white"
                                  : "badge-slate"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-3.5">
                            {user.isActive ? (
                              <span className="badge badge-green flex items-center gap-1 w-fit">
                                <CheckCircle className="w-3 h-3" />
                                Aktif
                              </span>
                            ) : (
                              <span className="badge badge-slate flex items-center gap-1 w-fit">
                                <XCircle className="w-3 h-3" />
                                Nonaktif
                              </span>
                            )}
                          </td>
                          {/* Tanggal */}
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell text-[12px]">
                            {user.createdAt}
                          </td>
                          {/* Aksi */}
                          <td className="px-5 py-3.5 text-right">
                            <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                              Detail
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}