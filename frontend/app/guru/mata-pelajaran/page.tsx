// D:\Project\sistem-penilaian-siswa\frontend\app\guru\mata-pelajaran\page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  Dumbbell,
  Zap,
  Plus,
  Calculator,
  FileText,
  Search,
  BarChart2,
  CheckCircle,
  TrendingUp,
  Users,
  Download,
  Printer,
  X,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Book,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const COLORS = {
  zinc:    { bg: "#f4f4f5", icon: "#18181b", dot: "#52525b", hex: "#18181b" },
  blue:    { bg: "#eff6ff", icon: "#2563eb", dot: "#3b82f6", hex: "#3b82f6" },
  violet:  { bg: "#f5f3ff", icon: "#7c3aed", dot: "#8b5cf6", hex: "#8b5cf6" },
  emerald: { bg: "#ecfdf5", icon: "#059669", dot: "#10b981", hex: "#10b981" },
  amber:   { bg: "#fffbeb", icon: "#d97706", dot: "#f59e0b", hex: "#f59e0b" },
  red:     { bg: "#fef2f2", icon: "#dc2626", dot: "#ef4444", hex: "#ef4444" },
  cyan:    { bg: "#ecfeff", icon: "#0891b2", dot: "#06b6d4", hex: "#06b6d4" },
  pink:    { bg: "#fdf2f8", icon: "#be185d", dot: "#ec4899", hex: "#ec4899" },
};

interface Subject {
  id: number;
  name: string;
  kelas: string;
  soal: number;
  ujian: number;
  color: string;
  desc: string;
}

const TAB_LABELS: Record<string, string> = {
  ujian: "Ujian",
  ulangan: "Ulangan",
  latihan: "Latihan",
  kuis: "Kuis",
  soal: "Bank Soal",
  nilai: "Nilai Akhir",
};

const KKM_DEFAULT = 70;

function generateSiswaData(examName: string, totalSoal: number, kelas: string) {
  const namaList = [
    "Adi Nugroho","Bella Rahmawati","Candra Wijaya","Dewi Anggraeni","Eko Prasetyo",
    "Fitri Handayani","Gilang Ramadhan","Hana Safitri","Ivan Santoso","Julia Maharani",
    "Kevin Pratama","Laila Nurfadillah","Mario Situmorang","Nadia Kusuma","Oka Widyatma",
    "Putri Wulandari","Rizki Maulana","Sari Dewi","Taufik Hidayat","Ulfa Ramadhani",
    "Vino Adiputra","Winda Lestari","Xena Anggraita","Yoga Permana","Zahra Meilinda",
    "Ahmad Fauzi","Bagas Saputra","Clara Oktaviani","Dino Setiawan","Elsa Nurhayati",
    "Fajar Kurniawan","Gita Puspita",
  ];
  const violCatatan = [
    ["Buka tab lain 1x"],
    ["Copy-paste terdeteksi 1x", "Buka tab lain 1x"],
    ["Keluar fullscreen 2x", "Screenshot terdeteksi 1x"],
    ["Buka tab lain 2x"],
    ["Screenshot terdeteksi 1x"],
    ["Keluar fullscreen 1x"],
    ["Buka tab lain 3x", "Copy-paste 2x"],
    ["Buka tab lain 1x", "Screenshot 1x"],
    ["Copy-paste terdeteksi 1x"],
  ];
  let seed = examName.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  function rand(min: number, max: number) {
    seed = (seed * 9301 + 49297) % 233280;
    return min + Math.floor((seed / 233280) * (max - min + 1));
  }
  return namaList.map((nama, i) => {
    const benar = rand(Math.floor(totalSoal * 0.4), totalSoal);
    const salah = totalSoal - benar;
    const nilai = Math.round((benar / totalSoal) * 100);
    const pelanggaran = rand(0, 9) >= 7 ? rand(1, 5) : 0;
    return {
      nisn: `00512340${String(i + 1).padStart(3, "0")}`,
      nama,
      kelas,
      benar,
      salah,
      nilai,
      lulus: nilai >= KKM_DEFAULT,
      pelanggaran,
      catatan: pelanggaran > 0 ? violCatatan[rand(0, violCatatan.length - 1)] : [],
    };
  });
}

