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
  X,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Book,
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  Hash,
  Eye,
  EyeOff,
  Check,
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

interface UjianDetail {
  id: string;
  nama: string;
  tanggal: string;
  durasi: string;
  totalSoal: number;
  peserta: string;
  status: "berlangsung" | "selesai" | "draft";
  token: string;
  kelas: string;
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

const UJIAN_LIST: UjianDetail[] = [
  {
    id: "uas-mat-peminatan-2026",
    nama: "UAS Matematika Peminatan",
    tanggal: "22 Apr 2026",
    durasi: "90 menit",
    totalSoal: 45,
    peserta: "23/35",
    status: "berlangsung",
    token: "MAT-7X2K-9PQR",
    kelas: "XII IPA 1",
  },
  {
    id: "uts-fungsi-komposisi-2026",
    nama: "UTS Fungsi Komposisi",
    tanggal: "10 Mar 2026",
    durasi: "60 menit",
    totalSoal: 40,
    peserta: "32/32",
    status: "selesai",
    token: "MAT-4A1B-7CDE",
    kelas: "XII IPA 1",
  },
];

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

export default function AdminMataPelajaran() {
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

  // Detail Ujian Modal
  const [showDetailUjianModal, setShowDetailUjianModal] = useState(false);
  const [selectedUjian, setSelectedUjian] = useState<UjianDetail | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showToken, setShowToken] = useState(false);

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

  const [laporanData, setLaporanData] = useState<ReturnType<typeof generateSiswaData>>([]);
  const [laporanExamInfo, setLaporanExamInfo] = useState({ nama: "", tanggal: "", durasi: "", totalSoal: 40 });
  const [laporanFilter, setLaporanFilter] = useState("all");
  const [laporanSortKey, setLaporanSortKey] = useState("nilai");
  const [laporanSortDir, setLaporanSortDir] = useState<"asc" | "desc">("desc");
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<ReturnType<typeof generateSiswaData>[0] | null>(null);
  const [showLaporanPage, setShowLaporanPage] = useState(false);

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