export default function GuruMataPelajaran() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Matematika Peminatan", kelas: "XII IPA 1", soal: 48, ujian: 2, color: "zinc", desc: "Materi kalkulus, fungsi, dan limit" },
    { id: 2, name: "Matematika Wajib", kelas: "XI IPA 2", soal: 32, ujian: 1, color: "blue", desc: "Trigonometri dan fungsi komposisi" },
    { id: 3, name: "Kimia", kelas: "XII IPS 1", soal: 20, ujian: 0, color: "emerald", desc: "Kimia organik dan reaksi dasar" },
    { id: 4, name: "Fisika", kelas: "XI IPA 1", soal: 15, ujian: 1, color: "violet", desc: "Dinamika dan kinematika" },
    { id: 5, name: "Biologi", kelas: "X IPA 1", soal: 10, ujian: 0, color: "amber", desc: "Sel dan jaringan tumbuhan" },
  ]);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState("ujian");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("zinc");
  const [newName, setNewName] = useState("");
  const [newKelas, setNewKelas] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Nilai Akhir state
  const [bobotUjian, setBobotUjian] = useState(40);
  const [bobotUlangan, setBobotUlangan] = useState(25);
  const [bobotLatihan, setBobotLatihan] = useState(20);
  const [bobotKuis, setBobotKuis] = useState(15);
  const [kkm, setKkm] = useState(70);
  const [subBobotUjian1, setSubBobotUjian1] = useState(50);
  const [subBobotUjian2, setSubBobotUjian2] = useState(50);
  const [showNilaiHasil, setShowNilaiHasil] = useState(false);
  const [nilaiFilter, setNilaiFilter] = useState("all");
  const [nilaiSortKey, setNilaiSortKey] = useState("akhir");
  const [nilaiSortAsc, setNilaiSortAsc] = useState(false);

  // Laporan state
  const [laporanData, setLaporanData] = useState<ReturnType<typeof generateSiswaData>>([]);
  const [laporanExamInfo, setLaporanExamInfo] = useState({ nama: "", tanggal: "", durasi: "", totalSoal: 40 });
  const [laporanFilter, setLaporanFilter] = useState("all");
  const [laporanSortKey, setLaporanSortKey] = useState("nilai");
  const [laporanSortDir, setLaporanSortDir] = useState<"asc" | "desc">("desc");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ReturnType<typeof generateSiswaData>[0] | null>(null);
  const [showLaporanPage, setShowLaporanPage] = useState(false);

  // Nilai Akhir data
  const [nilaiData, setNilaiData] = useState<Array<{
    nisn: string; nama: string; kelas: string;
    ujian: number; ulangan: number; latihan: number; kuis: number;
    akhir: number; lulus: boolean; grade: string;
  }>>([]);

  const bobotTotal = bobotUjian + bobotUlangan + bobotLatihan + bobotKuis;
  const isBobotValid = bobotTotal === 100;
  const subUjianTotal = subBobotUjian1 + subBobotUjian2;

  const filteredSubjects = subjects.filter(
    (s) => currentFilter === "all" || s.kelas.includes(currentFilter)
  );

  const totalSoal = subjects.reduce((s, x) => s + x.soal, 0);
  const totalUjian = subjects.reduce((s, x) => s + x.ujian, 0);

  function hitungNilaiAkhir() {
    const bU = bobotUjian / 100;
    const bUl = bobotUlangan / 100;
    const bL = bobotLatihan / 100;
    const bK = bobotKuis / 100;
    const namaList = [
      "Adi Nugroho","Bella Rahmawati","Candra Wijaya","Dewi Anggraeni","Eko Prasetyo",
      "Fitri Handayani","Gilang Ramadhan","Hana Safitri","Ivan Santoso","Julia Maharani",
      "Kevin Pratama","Laila Nurfadillah","Mario Situmorang","Nadia Kusuma","Oka Widyatama",
      "Putri Wulandari","Rizki Maulana","Sari Dewi","Taufik Hidayat","Ulfa Ramadhani",
      "Vino Adiputra","Winda Lestari","Xena Anggraita","Yoga Permana","Zahra Meilinda",
      "Ahmad Fauzi","Bagas Saputra","Clara Oktaviani","Dino Setiawan","Elsa Nurhayati",
      "Fajar Kurniawan","Gita Puspita",
    ];
    let seed = 12345;
    function rand(min: number, max: number) {
      seed = (seed * 9301 + 49297) % 233280;
      return min + Math.floor((seed / 233280) * (max - min + 1));
    }
    const data = namaList.map((nama, i) => {
      const ujian = rand(55, 100);
      const ulangan = rand(55, 100);
      const latihan = rand(60, 100);
      const kuis = rand(60, 100);
      const akhir = Math.round(ujian * bU + ulangan * bUl + latihan * bL + kuis * bK);
      return {
        nisn: `00512340${String(i + 1).padStart(3, "0")}`,
        nama,
        kelas: selectedSubject?.kelas || "XII IPA 1",
        ujian, ulangan, latihan, kuis, akhir,
        lulus: akhir >= kkm,
        grade: akhir >= 90 ? "A" : akhir >= 80 ? "B" : akhir >= 70 ? "C" : "D",
      };
    });
    setNilaiData(data);
    setShowNilaiHasil(true);
    setTimeout(() => {
      document.getElementById("nilai-hasil-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function openLaporan(namaUjian: string, tanggal: string, durasi: string, totalSoalStr: string) {
    const ts = parseInt(totalSoalStr);
    setLaporanExamInfo({ nama: namaUjian, tanggal, durasi, totalSoal: ts });
    setLaporanData(generateSiswaData(namaUjian, ts, selectedSubject?.kelas || "XII IPA 1"));
    setLaporanFilter("all");
    setLaporanSortKey("nilai");
    setLaporanSortDir("desc");
    setShowLaporanPage(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveSubject() {
    if (!newName.trim() || !newKelas.trim()) return;
    setSubjects((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), kelas: newKelas.trim(), soal: 0, ujian: 0, color: selectedColor, desc: newDesc.trim() },
    ]);
    setShowAddModal(false);
    setNewName("");
    setNewKelas("");
    setNewDesc("");
    setSelectedColor("zinc");
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    if (tab === "nilai") {
      setShowNilaiHasil(false);
    }
  }

  function handleSelectSubject(subject: Subject) {
    setSelectedSubject(subject);
    setActiveTab("ujian");
    setShowNilaiHasil(false);
    setShowLaporanPage(false);
  }

  function handleBackToMapel() {
    setSelectedSubject(null);
    setShowLaporanPage(false);
    setShowNilaiHasil(false);
  }

  function handleBackToSubject() {
    setShowLaporanPage(false);
  }

  // Sort helpers
  function getSortedNilaiData() {
    return [...nilaiData]
      .filter((s) => {
        if (nilaiFilter === "lulus" && !s.lulus) return false;
        if (nilaiFilter === "tidak" && s.lulus) return false;
        return true;
      })
      .sort((a, b) => {
        const va = a[nilaiSortKey as keyof typeof a] as number;
        const vb = b[nilaiSortKey as keyof typeof b] as number;
        return nilaiSortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
      });
  }

  function getSortedLaporanData() {
    return [...laporanData]
      .filter((s) => {
        if (laporanFilter === "lulus" && !s.lulus) return false;
        if (laporanFilter === "gagal" && s.lulus) return false;
        if (laporanFilter === "viol" && s.pelanggaran === 0) return false;
        return true;
      })
      .sort((a, b) => {
        const va = a[laporanSortKey as keyof typeof a];
        const vb = b[laporanSortKey as keyof typeof b];
        if (typeof va === "string" && typeof vb === "string") {
          return laporanSortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return laporanSortDir === "asc" ? ((va as number) > (vb as number) ? 1 : -1) : ((va as number) < (vb as number) ? 1 : -1);
      });
  }

  // ============ RENDER HELPERS ============

  function renderBreadcrumb() {
    if (showLaporanPage && selectedSubject) {
      return (
        <>
          <span className="text-slate-400 hover:text-zinc-700 cursor-pointer hidden sm:inline" onClick={handleBackToMapel}>Mata Pelajaran</span>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0 hidden sm:inline" />
          <span className="text-slate-400 hover:text-zinc-700 cursor-pointer truncate max-w-[80px] hidden md:inline" onClick={handleBackToSubject}>{selectedSubject.name}</span>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0 hidden md:inline" />
          <span className="text-slate-400 cursor-pointer hover:text-zinc-700 hidden md:inline" onClick={handleBackToSubject}>Ujian</span>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0 hidden md:inline" />
          <span className="text-zinc-900 font-semibold truncate max-w-[120px]">Laporan</span>
        </>
      );
    }
    if (selectedSubject) {
      return (
        <>
          <Link href="/guru/dashboard" className="text-slate-400 hover:text-zinc-700 hidden sm:inline">Dashboard</Link>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0 hidden sm:inline" />
          <span className="text-slate-400 hover:text-zinc-700 cursor-pointer" onClick={handleBackToMapel}>Mata Pelajaran</span>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0" />
          <span className="text-slate-400 truncate max-w-[100px] hidden md:inline">{selectedSubject.name} {selectedSubject.kelas}</span>
          <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0 hidden md:inline" />
          <span className="text-zinc-900 font-semibold">{TAB_LABELS[activeTab]}</span>
        </>
      );
    }
    return (
      <>
        <Link href="/guru/dashboard" className="text-slate-400 hover:text-zinc-700">Dashboard</Link>
        <ChevronRight className="text-slate-300 text-[13px] flex-shrink-0" />
        <span className="text-zinc-900 font-semibold">Mata Pelajaran</span>
      </>
    );
  }

  function getHeaderTitle() {
    if (showLaporanPage) return "Laporan";
    if (selectedSubject) return `${selectedSubject.name} ${selectedSubject.kelas} > ${TAB_LABELS[activeTab]}`;
    return "Dashboard > Mata Pelajaran";
  }

  function getLaporanActions() {
    if (showLaporanPage) return true;
    return false;
  }

  // ============ NILAI AKHIR RENDER ============

  function renderNilaiSummary() {
    const nilais = nilaiData.map((s) => s.akhir);
    const rata = (nilais.reduce((a, b) => a + b, 0) / nilais.length).toFixed(1);
    const lulus = nilaiData.filter((s) => s.lulus).length;
    const stats = [
      { label: "Total Siswa", val: nilaiData.length, icon: <Users className="text-[14px]" />, color: "#18181b" },
      { label: "Rata-rata", val: rata, icon: <BarChart2 className="text-[14px]" />, color: "#2563eb" },
      { label: "Nilai Tertinggi", val: Math.max(...nilais), icon: <TrendingUp className="text-[14px]" />, color: "#059669" },
      { label: `Lulus (≥${kkm})`, val: `${lulus}/${nilaiData.length}`, icon: <CheckCircle className="text-[14px]" />, color: "#059669" },
    ];
    return stats.map((s) => (
      <div key={s.label} className="bg-white border border-slate-200 rounded-[12px] p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
        <div><p className="text-xl font-bold text-zinc-900">{s.val}</p><p className="text-[11px] text-slate-400 font-medium">{s.label}</p></div>
      </div>
    ));
  }

  function renderNilaiDistribution() {
    const grades = [
      { label: "A", min: 90, max: 100, color: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
      { label: "B", min: 80, max: 89, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
      { label: "C", min: 70, max: 79, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
      { label: "D", min: 0, max: 69, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];
    const total = nilaiData.length;
    return (
      <>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {grades.map((g) => {
            const count = nilaiData.filter((s) => s.akhir >= g.min && s.akhir <= g.max).length;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            return (
              <div key={g.label} className="text-center p-4 rounded-xl border" style={{ background: g.bg, borderColor: g.border }}>
                <p className="text-3xl font-black" style={{ color: g.color }}>{count}</p>
                <p className="text-[11px] font-bold mt-0.5" style={{ color: g.color }}>Grade {g.label}</p>
                <p className="text-[10px] text-slate-400">{pct}% siswa</p>
              </div>
            );
          })}
        </div>
        <div className="space-y-2.5">
          {grades.map((g) => {
            const count = nilaiData.filter((s) => s.akhir >= g.min && s.akhir <= g.max).length;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            const rangeLabel = g.label === "A" ? "90–100" : g.label === "B" ? "80–89" : g.label === "C" ? "70–79" : "< 70";
            return (
              <div key={g.label} className="flex items-center gap-3">
                <span className="text-[12px] font-semibold text-slate-500 w-20 text-right flex-shrink-0">{rangeLabel} ({g.label})</span>
                <div className="flex-1 bg-slate-100 rounded-full h-[5px]"><div className="h-[5px] rounded-full transition-all" style={{ width: `${pct}%`, background: g.color }} /></div>
                <span className="text-[12px] font-bold text-zinc-900 w-6 text-right flex-shrink-0">{count}</span>
                <span className="text-[11px] text-slate-400 w-8 flex-shrink-0">{pct}%</span>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  function renderNilaiTable() {
    const sorted = getSortedNilaiData();
    const ranked = [...nilaiData].sort((a, b) => b.akhir - a.akhir);
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm data-table">
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 text-center w-10">#</th>
              <th className="px-4 py-3 text-left">Nama Siswa</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Kelas</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell cursor-pointer hover:text-zinc-700" onClick={() => { if (nilaiSortKey === "ujian") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("ujian"); setNilaiSortAsc(false); } }}><span className="flex items-center gap-1">Ujian <ChevronRight className="text-[11px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden sm:table-cell cursor-pointer hover:text-zinc-700" onClick={() => { if (nilaiSortKey === "ulangan") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("ulangan"); setNilaiSortAsc(false); } }}><span className="flex items-center gap-1">Ulangan <ChevronRight className="text-[11px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden lg:table-cell cursor-pointer hover:text-zinc-700" onClick={() => { if (nilaiSortKey === "latihan") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("latihan"); setNilaiSortAsc(false); } }}><span className="flex items-center gap-1">Latihan <ChevronRight className="text-[11px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden lg:table-cell cursor-pointer hover:text-zinc-700" onClick={() => { if (nilaiSortKey === "kuis") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("kuis"); setNilaiSortAsc(false); } }}><span className="flex items-center gap-1">Kuis <ChevronRight className="text-[11px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left cursor-pointer hover:text-zinc-700" onClick={() => { if (nilaiSortKey === "akhir") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("akhir"); setNilaiSortAsc(false); } }}><span className="flex items-center gap-1">Nilai Akhir <ChevronRight className="text-[11px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Grade</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((s) => {
              const rank = ranked.findIndex((r) => r.nisn === s.nisn) + 1;
              const rankClass = rank === 1 ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white" : rank === 2 ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white" : rank === 3 ? "bg-gradient-to-br from-orange-400 to-amber-600 text-white" : "bg-slate-100 text-slate-600";
              const akhirColor = s.akhir >= 90 ? "#059669" : s.akhir >= 80 ? "#10b981" : s.akhir >= 70 ? "#2563eb" : "#dc2626";
              const gradeClass = { A: "bg-emerald-50 text-emerald-700", B: "bg-blue-50 text-blue-700", C: "bg-amber-50 text-amber-700", D: "bg-red-50 text-red-700" }[s.grade] || "bg-red-50 text-red-700";
              return (
                <tr key={s.nisn}>
                  <td className="px-4 py-3 text-center"><span className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center mx-auto ${rankClass}`}>{rank}</span></td>
                  <td className="px-4 py-3"><p className="font-semibold text-zinc-900 text-[13px]">{s.nama}</p><p className="text-[11px] text-slate-400">{s.nisn}</p></td>
                  <td className="px-4 py-3 text-slate-500 text-[12px] hidden md:table-cell">{s.kelas}</td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.ujian}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.ulangan}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.latihan}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.kuis}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[16px]" style={{ color: akhirColor }}>{s.akhir}</span>
                      <div className="bg-slate-100 rounded-full h-[5px] flex-1 max-w-[40px] hidden lg:block"><div className="h-[5px] rounded-full" style={{ width: `${s.akhir}%`, background: akhirColor }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-[11px] font-extrabold ${gradeClass}`}>{s.grade}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.lulus ? <span className="badge badge-green">LULUS</span> : <span className="badge badge-red">TIDAK LULUS</span>}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ============ LAPORAN RENDER ============

  function renderLaporanSummary() {
    const nilai = laporanData.map((s) => s.nilai);
    const rata = (nilai.reduce((a, b) => a + b, 0) / nilai.length).toFixed(1);
    const lulus = laporanData.filter((s) => s.lulus).length;
    const siswaViol = laporanData.filter((s) => s.pelanggaran > 0).length;
    const stats = [
      { label: "Peserta", val: laporanData.length, icon: <Users className="text-[14px]" />, color: "#18181b" },
      { label: "Rata-rata", val: rata, icon: <BarChart2 className="text-[14px]" />, color: "#2563eb" },
      { label: "Tertinggi", val: Math.max(...nilai), icon: <TrendingUp className="text-[14px]" />, color: "#059669" },
      { label: "Terendah", val: Math.min(...nilai), icon: <TrendingUp className="text-[14px] rotate-180" />, color: "#dc2626" },
      { label: "Lulus KKM", val: `${lulus}/${laporanData.length}`, icon: <CheckCircle className="text-[14px]" />, color: "#059669" },
      { label: "Pelanggaran", val: `${siswaViol} siswa`, icon: <ShieldAlert className="text-[14px]" />, color: "#d97706" },
    ];
    return stats.map((s) => (
      <div key={s.label} className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1.5 mb-1.5" style={{ color: s.color }}>
          {s.icon}
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
        </div>
        <p className="text-xl font-bold text-zinc-900">{s.val}</p>
      </div>
    ));
  }

  function renderLaporanDistribution() {
    const ranges = [
      { label: "90–100", min: 90, max: 100, color: "#059669" },
      { label: "80–89", min: 80, max: 89, color: "#10b981" },
      { label: "70–79", min: 70, max: 79, color: "#3b82f6" },
      { label: "60–69", min: 60, max: 69, color: "#f59e0b" },
      { label: "< 60", min: 0, max: 59, color: "#ef4444" },
    ];
    const max = laporanData.length;
    return ranges.map((r) => {
      const count = laporanData.filter((s) => s.nilai >= r.min && s.nilai <= r.max).length;
      const pct = max > 0 ? ((count / max) * 100).toFixed(0) : 0;
      return (
        <div key={r.label} className="flex items-center gap-3">
          <span className="text-[12px] font-semibold text-slate-500 w-14 text-right flex-shrink-0">{r.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-[5px]"><div className="h-[5px] rounded-full" style={{ width: `${pct}%`, background: r.color }} /></div>
          <span className="text-[12px] font-bold text-zinc-900 w-6 text-right flex-shrink-0">{count}</span>
          <span className="text-[11px] text-slate-400 w-8 flex-shrink-0">{pct}%</span>
        </div>
      );
    });
  }

  function renderLaporanTable() {
    const sorted = getSortedLaporanData();
    const ranked = [...laporanData].sort((a, b) => b.nilai - a.nilai);
    const ts = laporanExamInfo.totalSoal || 40;
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm data-table">
          <thead className="border-b border-slate-100">
            <tr>
              <th className="px-4 py-3 text-center w-12">#</th>
              <th className="px-4 py-3 text-left">NISN</th>
              <th className="px-4 py-3 text-left">Nama Siswa</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">Kelas</th>
              <th className="px-4 py-3 text-left hidden sm:table-cell cursor-pointer select-none hover:text-zinc-700" onClick={() => { if (laporanSortKey === "benar") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("benar"); setLaporanSortDir("desc"); } }}><span className="flex items-center gap-1">Benar <ChevronRight className="text-[12px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden sm:table-cell cursor-pointer select-none hover:text-zinc-700" onClick={() => { if (laporanSortKey === "salah") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("salah"); setLaporanSortDir("desc"); } }}><span className="flex items-center gap-1">Salah <ChevronRight className="text-[12px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left cursor-pointer select-none hover:text-zinc-700" onClick={() => { if (laporanSortKey === "nilai") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("nilai"); setLaporanSortDir("desc"); } }}><span className="flex items-center gap-1">Nilai <ChevronRight className="text-[12px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden md:table-cell cursor-pointer select-none hover:text-zinc-700" onClick={() => { if (laporanSortKey === "pelanggaran") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("pelanggaran"); setLaporanSortDir("desc"); } }}><span className="flex items-center gap-1">Pelanggaran <ChevronRight className="text-[12px] rotate-90" /></span></th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sorted.map((s) => {
              const rank = ranked.findIndex((r) => r.nisn === s.nisn) + 1;
              const rankClass = rank === 1 ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white" : rank === 2 ? "bg-gradient-to-br from-slate-400 to-slate-500 text-white" : rank === 3 ? "bg-gradient-to-br from-orange-400 to-amber-600 text-white" : "bg-slate-100 text-slate-600";
              const nilaiColor = s.nilai >= 90 ? "#059669" : s.nilai >= 80 ? "#10b981" : s.nilai >= 70 ? "#2563eb" : s.nilai >= 60 ? "#d97706" : "#dc2626";
              const violColor = s.pelanggaran === 0 ? "#94a3b8" : s.pelanggaran <= 1 ? "#f59e0b" : s.pelanggaran <= 2 ? "#f97316" : "#dc2626";
              const benarPct = ((s.benar / ts) * 100).toFixed(0);
              return (
                <tr key={s.nisn}>
                  <td className="px-4 py-3 text-center"><span className={`w-7 h-7 rounded-full text-[11px] font-bold flex items-center justify-center mx-auto ${rankClass}`}>{rank}</span></td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{s.nisn}</td>
                  <td className="px-4 py-3"><p className="font-semibold text-zinc-900 text-[13px]">{s.nama}</p></td>
                  <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">{s.kelas}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-600 text-[13px] w-6">{s.benar}</span>
                      <div className="bg-slate-100 rounded-full h-[5px] flex-1 max-w-[48px]"><div className="h-[5px] rounded-full bg-emerald-400" style={{ width: `${benarPct}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="font-bold text-red-500 text-[13px]">{s.salah}</span></td>
                  <td className="px-4 py-3"><span className="font-bold text-[15px]" style={{ color: nilaiColor }}>{s.nilai}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ background: violColor }} />
                      <span className="font-semibold text-[13px]" style={{ color: violColor }}>{s.pelanggaran}x</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">{s.lulus ? <span className="badge badge-green">LULUS</span> : <span className="badge badge-red">TIDAK LULUS</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setSelectedStudent(s); setShowStudentModal(true); }} className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Detail</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // ============ MAIN RENDER ============

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}>
        <Sidebar role="guru" />
      </div>

      <div className="flex-1">
        <Header
          title={getHeaderTitle()}
          showHamburger
          onHamburgerClick={() => setSidebarOpen(true)}
          breadcrumb={renderBreadcrumb()}
          showLaporanActions={getLaporanActions()}
        />

        {/* ======= PAGE: DAFTAR MAPEL ======= */}
        {!selectedSubject && !showLaporanPage && (
          <div className="p-5 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
              <div>
                <h1 className="text-xl font-bold text-zinc-900">Mata Pelajaran</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Kelola semua mata pelajaran yang Anda ampu</p>
              </div>
              <button onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }} className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit">
                <Plus className="w-4 h-4" />Tambah Mata Pelajaran
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up-1">
              {[
                { label: "Total Mapel", val: subjects.length, icon: <BookOpen className="text-[18px]" />, color: "#18181b" },
                { label: "Total Soal", val: totalSoal, icon: <FileText className="text-[18px]" />, color: "#2563eb" },
                { label: "Ujian Aktif", val: totalUjian, icon: <ClipboardList className="text-[18px]" />, color: "#059669" },
                { label: "Kelas Diampu", val: subjects.length, icon: <Users className="text-[18px]" />, color: "#d97706" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-[12px] p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
                  <div><p className="text-xl font-bold text-zinc-900">{s.val}</p><p className="text-[11px] text-slate-400 font-medium">{s.label}</p></div>
                </div>
              ))}
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 flex-wrap fade-up-1">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Filter:</span>
              {[
                { key: "all", label: "Semua" },
                { key: "XII", label: "Kelas XII" },
                { key: "XI", label: "Kelas XI" },
                { key: "X", label: "Kelas X" },
              ].map((f) => (
                <button key={f.key} onClick={() => setCurrentFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${currentFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-up-2">
              {filteredSubjects.map((subject) => {
                const c = COLORS[subject.color as keyof typeof COLORS] || COLORS.zinc;
                return (
                  <div key={subject.id} onClick={() => handleSelectSubject(subject)} className="bg-white border border-slate-200 rounded-[14px] p-6 cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-slate-300 transition-all group">
                    <div className="h-1.5 rounded-full mb-4" style={{ background: c.dot, width: "40px" }} />
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                        <BookOpen style={{ color: c.icon, fontSize: "20px" }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-900 text-[14px] leading-tight truncate">{subject.name}</p>
                        <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subject.kelas}</p>
                      </div>
                    </div>
                    {subject.desc && <p className="text-[12px] text-slate-500 mb-3 truncate">{subject.desc}</p>}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <FileText className="text-slate-400 text-[13px]" />
                        <span className="text-[12px] text-slate-500 font-medium">{subject.soal} soal</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="text-slate-400 text-[13px]" />
                        <span className="text-[12px] text-slate-500 font-medium">{subject.ujian} ujian</span>
                      </div>
                      <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-500 transition-all text-base" />
                    </div>
                  </div>
                );
              })}
              {/* Add Card */}
              <div onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }} className="border-2 border-dashed border-slate-200 rounded-[14px] p-6 flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[160px]">
                <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                  <Plus className="text-slate-400 text-xl" />
                </div>
                <div>
                  <p className="text-[13px] text-zinc-700 font-semibold">Tambah Mata Pelajaran</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Buat mapel baru</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======= PAGE: LAPORAN ======= */}
        {showLaporanPage && selectedSubject && (
          <div className="p-5 md:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToSubject} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 hover:text-zinc-900 transition-colors flex-shrink-0">
                  <ArrowLeft className="text-lg" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Laporan Hasil</p>
                    <span className="badge badge-slate">{laporanExamInfo.nama}</span>
                  </div>
                  <h1 className="text-lg md:text-xl font-bold text-zinc-900">{selectedSubject.name} — {selectedSubject.kelas}</h1>
                  <p className="text-[12px] text-slate-400 mt-0.5">{laporanExamInfo.tanggal} · {laporanExamInfo.durasi} · {laporanExamInfo.totalSoal} soal</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 fade-up-1">
              {renderLaporanSummary()}
            </div>

            <div className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] fade-up-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-zinc-900 text-[14px]">Distribusi Nilai</h3>
                <span className="text-[11px] text-slate-400">{laporanData.length} siswa hadir</span>
              </div>
              <div className="space-y-2.5">{renderLaporanDistribution()}</div>
            </div>

            <div className="fade-up-2 space-y-3">
              {/* Laporan Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Filter:</span>
                {[
                  { key: "all", label: "Semua" },
                  { key: "lulus", label: "Lulus" },
                  { key: "gagal", label: "Tidak Lulus" },
                  { key: "viol", label: "Ada Pelanggaran" },
                ].map((f) => (
                  <button key={f.key} onClick={() => setLaporanFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${laporanFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <h3 className="font-semibold text-zinc-900 text-[14px]">Data Hasil Siswa</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{getSortedLaporanData().length} siswa</span>
                </div>
                {renderLaporanTable()}
                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[12px] text-slate-400">Menampilkan {getSortedLaporanData().length} dari {laporanData.length} siswa</span>
                  <span className="text-[12px] text-slate-500">KKM: <strong className="text-zinc-900">{KKM_DEFAULT}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======= PAGE: DETAIL MAPEL ======= */}
        {selectedSubject && !showLaporanPage && (
          <div className="p-5 md:p-8 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 fade-up">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToMapel} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 hover:text-zinc-900 transition-colors flex-shrink-0">
                  <ArrowLeft className="text-lg" />
                </button>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mata Pelajaran</p>
                  <h1 className="text-lg md:text-xl font-bold text-zinc-900 truncate">{selectedSubject.name} — {selectedSubject.kelas}</h1>
                </div>
              </div>
              {activeTab !== "nilai" && (
                <button onClick={() => setShowContentModal(true)} className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit flex-shrink-0">
                  <Plus className="w-4 h-4" />
                  <span>Tambah {TAB_LABELS[activeTab]}</span>
                </button>
              )}
            </div>

            {/* Subject Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up-1">
              {[
                { label: "Total Soal", val: selectedSubject.soal, icon: <FileText className="text-base text-slate-400" /> },
                { label: "Ujian", val: selectedSubject.ujian, icon: <ClipboardList className="text-base text-slate-400" /> },
                { label: "Siswa Aktif", val: 35, icon: <Users className="text-base text-slate-400" /> },
                { label: "Rata-rata", val: "78.5", icon: <TrendingUp className="text-base text-slate-400" /> },
              ].map((st) => (
                <div key={st.label} className="bg-white border border-slate-200 rounded-[12px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-2 mb-1">{st.icon}<p className="text-[11px] text-slate-400 font-medium">{st.label}</p></div>
                  <p className="text-2xl font-bold text-zinc-900">{st.val}</p>
                </div>
              ))}
            </div>

            {/* Sub Tabs */}
            <div className="fade-up-1 overflow-x-auto -mx-1 px-1">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit min-w-full sm:min-w-0">
                {Object.entries(TAB_LABELS).map(([key, label]) => (
                  <button key={key} onClick={() => handleTabChange(key)} className={`px-4 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer border-none ${activeTab === key ? "bg-white text-zinc-900 shadow-sm" : "text-slate-500 hover:text-zinc-900"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab: Ujian */}
            {activeTab === "ujian" && (
              <div className="fade-up-2">
                <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 text-[14px]">Daftar Ujian</h3>
                    <span className="text-[11px] text-slate-400 font-medium">2 ujian</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead className="border-b border-slate-100 bg-slate-50/50">
                        <tr>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400">Nama Ujian</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden sm:table-cell">Tanggal</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden md:table-cell">Durasi</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden md:table-cell">Peserta</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400">Status</th>
                          <th className="px-5 py-3 text-right text-[11px] font-bold uppercase text-slate-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-zinc-900">UAS Matematika Peminatan</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">22 Apr 2026</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">90 menit</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">23/35</td>
                          <td className="px-5 py-3.5"><span className="badge badge-blue"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> BERLANGSUNG</span></td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Detail</button>
                              <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 text-slate-400">Edit</button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-zinc-900">UTS Fungsi Komposisi</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">10 Mar 2026</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">60 menit</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">32/32</td>
                          <td className="px-5 py-3.5"><span className="badge badge-slate">SELESAI</span></td>
                          <td className="px-5 py-3.5 text-right">
                            <button onClick={() => openLaporan("UTS Fungsi Komposisi", "10 Mar 2026", "60 menit", "40")} className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors">Laporan</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ulangan */}
            {activeTab === "ulangan" && (
              <div className="fade-up-2">
                <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 text-[14px]">Ulangan Harian</h3>
                    <span className="text-[11px] text-slate-400 font-medium">2 ulangan</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead className="border-b border-slate-100 bg-slate-50/50">
                        <tr>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400">Nama Ulangan</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden sm:table-cell">Topik</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden md:table-cell">Tanggal</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400">Status</th>
                          <th className="px-5 py-3 text-right text-[11px] font-bold uppercase text-slate-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-zinc-900">UH Trigonometri</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">Bab 4 – Trigonometri</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">15 Apr 2026</td>
                          <td className="px-5 py-3.5"><span className="badge badge-green">AKTIF</span></td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Detail</button>
                              <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 text-slate-400">Edit</button>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-5 py-3.5 font-medium text-zinc-900">UH Fungsi Invers</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">Bab 3 – Fungsi</td>
                          <td className="px-5 py-3.5 text-slate-500 hidden md:table-cell">02 Mar 2026</td>
                          <td className="px-5 py-3.5"><span className="badge badge-slate">SELESAI</span></td>
                          <td className="px-5 py-3.5 text-right">
                            <button onClick={() => openLaporan("UH Fungsi Invers", "02 Mar 2026", "45 menit", "25")} className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 hover:border-slate-400 transition-colors">Laporan</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Latihan */}
            {activeTab === "latihan" && (
              <div className="fade-up-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0"><Dumbbell className="text-violet-600 text-lg" /></div>
                      <span className="badge badge-green">AKTIF</span>
                    </div>
                    <p className="font-semibold text-zinc-900 text-[13px] mb-1">Latihan Limit Fungsi</p>
                    <p className="text-[12px] text-slate-400">20 soal · 30 menit · 24 siswa</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button className="flex-1 h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Detail</button>
                      <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 text-slate-400">Edit</button>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Dumbbell className="text-blue-600 text-lg" /></div>
                      <span className="badge badge-slate">SELESAI</span>
                    </div>
                    <p className="font-semibold text-zinc-900 text-[13px] mb-1">Latihan Integral</p>
                    <p className="text-[12px] text-slate-400">15 soal · 20 menit · 30 siswa</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button onClick={() => openLaporan("Latihan Integral", "20 Feb 2026", "20 menit", "15")} className="flex-1 h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Laporan</button>
                    </div>
                  </div>
                  <div onClick={() => setShowContentModal(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[130px]">
                    <Plus className="text-2xl text-slate-300" />
                    <p className="text-[13px] text-slate-400 font-medium">Buat Latihan Baru</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Kuis */}
            {activeTab === "kuis" && (
              <div className="fade-up-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0"><Zap className="text-amber-600 text-lg" /></div>
                      <span className="badge badge-slate">SELESAI</span>
                    </div>
                    <p className="font-semibold text-zinc-900 text-[13px] mb-1">Quiz Fungsi Komposisi</p>
                    <p className="text-[12px] text-slate-400">15 soal · 20 menit · 32/32 peserta</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button onClick={() => openLaporan("Quiz Fungsi Komposisi", "05 Mar 2026", "20 menit", "15")} className="flex-1 h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Laporan</button>
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0"><Zap className="text-emerald-600 text-lg" /></div>
                      <span className="badge badge-amber">DRAFT</span>
                    </div>
                    <p className="font-semibold text-zinc-900 text-[13px] mb-1">Quiz Matriks</p>
                    <p className="text-[12px] text-slate-400">10 soal · 15 menit</p>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                      <button className="flex-1 h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Preview</button>
                      <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 text-slate-400">Edit</button>
                    </div>
                  </div>
                  <div onClick={() => setShowContentModal(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[130px]">
                    <Plus className="text-2xl text-slate-300" />
                    <p className="text-[13px] text-slate-400 font-medium">Buat Kuis Baru</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Bank Soal */}
            {activeTab === "soal" && (
              <div className="fade-up-2 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]" />
                      <input type="text" placeholder="Cari soal..." className="h-9 pl-8 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-48" />
                    </div>
                    <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] text-slate-600 focus:outline-none">
                      <option value="">Semua Tipe</option>
                      <option>Pilihan Ganda</option>
                      <option>Essay</option>
                      <option>Benar/Salah</option>
                    </select>
                  </div>
                  <button onClick={() => setShowContentModal(true)} className="h-9 px-4 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Soal Baru
                  </button>
                </div>
                <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 text-[14px]">Bank Soal</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{selectedSubject.soal} soal</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm data-table">
                      <thead className="border-b border-slate-100">
                        <tr>
                          <th className="px-5 py-3 text-left w-8 text-[11px] font-bold uppercase text-slate-400">#</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400">Pertanyaan</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden sm:table-cell">Topik</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden md:table-cell">Tipe</th>
                          <th className="px-5 py-3 text-left text-[11px] font-bold uppercase text-slate-400 hidden lg:table-cell">Bobot</th>
                          <th className="px-5 py-3 text-right text-[11px] font-bold uppercase text-slate-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {[
                          { no: "01", q: "Tentukan nilai lim x→2 (x²+3x−5)", topik: "Limit Fungsi", tipe: "Pilihan Ganda", tipeBadge: "badge-blue", bobot: "5 poin" },
                          { no: "02", q: "f(x) = 2x² + 3x − 5. Tentukan f(3)", topik: "Fungsi Kuadrat", tipe: "Pilihan Ganda", tipeBadge: "badge-blue", bobot: "5 poin" },
                          { no: "03", q: "Jelaskan konsep turunan dan aplikasinya", topik: "Turunan", tipe: "Essay", tipeBadge: "badge-amber", bobot: "20 poin" },
                          { no: "04", q: "Hitung integral ∫(3x²+2x) dx", topik: "Integral", tipe: "Pilihan Ganda", tipeBadge: "badge-blue", bobot: "5 poin" },
                        ].map((item) => (
                          <tr key={item.no}>
                            <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">{item.no}</td>
                            <td className="px-5 py-3.5 font-medium text-zinc-900 max-w-[200px] truncate">{item.q}</td>
                            <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">{item.topik}</td>
                            <td className="px-5 py-3.5 hidden md:table-cell"><span className={`badge ${item.tipeBadge}`}>{item.tipe}</span></td>
                            <td className="px-5 py-3.5 text-slate-500 hidden lg:table-cell">{item.bobot}</td>
                            <td className="px-5 py-3.5 text-right">
                              <div className="flex justify-end gap-1.5">
                                <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">Preview</button>
                                <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 text-slate-400">Edit</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[12px] text-slate-400">Menampilkan 1–4 dari {selectedSubject.soal} soal</span>
                    <div className="flex gap-1">
                      <button disabled className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 disabled:opacity-40"><ChevronRight className="text-[14px] rotate-180" /></button>
                      <button className="h-7 w-7 rounded-lg bg-zinc-900 text-white text-[12px] font-semibold flex items-center justify-center">1</button>
                      <button className="h-7 w-7 rounded-lg border border-slate-200 text-[12px] text-slate-600 hover:bg-slate-50 flex items-center justify-center">2</button>
                      <button className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50"><ChevronRight className="text-[14px]" /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Nilai Akhir */}
            {activeTab === "nilai" && (
              <div className="fade-up-2 space-y-5">
                {/* Config */}
                <div className="bg-white border border-slate-200 rounded-[14px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="font-bold text-zinc-900 text-[15px]">Konfigurasi Rumus Nilai Akhir</h3>
                      <p className="text-[12px] text-slate-500 mt-0.5">Tentukan bobot untuk setiap komponen penilaian. Total bobot harus <strong>100%</strong>.</p>
                    </div>
                    <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[13px] font-bold ${isBobotValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>Total: {bobotTotal}%</div>
                  </div>

                  <div className="space-y-4">
                    {/* Ujian with sub-bobots */}
                    <div className="p-4 rounded-xl bg-violet-50 border border-violet-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center"><ClipboardList className="text-violet-600 text-base" /></div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-[13px]">Ujian</p>
                            <p className="text-[11px] text-slate-400">2 ujian tersedia</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-slate-500">Bobot:</span>
                          <input type="number" value={bobotUjian} onChange={(e) => setBobotUjian(parseInt(e.target.value) || 0)} className="w-[72px] h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                          <span className="text-[13px] font-semibold text-slate-500">%</span>
                        </div>
                      </div>
                      <div className="pl-10 space-y-2 pt-2 border-t border-violet-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">UAS Matematika Peminatan</span>
                          <div className="flex items-center gap-1.5">
                            <input type="number" value={subBobotUjian1} onChange={(e) => setSubBobotUjian1(parseInt(e.target.value) || 0)} className="w-[60px] h-[30px] text-center border-[1.5px] border-slate-200 rounded-lg text-[12px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                            <span className="text-[11px] text-slate-400">%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] text-slate-600">UTS Fungsi Komposisi</span>
                          <div className="flex items-center gap-1.5">
                            <input type="number" value={subBobotUjian2} onChange={(e) => setSubBobotUjian2(parseInt(e.target.value) || 0)} className="w-[60px] h-[30px] text-center border-[1.5px] border-slate-200 rounded-lg text-[12px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                            <span className="text-[11px] text-slate-400">%</span>
                          </div>
                        </div>
                        <p className={`text-[11px] font-semibold ${subUjianTotal === 100 ? "text-emerald-600" : "text-red-500"}`}>Sub-total ujian: {subUjianTotal}%</p>
                      </div>
                    </div>

                    {/* Ulangan */}
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><Book className="text-blue-600 text-base" /></div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-[13px]">Ulangan Harian</p>
                            <p className="text-[11px] text-slate-400">Rata-rata semua ulangan</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-slate-500">Bobot:</span>
                          <input type="number" value={bobotUlangan} onChange={(e) => setBobotUlangan(parseInt(e.target.value) || 0)} className="w-[72px] h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                          <span className="text-[13px] font-semibold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Latihan */}
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center"><Dumbbell className="text-emerald-600 text-base" /></div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-[13px]">Latihan</p>
                            <p className="text-[11px] text-slate-400">Rata-rata semua latihan</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-slate-500">Bobot:</span>
                          <input type="number" value={bobotLatihan} onChange={(e) => setBobotLatihan(parseInt(e.target.value) || 0)} className="w-[72px] h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                          <span className="text-[13px] font-semibold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Kuis */}
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center"><Zap className="text-amber-600 text-base" /></div>
                          <div>
                            <p className="font-semibold text-zinc-900 text-[13px]">Kuis</p>
                            <p className="text-[11px] text-slate-400">Rata-rata semua kuis</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-slate-500">Bobot:</span>
                          <input type="number" value={bobotKuis} onChange={(e) => setBobotKuis(parseInt(e.target.value) || 0)} className="w-[72px] h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                          <span className="text-[13px] font-semibold text-slate-500">%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rumus Preview */}
                  <div className="mt-5 p-4 bg-slate-900 rounded-xl">
                    <p className="text-[11px] text-slate-400 mb-2 font-semibold uppercase tracking-wider">Preview Rumus</p>
                    <p className="text-[13px] text-white font-mono leading-relaxed">
                      Nilai Akhir = {bobotUjian > 0 && `(Ujian × ${bobotUjian}%)`}{bobotUjian > 0 && bobotUlangan > 0 && " + "}{bobotUlangan > 0 && `(Ulangan × ${bobotUlangan}%)`}{(bobotUlangan > 0 && bobotLatihan > 0) && " + "}{bobotLatihan > 0 && `(Latihan × ${bobotLatihan}%)`}{(bobotLatihan > 0 && bobotKuis > 0) && " + "}{bobotKuis > 0 && `(Kuis × ${bobotKuis}%)`}
                    </p>
                  </div>

                  {/* KKM & Hitung */}
                  <div className="mt-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="text-[12px] font-semibold text-slate-600">KKM:</label>
                      <input type="number" value={kkm} onChange={(e) => setKkm(parseInt(e.target.value) || 0)} className="w-[68px] h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 focus:bg-white outline-none transition" />
                      <span className="text-[12px] text-slate-500">(Kriteria Ketuntasan Minimal)</span>
                    </div>
                    <button onClick={hitungNilaiAkhir} disabled={!isBobotValid} className="h-10 px-6 bg-zinc-900 text-white text-[13px] font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                      <Calculator className="w-4 h-4" />Hitung Nilai Akhir
                    </button>
                  </div>

                  {!isBobotValid && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                      <AlertCircle className="text-red-500 flex-shrink-0" />
                      <p className="text-[12px] text-red-600 font-medium">Total bobot harus 100%. Sesuaikan bobot sebelum menghitung.</p>
                    </div>
                  )}
                </div>

                {/* Hasil Nilai */}
                {showNilaiHasil && (
                  <div id="nilai-hasil-section" className="space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{renderNilaiSummary()}</div>
                    <div className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <h3 className="font-semibold text-zinc-900 text-[14px] mb-4">Distribusi Nilai Akhir</h3>
                      {renderNilaiDistribution()}
                    </div>
                    <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                        <div>
                          <h3 className="font-semibold text-zinc-900 text-[14px]">Rekap Nilai Akhir Siswa</h3>
                          <p className="text-[11px] text-slate-400 mt-0.5">Rumus: Ujian {bobotUjian}% + Ulangan {bobotUlangan}% + Latihan {bobotLatihan}% + Kuis {bobotKuis}%</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12px] text-slate-500">Filter:</span>
                            <select value={nilaiFilter} onChange={(e) => setNilaiFilter(e.target.value)} className="h-8 px-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none">
                              <option value="all">Semua</option>
                              <option value="lulus">Lulus</option>
                              <option value="tidak">Tidak Lulus</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {renderNilaiTable()}
                      <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[12px] text-slate-400">{getSortedNilaiData().length} dari {nilaiData.length} siswa</span>
                        <span className="text-[12px] text-slate-500">KKM: <strong className="text-zinc-900">{kkm}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======= MODAL: Tambah Mata Pelajaran ======= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Tambah Mata Pelajaran</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama Mata Pelajaran <span className="text-red-500">*</span></label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Matematika Peminatan" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Kelas <span className="text-red-500">*</span></label>
                <input type="text" value={newKelas} onChange={(e) => setNewKelas(e.target.value)} placeholder="e.g. XII IPA 2" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Deskripsi</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} placeholder="Deskripsi singkat..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 transition resize-none" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Warna Tema</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(COLORS).map(([key, c]) => (
                    <button key={key} onClick={() => setSelectedColor(key)} className={`w-7 h-7 rounded-full transition-all ${selectedColor === key ? "ring-2 ring-offset-2" : ""}`} style={{ background: c.hex, outlineColor: c.hex }} data-color={key} />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50 transition">Batal</button>
              <button onClick={saveSubject} className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 transition">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL: Tambah Konten ======= */}
      {showContentModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContentModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl z-10">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Tambah {TAB_LABELS[activeTab]}</h3>
              <button onClick={() => setShowContentModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama <span className="text-red-500">*</span></label>
                <input type="text" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Tanggal</label>
                  <input type="date" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Durasi (menit)</label>
                  <input type="number" placeholder="60" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Jumlah Soal</label>
                <input type="number" placeholder="40" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setShowContentModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">Batal</button>
              <button onClick={() => setShowContentModal(false)} className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL: Detail Siswa ======= */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStudentModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-base font-bold text-zinc-900">Detail Siswa</h3>
              <button onClick={() => setShowStudentModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-bold flex-shrink-0">{selectedStudent.nama.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900">{selectedStudent.nama}</p>
                  <p className="text-[12px] text-slate-400">NISN: {selectedStudent.nisn} · {selectedStudent.kelas}</p>
                  <div className="mt-1">{selectedStudent.lulus ? <span className="badge badge-green">LULUS</span> : <span className="badge badge-red">TIDAK LULUS</span>}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-3xl font-bold" style={{ color: selectedStudent.nilai >= 90 ? "#059669" : selectedStudent.nilai >= 80 ? "#10b981" : selectedStudent.nilai >= 70 ? "#2563eb" : "#dc2626" }}>{selectedStudent.nilai}</p>
                  <p className="text-[11px] text-slate-400">Nilai Akhir</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                  <p className="text-2xl font-bold text-emerald-600">{selectedStudent.benar}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Benar</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl text-center border border-red-100">
                  <p className="text-2xl font-bold text-red-500">{selectedStudent.salah}</p>
                  <p className="text-[11px] text-red-500 font-semibold mt-0.5">Salah</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${selectedStudent.pelanggaran > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
                  <p className={`text-2xl font-bold ${selectedStudent.pelanggaran > 0 ? "text-amber-600" : "text-slate-400"}`}>{selectedStudent.pelanggaran}</p>
                  <p className={`text-[11px] font-semibold mt-0.5 ${selectedStudent.pelanggaran > 0 ? "text-amber-600" : "text-slate-400"}`}>Pelanggaran</p>
                </div>
              </div>
              {selectedStudent.catatan.length > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2"><ShieldAlert className="text-amber-600" /><p className="text-[13px] font-semibold text-amber-700">{selectedStudent.pelanggaran} Pelanggaran Terdeteksi</p></div>
                  <ul className="space-y-1">{selectedStudent.catatan.map((c, i) => <li key={i} className="text-[12px] text-amber-700">• {c}</li>)}</ul>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" /><p className="text-[13px] font-semibold text-emerald-700">Tidak ada pelanggaran terdeteksi</p>
                </div>
              )}
              <p className="text-[11px] text-slate-400 text-center">KKM: {KKM_DEFAULT} · {laporanExamInfo.nama}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}