  // ============ COPY HELPERS ============
  function copyToClipboard(text: string, type: "link" | "token") {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "link") {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }
    });
  }

  function openDetailUjian(ujian: UjianDetail) {
    setSelectedUjian(ujian);
    setShowToken(false);
    setCopiedLink(false);
    setCopiedToken(false);
    setShowDetailUjianModal(true);
  }

  function getAksesUjianUrl(id: string) {
    return `http://localhost:3001/siswa/akses-ujian/${id}`;
  }

  function hitungNilaiAkhir() {
    const bU = bobotUjian / 100;
    const bUl = bobotUlangan / 100;
    const bL = bobotLatihan / 100;
    const bK = bobotKuis / 100;
    const namaList = [
      "Adi Nugroho","Bella Rahmawati","Candra Wijaya","Dewi Anggraeni","Eko Prasetyo",
      "Fitri Handayani","Gilang Ramadhan","Hana Safitri","Ivan Santoso","Julia Maharani",
      "Kevin Pratama","Laila Nurfadillah","Mario Situmorang","Nadia Kusuma","Oka Widyatma",
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
    setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc");
  }

  function handleTabChange(tab: string) {
    setActiveTab(tab);
    if (tab === "nilai") setShowNilaiHasil(false);
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

  function getHeaderTitle() {
    if (showLaporanPage) return "Laporan";
    if (selectedSubject) return `${selectedSubject.name} > ${TAB_LABELS[activeTab]}`;
    return "Dashboard > Mata Pelajaran";
  }

  // ============ NILAI AKHIR RENDER ============
  function renderNilaiSummary() {
    const nilais = nilaiData.map((s) => s.akhir);
    const rata = (nilais.reduce((a, b) => a + b, 0) / nilais.length).toFixed(1);
    const lulus = nilaiData.filter((s) => s.lulus).length;
    const stats = [
      { label: "Total Siswa", val: nilaiData.length, icon: <Users className="w-3.5 h-3.5" />, color: "#18181b" },
      { label: "Rata-rata", val: rata, icon: <BarChart2 className="w-3.5 h-3.5" />, color: "#2563eb" },
      { label: "Nilai Tertinggi", val: Math.max(...nilais), icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#059669" },
      { label: `Lulus (≥${kkm})`, val: `${lulus}/${nilaiData.length}`, icon: <CheckCircle className="w-3.5 h-3.5" />, color: "#059669" },
    ];
    return stats.map((s) => (
      <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
        <div><p className="text-lg font-bold text-zinc-900">{s.val}</p><p className="text-[10px] text-slate-400 font-medium">{s.label}</p></div>
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
        <div className="grid grid-cols-4 gap-2 mb-4">
          {grades.map((g) => {
            const count = nilaiData.filter((s) => s.akhir >= g.min && s.akhir <= g.max).length;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            return (
              <div key={g.label} className="text-center p-3 rounded-xl border" style={{ background: g.bg, borderColor: g.border }}>
                <p className="text-2xl font-black" style={{ color: g.color }}>{count}</p>
                <p className="text-[10px] font-bold mt-0.5" style={{ color: g.color }}>Grade {g.label}</p>
                <p className="text-[9px] text-slate-400">{pct}%</p>
              </div>
            );
          })}
        </div>
        <div className="space-y-2">
          {grades.map((g) => {
            const count = nilaiData.filter((s) => s.akhir >= g.min && s.akhir <= g.max).length;
            const pct = total > 0 ? ((count / total) * 100).toFixed(0) : 0;
            const rangeLabel = g.label === "A" ? "90–100" : g.label === "B" ? "80–89" : g.label === "C" ? "70–79" : "< 70";
            return (
              <div key={g.label} className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500 w-16 text-right flex-shrink-0">{rangeLabel}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-[5px]"><div className="h-[5px] rounded-full" style={{ width: `${pct}%`, background: g.color }} /></div>
                <span className="text-[11px] font-bold text-zinc-900 w-5 text-right flex-shrink-0">{count}</span>
                <span className="text-[10px] text-slate-400 w-7 flex-shrink-0">{pct}%</span>
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
        <table className="w-full text-sm" style={{ minWidth: "500px" }}>
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase text-slate-400 w-8">#</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Nama Siswa</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell cursor-pointer" onClick={() => { if (nilaiSortKey === "ujian") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("ujian"); setNilaiSortAsc(false); } }}>Ujian</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell cursor-pointer" onClick={() => { if (nilaiSortKey === "ulangan") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("ulangan"); setNilaiSortAsc(false); } }}>Ulangan</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 cursor-pointer" onClick={() => { if (nilaiSortKey === "akhir") setNilaiSortAsc(!nilaiSortAsc); else { setNilaiSortKey("akhir"); setNilaiSortAsc(false); } }}>Nilai Akhir</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Grade</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell">Status</th>
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
                  <td className="px-4 py-3 text-center"><span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center mx-auto ${rankClass}`}>{rank}</span></td>
                  <td className="px-4 py-3"><p className="font-semibold text-zinc-900 text-[12px] truncate max-w-[120px]">{s.nama}</p><p className="text-[10px] text-slate-400">{s.nisn}</p></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.ujian}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="font-semibold text-[13px] text-zinc-700">{s.ulangan}</span></td>
                  <td className="px-4 py-3"><span className="font-black text-[15px]" style={{ color: akhirColor }}>{s.akhir}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-[10px] font-extrabold ${gradeClass}`}>{s.grade}</span></td>
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
      { label: "Peserta", val: laporanData.length, icon: <Users className="w-3.5 h-3.5" />, color: "#18181b" },
      { label: "Rata-rata", val: rata, icon: <BarChart2 className="w-3.5 h-3.5" />, color: "#2563eb" },
      { label: "Tertinggi", val: Math.max(...nilai), icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#059669" },
      { label: "Terendah", val: Math.min(...nilai), icon: <TrendingUp className="w-3.5 h-3.5 rotate-180" />, color: "#dc2626" },
      { label: "Lulus KKM", val: `${lulus}/${laporanData.length}`, icon: <CheckCircle className="w-3.5 h-3.5" />, color: "#059669" },
      { label: "Pelanggaran", val: `${siswaViol} siswa`, icon: <ShieldAlert className="w-3.5 h-3.5" />, color: "#d97706" },
    ];
    return stats.map((s) => (
      <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>
          {s.icon}
          <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p>
        </div>
        <p className="text-lg font-bold text-zinc-900">{s.val}</p>
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
        <div key={r.label} className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 w-12 text-right flex-shrink-0">{r.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-[5px]"><div className="h-[5px] rounded-full" style={{ width: `${pct}%`, background: r.color }} /></div>
          <span className="text-[11px] font-bold text-zinc-900 w-5 text-right flex-shrink-0">{count}</span>
          <span className="text-[10px] text-slate-400 w-7 flex-shrink-0">{pct}%</span>
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
        <table className="w-full text-sm" style={{ minWidth: "480px" }}>
          <thead className="border-b border-slate-100 bg-slate-50/50">
            <tr>
              <th className="px-4 py-3 text-center text-[10px] font-bold uppercase text-slate-400 w-8">#</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Nama</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Benar</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Salah</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 cursor-pointer" onClick={() => { if (laporanSortKey === "nilai") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("nilai"); setLaporanSortDir("desc"); } }}>Nilai</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell cursor-pointer" onClick={() => { if (laporanSortKey === "pelanggaran") setLaporanSortDir(laporanSortDir === "asc" ? "desc" : "asc"); else { setLaporanSortKey("pelanggaran"); setLaporanSortDir("desc"); } }}>Pelanggaran</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden lg:table-cell">Status</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
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
                  <td className="px-4 py-3 text-center"><span className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center mx-auto ${rankClass}`}>{rank}</span></td>
                  <td className="px-4 py-3"><p className="font-semibold text-zinc-900 text-[12px] truncate max-w-[110px]">{s.nama}</p><p className="text-[10px] text-slate-400 font-mono">{s.nisn}</p></td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-emerald-600 text-[12px]">{s.benar}</span>
                      <div className="bg-slate-100 rounded-full h-[4px] w-8"><div className="h-[4px] rounded-full bg-emerald-400" style={{ width: `${benarPct}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell"><span className="font-bold text-red-500 text-[12px]">{s.salah}</span></td>
                  <td className="px-4 py-3"><span className="font-bold text-[14px]" style={{ color: nilaiColor }}>{s.nilai}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: violColor }} />
                      <span className="font-semibold text-[12px]" style={{ color: violColor }}>{s.pelanggaran}x</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">{s.lulus ? <span className="badge badge-green">LULUS</span> : <span className="badge badge-red">TIDAK LULUS</span>}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => { setSelectedStudent(s); setShowStudentModal(true); }} className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50">Detail</button>
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
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}>
        <Sidebar role="admin" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={getHeaderTitle()}
          showHamburger
          onHamburgerClick={() => setSidebarOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">

          {/* ======= PAGE: DAFTAR MAPEL ======= */}
          {!selectedSubject && !showLaporanPage && (
            <div className="p-4 md:p-8 space-y-5 fade-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-zinc-900">Mata Pelajaran</h1>
                  <p className="text-[13px] text-slate-500 mt-0.5">Kelola semua mata pelajaran yang Anda ampu</p>
                </div>
                <button onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }} className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit">
                  <Plus className="w-4 h-4" />Tambah Mata Pelajaran
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up-1">
                {[
                  { label: "Total Mapel", val: subjects.length, icon: <BookOpen className="w-4 h-4" />, color: "#18181b" },
                  { label: "Total Soal", val: totalSoal, icon: <FileText className="w-4 h-4" />, color: "#2563eb" },
                  { label: "Ujian Aktif", val: totalUjian, icon: <ClipboardList className="w-4 h-4" />, color: "#059669" },
                  { label: "Kelas Diampu", val: subjects.length, icon: <Users className="w-4 h-4" />, color: "#d97706" },
                ].map((s) => (
                  <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.color + "18", color: s.color }}>{s.icon}</div>
                    <div><p className="text-lg md:text-xl font-bold text-zinc-900">{s.val}</p><p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{s.label}</p></div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 fade-up-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter:</span>
                {[
                  { key: "all", label: "Semua" },
                  { key: "XII", label: "Kelas XII" },
                  { key: "XI", label: "Kelas XI" },
                  { key: "X", label: "Kelas X" },
                ].map((f) => (
                  <button key={f.key} onClick={() => setCurrentFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${currentFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-up-2">
                {filteredSubjects.map((subject) => {
                  const c = COLORS[subject.color as keyof typeof COLORS] || COLORS.zinc;
                  return (
                    <div key={subject.id} onClick={() => handleSelectSubject(subject)} className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-slate-300 transition-all group">
                      <div className="h-1.5 rounded-full mb-3" style={{ background: c.dot, width: "36px" }} />
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                          <BookOpen style={{ color: c.icon }} className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-zinc-900 text-[13px] leading-tight truncate">{subject.name}</p>
                          <p className="text-[12px] text-slate-400 font-medium mt-0.5">{subject.kelas}</p>
                        </div>
                      </div>
                      {subject.desc && <p className="text-[12px] text-slate-500 mb-3 truncate">{subject.desc}</p>}
                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <FileText className="text-slate-400 w-3.5 h-3.5" />
                          <span className="text-[12px] text-slate-500 font-medium">{subject.soal} soal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <ClipboardList className="text-slate-400 w-3.5 h-3.5" />
                          <span className="text-[12px] text-slate-500 font-medium">{subject.ujian} ujian</span>
                        </div>
                        <ChevronRight className="ml-auto text-slate-300 group-hover:text-slate-500 transition-all w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
                <div onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }} className="border-2 border-dashed border-slate-200 rounded-[14px] p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[140px]">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <Plus className="text-slate-400 w-5 h-5" />
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
            <div className="p-4 md:p-8 space-y-4 fade-up">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToSubject} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 flex-shrink-0">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Laporan Hasil</p>
                    <span className="badge badge-slate text-[10px]">{laporanExamInfo.nama}</span>
                  </div>
                  <h1 className="text-base md:text-lg font-bold text-zinc-900 truncate">{selectedSubject.name} — {selectedSubject.kelas}</h1>
                  <p className="text-[11px] text-slate-400 mt-0.5">{laporanExamInfo.tanggal} · {laporanExamInfo.durasi} · {laporanExamInfo.totalSoal} soal</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 fade-up-1">
                {renderLaporanSummary()}
              </div>

              <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] fade-up-1">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-zinc-900 text-[13px]">Distribusi Nilai</h3>
                  <span className="text-[10px] text-slate-400">{laporanData.length} siswa</span>
                </div>
                <div className="space-y-2">{renderLaporanDistribution()}</div>
              </div>

              <div className="fade-up-2 space-y-3">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Filter:</span>
                  {[
                    { key: "all", label: "Semua" },
                    { key: "lulus", label: "Lulus" },
                    { key: "gagal", label: "Tidak Lulus" },
                    { key: "viol", label: "Pelanggaran" },
                  ].map((f) => (
                    <button key={f.key} onClick={() => setLaporanFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${laporanFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 text-[13px]">Data Hasil Siswa</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{getSortedLaporanData().length} siswa</span>
                  </div>
                  {renderLaporanTable()}
                  <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">{getSortedLaporanData().length} dari {laporanData.length} siswa</span>
                    <span className="text-[11px] text-slate-500">KKM: <strong className="text-zinc-900">{KKM_DEFAULT}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======= PAGE: DETAIL MAPEL ======= */}
          {selectedSubject && !showLaporanPage && (
            <div className="p-4 md:p-8 space-y-4 fade-up">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={handleBackToMapel} className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 flex-shrink-0">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mata Pelajaran</p>
                    <h1 className="text-base md:text-lg font-bold text-zinc-900 truncate">{selectedSubject.name} — {selectedSubject.kelas}</h1>
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
                  { label: "Total Soal", val: selectedSubject.soal, icon: <FileText className="w-4 h-4 text-slate-400" /> },
                  { label: "Ujian", val: selectedSubject.ujian, icon: <ClipboardList className="w-4 h-4 text-slate-400" /> },
                  { label: "Siswa Aktif", val: 35, icon: <Users className="w-4 h-4 text-slate-400" /> },
                  { label: "Rata-rata", val: "78.5", icon: <TrendingUp className="w-4 h-4 text-slate-400" /> },
                ].map((st) => (
                  <div key={st.label} className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-1">{st.icon}<p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{st.label}</p></div>
                    <p className="text-xl md:text-2xl font-bold text-zinc-900">{st.val}</p>
                  </div>
                ))}
              </div>

              {/* Sub Tabs */}
              <div className="fade-up-1 overflow-x-auto -mx-1 px-1">
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                  {Object.entries(TAB_LABELS).map(([key, label]) => (
                    <button key={key} onClick={() => handleTabChange(key)} className={`px-3 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer border-none ${activeTab === key ? "bg-white text-zinc-900 shadow-sm" : "text-slate-500 hover:text-zinc-900"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab: Ujian */}
              {activeTab === "ujian" && (
                <div className="fade-up-2">
                  <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900 text-[13px]">Daftar Ujian</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{UJIAN_LIST.length} ujian</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" style={{ minWidth: "460px" }}>
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Nama Ujian</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Tanggal</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell">Peserta</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Status</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {UJIAN_LIST.map((ujian) => (
                            <tr key={ujian.id}>
                              <td className="px-4 py-3 font-medium text-zinc-900 text-[13px]">{ujian.nama}</td>
                              <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">{ujian.tanggal}</td>
                              <td className="px-4 py-3 text-slate-500 text-[12px] hidden md:table-cell">{ujian.peserta}</td>
                              <td className="px-4 py-3">
                                {ujian.status === "berlangsung" && (
                                  <span className="badge badge-blue"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block mr-1" />BERLANGSUNG</span>
                                )}
                                {ujian.status === "selesai" && <span className="badge badge-slate">SELESAI</span>}
                                {ujian.status === "draft" && <span className="badge badge-amber">DRAFT</span>}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => openDetailUjian(ujian)}
                                    className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors"
                                  >
                                    Detail
                                  </button>
                                  {ujian.status === "selesai" && (
                                    <button
                                      onClick={() => openLaporan(ujian.nama, ujian.tanggal, ujian.durasi, String(ujian.totalSoal))}
                                      className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                      Laporan
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
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
                    <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900 text-[13px]">Ulangan Harian</h3>
                      <span className="text-[11px] text-slate-400 font-medium">2 ulangan</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" style={{ minWidth: "400px" }}>
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Nama Ulangan</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Topik</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Status</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          <tr>
                            <td className="px-4 py-3 font-medium text-zinc-900 text-[13px]">UH Trigonometri</td>
                            <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">Bab 4 – Trigonometri</td>
                            <td className="px-4 py-3"><span className="badge badge-green">AKTIF</span></td>
                            <td className="px-4 py-3 text-right"><button className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50">Detail</button></td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 font-medium text-zinc-900 text-[13px]">UH Fungsi Invers</td>
                            <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">Bab 3 – Fungsi</td>
                            <td className="px-4 py-3"><span className="badge badge-slate">SELESAI</span></td>
                            <td className="px-4 py-3 text-right"><button onClick={() => openLaporan("UH Fungsi Invers", "02 Mar 2026", "45 menit", "25")} className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50">Laporan</button></td>
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
                    {[
                      { title: "Latihan Limit Fungsi", info: "20 soal · 30 menit · 24 siswa", status: "badge-green", statusLabel: "AKTIF", color: "violet", onAction: () => {}, actionLabel: "Detail" },
                      { title: "Latihan Integral", info: "15 soal · 20 menit · 30 siswa", status: "badge-slate", statusLabel: "SELESAI", color: "blue", onAction: () => openLaporan("Latihan Integral", "20 Feb 2026", "20 menit", "15"), actionLabel: "Laporan" },
                    ].map((item) => (
                      <div key={item.title} className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}><Dumbbell className={`text-${item.color}-600 w-5 h-5`} /></div>
                          <span className={`badge ${item.status}`}>{item.statusLabel}</span>
                        </div>
                        <p className="font-semibold text-zinc-900 text-[13px] mb-1">{item.title}</p>
                        <p className="text-[12px] text-slate-400">{item.info}</p>
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <button onClick={item.onAction} className="w-full h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">{item.actionLabel}</button>
                        </div>
                      </div>
                    ))}
                    <div onClick={() => setShowContentModal(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 min-h-[130px]">
                      <Plus className="w-6 h-6 text-slate-300" />
                      <p className="text-[13px] text-slate-400 font-medium">Buat Latihan Baru</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Kuis */}
              {activeTab === "kuis" && (
                <div className="fade-up-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { title: "Quiz Fungsi Komposisi", info: "15 soal · 20 menit · 32/32 peserta", status: "badge-slate", statusLabel: "SELESAI", color: "amber", onAction: () => openLaporan("Quiz Fungsi Komposisi", "05 Mar 2026", "20 menit", "15"), actionLabel: "Laporan" },
                      { title: "Quiz Matriks", info: "10 soal · 15 menit", status: "badge-amber", statusLabel: "DRAFT", color: "emerald", onAction: () => {}, actionLabel: "Preview" },
                    ].map((item) => (
                      <div key={item.title} className="bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 bg-${item.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}><Zap className={`text-${item.color}-600 w-5 h-5`} /></div>
                          <span className={`badge ${item.status}`}>{item.statusLabel}</span>
                        </div>
                        <p className="font-semibold text-zinc-900 text-[13px] mb-1">{item.title}</p>
                        <p className="text-[12px] text-slate-400">{item.info}</p>
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <button onClick={item.onAction} className="w-full h-7 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50">{item.actionLabel}</button>
                        </div>
                      </div>
                    ))}
                    <div onClick={() => setShowContentModal(true)} className="border-2 border-dashed border-slate-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 min-h-[130px]">
                      <Plus className="w-6 h-6 text-slate-300" />
                      <p className="text-[13px] text-slate-400 font-medium">Buat Kuis Baru</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Bank Soal */}
              {activeTab === "soal" && (
                <div className="fade-up-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input type="text" placeholder="Cari soal..." className="h-9 pl-8 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-full sm:w-48" />
                      </div>
                      <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none">
                        <option value="">Semua Tipe</option>
                        <option>Pilihan Ganda</option>
                        <option>Essay</option>
                      </select>
                    </div>
                    <button onClick={() => setShowContentModal(true)} className="h-9 px-4 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5 flex-shrink-0">
                      <Plus className="w-3.5 h-3.5" /> Soal Baru
                    </button>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="px-4 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900 text-[13px]">Bank Soal</h3>
                      <span className="text-[11px] text-slate-400 font-medium">{selectedSubject.soal} soal</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" style={{ minWidth: "400px" }}>
                        <thead className="border-b border-slate-100 bg-slate-50/50">
                          <tr>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 w-8">#</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Pertanyaan</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Topik</th>
                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell">Tipe</th>
                            <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {[
                            { no: "01", q: "Tentukan nilai lim x→2 (x²+3x−5)", topik: "Limit Fungsi", tipe: "Pilihan Ganda", tipeBadge: "badge-blue" },
                            { no: "02", q: "f(x) = 2x² + 3x − 5. Tentukan f(3)", topik: "Fungsi Kuadrat", tipe: "Pilihan Ganda", tipeBadge: "badge-blue" },
                            { no: "03", q: "Jelaskan konsep turunan dan aplikasinya", topik: "Turunan", tipe: "Essay", tipeBadge: "badge-amber" },
                            { no: "04", q: "Hitung integral ∫(3x²+2x) dx", topik: "Integral", tipe: "Pilihan Ganda", tipeBadge: "badge-blue" },
                          ].map((item) => (
                            <tr key={item.no}>
                              <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">{item.no}</td>
                              <td className="px-4 py-3 font-medium text-zinc-900 text-[12px] max-w-[150px] truncate">{item.q}</td>
                              <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">{item.topik}</td>
                              <td className="px-4 py-3 hidden md:table-cell"><span className={`badge ${item.tipeBadge}`}>{item.tipe}</span></td>
                              <td className="px-4 py-3 text-right">
                                <button className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50">Edit</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Nilai Akhir */}
              {activeTab === "nilai" && (
                <div className="fade-up-2 space-y-4">
                  <div className="bg-white border border-slate-200 rounded-[14px] p-4 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="font-bold text-zinc-900 text-[14px]">Konfigurasi Rumus Nilai Akhir</h3>
                        <p className="text-[11px] text-slate-500 mt-0.5">Total bobot harus <strong>100%</strong>.</p>
                      </div>
                      <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-[13px] font-bold ${isBobotValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{bobotTotal}%</div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "Ujian", desc: "2 ujian tersedia", color: "violet", icon: <ClipboardList className="w-4 h-4 text-violet-600" />, val: bobotUjian, set: setBobotUjian },
                        { label: "Ulangan Harian", desc: "Rata-rata semua ulangan", color: "blue", icon: <Book className="w-4 h-4 text-blue-600" />, val: bobotUlangan, set: setBobotUlangan },
                        { label: "Latihan", desc: "Rata-rata semua latihan", color: "emerald", icon: <Dumbbell className="w-4 h-4 text-emerald-600" />, val: bobotLatihan, set: setBobotLatihan },
                        { label: "Kuis", desc: "Rata-rata semua kuis", color: "amber", icon: <Zap className="w-4 h-4 text-amber-600" />, val: bobotKuis, set: setBobotKuis },
                      ].map((item) => (
                        <div key={item.label} className={`p-3 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-7 h-7 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>{item.icon}</div>
                              <div>
                                <p className="font-semibold text-zinc-900 text-[12px]">{item.label}</p>
                                <p className="text-[10px] text-slate-400">{item.desc}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <input type="number" value={item.val} onChange={(e) => item.set(parseInt(e.target.value) || 0)} className="w-16 h-8 text-center border-[1.5px] border-slate-200 rounded-lg text-[12px] font-semibold text-zinc-900 bg-white focus:border-zinc-900 outline-none" />
                              <span className="text-[12px] font-semibold text-slate-500">%</span>
                            </div>
                          </div>
                          {item.label === "Ujian" && (
                            <div className="pl-9 space-y-1.5 pt-2 border-t border-violet-100 mt-2">
                              {[
                                { label: "UAS Matematika Peminatan", val: subBobotUjian1, set: setSubBobotUjian1 },
                                { label: "UTS Fungsi Komposisi", val: subBobotUjian2, set: setSubBobotUjian2 },
                              ].map((sub) => (
                                <div key={sub.label} className="flex items-center justify-between">
                                  <span className="text-[11px] text-slate-600 truncate max-w-[140px]">{sub.label}</span>
                                  <div className="flex items-center gap-1">
                                    <input type="number" value={sub.val} onChange={(e) => sub.set(parseInt(e.target.value) || 0)} className="w-14 h-7 text-center border border-slate-200 rounded-lg text-[11px] font-semibold text-zinc-900 bg-white focus:border-zinc-900 outline-none" />
                                    <span className="text-[10px] text-slate-400">%</span>
                                  </div>
                                </div>
                              ))}
                              <p className={`text-[10px] font-semibold ${subUjianTotal === 100 ? "text-emerald-600" : "text-red-500"}`}>Sub-total: {subUjianTotal}%</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-3 bg-slate-900 rounded-xl">
                      <p className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wider">Preview Rumus</p>
                      <p className="text-[12px] text-white font-mono leading-relaxed">
                        NA = {bobotUjian > 0 && `Ujian×${bobotUjian}%`}{bobotUjian > 0 && bobotUlangan > 0 && " + "}{bobotUlangan > 0 && `UH×${bobotUlangan}%`}{bobotUlangan > 0 && bobotLatihan > 0 && " + "}{bobotLatihan > 0 && `Latihan×${bobotLatihan}%`}{bobotLatihan > 0 && bobotKuis > 0 && " + "}{bobotKuis > 0 && `Kuis×${bobotKuis}%`}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-[12px] font-semibold text-slate-600">KKM:</label>
                        <input type="number" value={kkm} onChange={(e) => setKkm(parseInt(e.target.value) || 0)} className="w-16 h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 outline-none" />
                      </div>
                      <button onClick={hitungNilaiAkhir} disabled={!isBobotValid} className="h-10 px-5 bg-zinc-900 text-white text-[13px] font-bold rounded-xl hover:bg-zinc-800 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto justify-center">
                        <Calculator className="w-4 h-4" />Hitung Nilai Akhir
                      </button>
                    </div>

                    {!isBobotValid && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
                        <AlertCircle className="text-red-500 w-4 h-4 flex-shrink-0" />
                        <p className="text-[11px] text-red-600 font-medium">Total bobot harus 100%. Sesuaikan sebelum menghitung.</p>
                      </div>
                    )}
                  </div>

                  {showNilaiHasil && (
                    <div id="nilai-hasil-section" className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{renderNilaiSummary()}</div>
                      <div className="bg-white border border-slate-200 rounded-[14px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <h3 className="font-semibold text-zinc-900 text-[13px] mb-3">Distribusi Nilai Akhir</h3>
                        {renderNilaiDistribution()}
                      </div>
                      <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                        <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
                          <h3 className="font-semibold text-zinc-900 text-[13px]">Rekap Nilai Akhir Siswa</h3>
                          <select value={nilaiFilter} onChange={(e) => setNilaiFilter(e.target.value)} className="h-8 px-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none">
                            <option value="all">Semua</option>
                            <option value="lulus">Lulus</option>
                            <option value="tidak">Tidak Lulus</option>
                          </select>
                        </div>
                        {renderNilaiTable()}
                        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400">{getSortedNilaiData().length} dari {nilaiData.length} siswa</span>
                          <span className="text-[11px] text-slate-500">KKM: <strong>{kkm}</strong></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>{/* end scrollable */}
      </div>{/* end flex-1 flex-col */}

      {/* ======= MODAL: DETAIL UJIAN ======= */}
      {showDetailUjianModal && selectedUjian && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailUjianModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-4 h-4 text-zinc-600" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-zinc-900 leading-tight">Detail Ujian</h3>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Informasi & Akses Ujian</p>
                </div>
              </div>
              <button onClick={() => setShowDetailUjianModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Info Ujian */}
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nama Ujian</p>
                  <p className="font-bold text-zinc-900 text-[14px]">{selectedUjian.nama}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Tanggal</p>
                      <p className="text-[12px] font-semibold text-zinc-700">{selectedUjian.tanggal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Durasi</p>
                      <p className="text-[12px] font-semibold text-zinc-700">{selectedUjian.durasi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Total Soal</p>
                      <p className="text-[12px] font-semibold text-zinc-700">{selectedUjian.totalSoal} soal</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">Peserta</p>
                      <p className="text-[12px] font-semibold text-zinc-700">{selectedUjian.peserta}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Status:</p>
                  {selectedUjian.status === "berlangsung" && (
                    <span className="badge badge-blue"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block mr-1" />BERLANGSUNG</span>
                  )}
                  {selectedUjian.status === "selesai" && <span className="badge badge-slate">SELESAI</span>}
                  {selectedUjian.status === "draft" && <span className="badge badge-amber">DRAFT</span>}
                </div>
              </div>

              {/* Link Akses Ujian */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-[12px] font-bold text-zinc-900">Link Akses Ujian (Siswa)</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-2">URL Akses</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 bg-white border border-blue-200 rounded-lg px-3 py-2">
                      <p className="text-[11px] font-mono text-blue-700 truncate">
                        {getAksesUjianUrl(selectedUjian.id)}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getAksesUjianUrl(selectedUjian.id), "link")}
                      className={`flex-shrink-0 h-9 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${copiedLink ? "bg-emerald-500 text-white" : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? "Disalin!" : "Salin"}
                    </button>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <a
                      href={getAksesUjianUrl(selectedUjian.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Buka di tab baru
                    </a>
                  </div>
                </div>
              </div>

              {/* Token Ujian */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-[12px] font-bold text-zinc-900">Token Ujian</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-[10px] text-amber-600 font-semibold uppercase tracking-wider mb-2">Kode Token</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 bg-white border border-amber-200 rounded-lg px-3 py-2 flex items-center gap-2">
                      <p className={`text-[13px] font-mono font-bold tracking-widest flex-1 ${showToken ? "text-amber-700" : "text-amber-200 select-none"}`}>
                        {showToken ? selectedUjian.token : selectedUjian.token.replace(/[A-Z0-9]/g, "•")}
                      </p>
                      <button
                        onClick={() => setShowToken(!showToken)}
                        className="flex-shrink-0 text-amber-400 hover:text-amber-600 transition-colors"
                        title={showToken ? "Sembunyikan token" : "Tampilkan token"}
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedUjian.token, "token")}
                      className={`flex-shrink-0 h-9 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${copiedToken ? "bg-emerald-500 text-white" : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"}`}
                    >
                      {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedToken ? "Disalin!" : "Salin"}
                    </button>
                  </div>
                  <p className="text-[10px] text-amber-600 mt-2">
                    ⚠️ Bagikan token ini hanya kepada siswa yang berhak mengikuti ujian.
                  </p>
                </div>
              </div>

              {/* Instruksi */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
                <p className="text-[11px] font-bold text-zinc-900 mb-2">Cara Siswa Mengakses Ujian:</p>
                {[
                  "Buka link akses ujian di browser",
                  "Login dengan akun siswa masing-masing",
                  "Masukkan token ujian yang diberikan",
                  "Kerjakan ujian sesuai batas waktu",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-[11px] text-slate-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 pt-0 flex gap-3">
              <button
                onClick={() => setShowDetailUjianModal(false)}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50 transition-colors"
              >
                Tutup
              </button>
              {selectedUjian.status === "selesai" && (
                <button
                  onClick={() => {
                    setShowDetailUjianModal(false);
                    openLaporan(selectedUjian.nama, selectedUjian.tanggal, selectedUjian.durasi, String(selectedUjian.totalSoal));
                  }}
                  className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart2 className="w-4 h-4" />
                  Lihat Laporan
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL: TAMBAH MATA PELAJARAN ======= */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Tambah Mata Pelajaran</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama Mata Pelajaran <span className="text-red-500">*</span></label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Matematika Peminatan" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Kelas <span className="text-red-500">*</span></label>
                <input type="text" value={newKelas} onChange={(e) => setNewKelas(e.target.value)} placeholder="e.g. XII IPA 2" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Deskripsi</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={2} placeholder="Deskripsi singkat..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Warna Tema</label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(COLORS).map(([key, c]) => (
                    <button key={key} onClick={() => setSelectedColor(key)} className={`w-7 h-7 rounded-full transition-all ${selectedColor === key ? "ring-2 ring-offset-2" : ""}`} style={{ background: c.hex }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowAddModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">Batal</button>
              <button onClick={saveSubject} className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL: TAMBAH KONTEN ======= */}
      {showContentModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowContentModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl z-10">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Tambah {TAB_LABELS[activeTab]}</h3>
              <button onClick={() => setShowContentModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
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
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowContentModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">Batal</button>
              <button onClick={() => setShowContentModal(false)} className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800">Simpan</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= MODAL: DETAIL SISWA ======= */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowStudentModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="text-base font-bold text-zinc-900">Detail Siswa</h3>
              <button onClick={() => setShowStudentModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                <div className="w-11 h-11 rounded-full bg-zinc-900 text-white flex items-center justify-center text-base font-bold flex-shrink-0">{selectedStudent.nama.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 truncate">{selectedStudent.nama}</p>
                  <p className="text-[11px] text-slate-400">NISN: {selectedStudent.nisn} · {selectedStudent.kelas}</p>
                  <div className="mt-1">{selectedStudent.lulus ? <span className="badge badge-green">LULUS</span> : <span className="badge badge-red">TIDAK LULUS</span>}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: selectedStudent.nilai >= 90 ? "#059669" : selectedStudent.nilai >= 80 ? "#10b981" : selectedStudent.nilai >= 70 ? "#2563eb" : "#dc2626" }}>{selectedStudent.nilai}</p>
                  <p className="text-[10px] text-slate-400">Nilai</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                  <p className="text-xl font-bold text-emerald-600">{selectedStudent.benar}</p>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Benar</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl text-center border border-red-100">
                  <p className="text-xl font-bold text-red-500">{selectedStudent.salah}</p>
                  <p className="text-[10px] text-red-500 font-semibold mt-0.5">Salah</p>
                </div>
                <div className={`p-3 rounded-xl text-center border ${selectedStudent.pelanggaran > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
                  <p className={`text-xl font-bold ${selectedStudent.pelanggaran > 0 ? "text-amber-600" : "text-slate-400"}`}>{selectedStudent.pelanggaran}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${selectedStudent.pelanggaran > 0 ? "text-amber-600" : "text-slate-400"}`}>Pelanggaran</p>
                </div>
              </div>
              {selectedStudent.catatan.length > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-center gap-2 mb-2"><ShieldAlert className="text-amber-600 w-4 h-4" /><p className="text-[12px] font-semibold text-amber-700">{selectedStudent.pelanggaran} Pelanggaran Terdeteksi</p></div>
                  <ul className="space-y-1">{selectedStudent.catatan.map((c, i) => <li key={i} className="text-[11px] text-amber-700">• {c}</li>)}</ul>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600 w-4 h-4" /><p className="text-[12px] font-semibold text-emerald-700">Tidak ada pelanggaran terdeteksi</p>
                </div>
              )}
              <p className="text-[10px] text-slate-400 text-center">KKM: {KKM_DEFAULT} · {laporanExamInfo.nama}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}