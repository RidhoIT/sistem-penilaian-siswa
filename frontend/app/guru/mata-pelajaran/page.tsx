"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Upload,
  Shuffle,
  ListOrdered,
  Save,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const COLORS = {
  zinc: { bg: "#f4f4f5", icon: "#18181b", dot: "#52525b", hex: "#18181b" },
  blue: { bg: "#eff6ff", icon: "#2563eb", dot: "#3b82f6", hex: "#3b82f6" },
  violet: { bg: "#f5f3ff", icon: "#7c3aed", dot: "#8b5cf6", hex: "#8b5cf6" },
  emerald: { bg: "#ecfdf5", icon: "#059669", dot: "#10b981", hex: "#10b981" },
  amber: { bg: "#fffbeb", icon: "#d97706", dot: "#f59e0b", hex: "#f59e0b" },
  red: { bg: "#fef2f2", icon: "#dc2626", dot: "#ef4444", hex: "#ef4444" },
  cyan: { bg: "#ecfeff", icon: "#0891b2", dot: "#06b6d4", hex: "#06b6d4" },
  pink: { bg: "#fdf2f8", icon: "#be185d", dot: "#ec4899", hex: "#ec4899" },
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

interface SoalItem {
  id: string;
  pertanyaan: string;
  tipe: "pg" | "essay";
  opsi: string[];
  jawaban: string;
  topik: string;
  gambar?: string;
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
  soalList?: SoalItem[];
  soalAcak?: boolean; // ← NEW
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

// ─────────────────────────────────────────────────────────────────────────────
// Draft key helper  (unik per tab agar tidak tabrakan)
// ─────────────────────────────────────────────────────────────────────────────
const DRAFT_KEY = (tab: string) => `add_content_draft_${tab}`;

interface DraftData {
  step: 1 | 2;
  nama: string;
  tanggal: string;
  durasi: string;
  soalAcak: boolean;
  soalList: SoalItem[];
  // form soal sementara
  soalPertanyaan: string;
  soalTipe: "pg" | "essay";
  soalTopik: string;
  soalOpsi: string[];
  soalJawaban: string;
  soalGambar?: string;
  editingId: string | null;
}

function saveDraft(tab: string, data: DraftData) {
  try {
    sessionStorage.setItem(DRAFT_KEY(tab), JSON.stringify(data));
  } catch (_) {}
}

function loadDraft(tab: string): DraftData | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY(tab));
    return raw ? (JSON.parse(raw) as DraftData) : null;
  } catch (_) {
    return null;
  }
}

function clearDraft(tab: string) {
  try {
    sessionStorage.removeItem(DRAFT_KEY(tab));
  } catch (_) {}
}

const UJIAN_LIST_DEFAULT: UjianDetail[] = [
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
    soalAcak: true,
    soalList: [
      {
        id: "s1",
        pertanyaan: "Nilai lim x→2 (x²+3x−5) adalah...",
        tipe: "pg",
        opsi: ["5", "7", "9", "11"],
        jawaban: "7",
        topik: "Limit Fungsi",
      },
      {
        id: "s2",
        pertanyaan: "f(x) = 2x² + 3x − 5. Tentukan f(3)",
        tipe: "pg",
        opsi: ["22", "25", "28", "31"],
        jawaban: "22",
        topik: "Fungsi Kuadrat",
      },
    ],
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
    soalAcak: false,
    soalList: [],
  },
];

function generateSiswaData(
  examName: string,
  totalSoal: number,
  kelas: string
) {
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
    ["Copy-paste terdeteksi 1x","Buka tab lain 1x"],
    ["Keluar fullscreen 2x","Screenshot terdeteksi 1x"],
    ["Buka tab lain 2x"],
    ["Screenshot terdeteksi 1x"],
    ["Keluar fullscreen 1x"],
    ["Buka tab lain 3x","Copy-paste 2x"],
    ["Buka tab lain 1x","Screenshot 1x"],
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

// ─────────────────────────────────────────────────────────────────────────────
// SoalImageUpload
// ─────────────────────────────────────────────────────────────────────────────
function SoalImageUpload({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (base64: string | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      onChange(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleRemove() {
    onChange(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
        Gambar Soal{" "}
        <span className="text-slate-400 font-normal">(opsional)</span>
      </label>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          <img
            src={value}
            alt="Gambar soal"
            className="w-full max-h-48 object-contain"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 px-3 bg-white rounded-lg text-[11px] font-semibold text-zinc-700 shadow flex items-center gap-1.5 hover:bg-slate-50"
            >
              <Upload className="w-3.5 h-3.5" /> Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="h-8 px-3 bg-red-500 rounded-lg text-[11px] font-semibold text-white shadow flex items-center gap-1.5 hover:bg-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" /> Hapus
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-slate-300 hover:bg-slate-50 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-slate-200 flex items-center justify-center transition-colors">
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-center">
            <p className="text-[12px] font-semibold text-slate-500">
              Klik untuk upload gambar
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              PNG, JPG, GIF · Maks 5MB
            </p>
          </div>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AddContentModal  ← IMPROVED: soal acak + draft auto-save
// ─────────────────────────────────────────────────────────────────────────────
function AddContentModal({
  activeTab,
  onClose,
  onSave,
}: {
  activeTab: string;
  onClose: () => void;
  onSave: (data: {
    nama: string;
    tanggal: string;
    durasi: string;
    soalAcak: boolean;
    soalList: SoalItem[];
  }) => void;
}) {
  const label = TAB_LABELS[activeTab] || "Konten";

  // ── load draft on mount ──────────────────────────────────────────────────
  const draft = loadDraft(activeTab);

  const [step, setStep] = useState<1 | 2>(draft?.step ?? 1);
  const [nama, setNama] = useState(draft?.nama ?? "");
  const [tanggal, setTanggal] = useState(draft?.tanggal ?? "");
  const [durasi, setDurasi] = useState(draft?.durasi ?? "");
  const [soalAcak, setSoalAcak] = useState<boolean>(draft?.soalAcak ?? true);
  const [soalList, setSoalList] = useState<SoalItem[]>(draft?.soalList ?? []);

  // soal form state
  const [soalPertanyaan, setSoalPertanyaan] = useState(draft?.soalPertanyaan ?? "");
  const [soalTipe, setSoalTipe] = useState<"pg" | "essay">(draft?.soalTipe ?? "pg");
  const [soalTopik, setSoalTopik] = useState(draft?.soalTopik ?? "");
  const [soalOpsi, setSoalOpsi] = useState<string[]>(draft?.soalOpsi ?? ["","","",""]);
  const [soalJawaban, setSoalJawaban] = useState(draft?.soalJawaban ?? "");
  const [soalGambar, setSoalGambar] = useState<string | undefined>(draft?.soalGambar);
  const [editingId, setEditingId] = useState<string | null>(draft?.editingId ?? null);

  // indicator draft tersimpan
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(
    draft ? new Date() : null
  );

  // ── auto-save draft setiap kali state berubah ────────────────────────────
  const persistDraft = useCallback(() => {
    const data: DraftData = {
      step, nama, tanggal, durasi, soalAcak, soalList,
      soalPertanyaan, soalTipe, soalTopik, soalOpsi, soalJawaban,
      soalGambar, editingId,
    };
    saveDraft(activeTab, data);
    setDraftSavedAt(new Date());
  }, [
    step, nama, tanggal, durasi, soalAcak, soalList,
    soalPertanyaan, soalTipe, soalTopik, soalOpsi, soalJawaban,
    soalGambar, editingId, activeTab,
  ]);

  useEffect(() => {
    const timer = setTimeout(persistDraft, 400); // debounce 400ms
    return () => clearTimeout(timer);
  }, [persistDraft]);

  // ── helpers ──────────────────────────────────────────────────────────────
  function resetSoalForm() {
    setSoalPertanyaan("");
    setSoalTopik("");
    setSoalOpsi(["", "", "", ""]);
    setSoalJawaban("");
    setSoalTipe("pg");
    setSoalGambar(undefined);
  }

  function handleNextStep() {
    if (!nama.trim()) return;
    setStep(2);
  }

  function handleAddSoal() {
    if (!soalPertanyaan.trim()) return;
    const newSoal: SoalItem = {
      id: editingId || Date.now().toString(),
      pertanyaan: soalPertanyaan.trim(),
      tipe: soalTipe,
      opsi: soalTipe === "pg" ? soalOpsi.filter(Boolean) : [],
      jawaban: soalJawaban,
      topik: soalTopik.trim(),
      gambar: soalGambar,
    };
    if (editingId) {
      setSoalList((prev) => prev.map((s) => (s.id === editingId ? newSoal : s)));
      setEditingId(null);
    } else {
      setSoalList((prev) => [...prev, newSoal]);
    }
    resetSoalForm();
  }

  function handleEditSoal(s: SoalItem) {
    setEditingId(s.id);
    setSoalPertanyaan(s.pertanyaan);
    setSoalTipe(s.tipe);
    setSoalTopik(s.topik);
    setSoalOpsi(s.tipe === "pg" ? [...s.opsi, "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
    setSoalJawaban(s.jawaban);
    setSoalGambar(s.gambar);
  }

  function handleDeleteSoal(id: string) {
    setSoalList((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSave() {
    clearDraft(activeTab);
    onSave({ nama, tanggal, durasi, soalAcak, soalList });
  }

  function handleClose() {
    // draft tetap tersimpan, user bisa lanjut nanti
    onClose();
  }

  function handleDiscardDraft() {
    clearDraft(activeTab);
    setStep(1);
    setNama(""); setTanggal(""); setDurasi("");
    setSoalAcak(true); setSoalList([]);
    resetSoalForm(); setEditingId(null);
    setDraftSavedAt(null);
  }

  const hasDraftData = nama.trim() !== "" || soalList.length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl z-10 max-h-[92vh] flex flex-col">

        {/* ── Header ── */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900">Tambah {label}</h3>
                {/* Draft indicator */}
                {draftSavedAt && hasDraftData && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    <Save className="w-2.5 h-2.5" />
                    Draft tersimpan
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-5 h-1.5 rounded-full transition-colors ${step === 1 ? "bg-zinc-900" : "bg-zinc-200"}`} />
                <span className={`w-5 h-1.5 rounded-full transition-colors ${step === 2 ? "bg-zinc-900" : "bg-zinc-200"}`} />
                <p className="text-[10px] text-slate-400 ml-1">Langkah {step} dari 2</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasDraftData && (
              <button
                onClick={handleDiscardDraft}
                className="text-[10px] font-semibold text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                title="Hapus draft & mulai ulang"
              >
                Hapus draft
              </button>
            )}
            <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Step 1: Info Dasar */}
          {step === 1 && (
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
                  Nama {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder={`e.g. UAS ${label} Semester 2`}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Tanggal</label>
                  <input
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Durasi (menit)</label>
                  <input
                    type="number"
                    value={durasi}
                    onChange={(e) => setDurasi(e.target.value)}
                    placeholder="60"
                    className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                  />
                </div>
              </div>

              {/* ── Urutan Soal ── */}
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-2 block">
                  Urutan Soal untuk Siswa
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Acak */}
                  <button
                    type="button"
                    onClick={() => setSoalAcak(true)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      soalAcak
                        ? "border-violet-500 bg-violet-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        soalAcak ? "bg-violet-100" : "bg-slate-100"
                      }`}
                    >
                      <Shuffle className={`w-4 h-4 ${soalAcak ? "text-violet-600" : "text-slate-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-bold ${soalAcak ? "text-violet-700" : "text-zinc-700"}`}>
                        Soal Acak
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                        Urutan soal diacak berbeda tiap siswa — mencegah menyontek
                      </p>
                      {soalAcak && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" /> Aktif
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Berurutan */}
                  <button
                    type="button"
                    onClick={() => setSoalAcak(false)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      !soalAcak
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        !soalAcak ? "bg-blue-100" : "bg-slate-100"
                      }`}
                    >
                      <ListOrdered className={`w-4 h-4 ${!soalAcak ? "text-blue-600" : "text-slate-400"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-bold ${!soalAcak ? "text-blue-700" : "text-zinc-700"}`}>
                        Soal Berurutan
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                        Semua siswa mengerjakan soal dengan urutan yang sama
                      </p>
                      {!soalAcak && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full">
                          <Check className="w-2.5 h-2.5" /> Aktif
                        </span>
                      )}
                    </div>
                  </button>
                </div>

              
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-2">
                <FileText className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-blue-700">
                  Di langkah berikutnya, Anda bisa langsung menambahkan soal-soal untuk{" "}
                  {label.toLowerCase()} ini.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Tambah Soal */}
          {step === 2 && (
            <div className="p-5 space-y-4">
              {/* Info mode soal acak */}
              <div
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-[11px] font-semibold ${
                  soalAcak
                    ? "bg-violet-50 border-violet-200 text-violet-700"
                    : "bg-blue-50 border-blue-200 text-blue-700"
                }`}
              >
                {soalAcak ? (
                  <Shuffle className="w-3.5 h-3.5 flex-shrink-0" />
                ) : (
                  <ListOrdered className="w-3.5 h-3.5 flex-shrink-0" />
                )}
                <span>
                  Mode: <strong>{soalAcak ? "Soal Acak" : "Soal Berurutan"}</strong>
                  {" · "}
                  <button
                    className="underline font-semibold opacity-70 hover:opacity-100"
                    onClick={() => setStep(1)}
                  >
                    Ubah
                  </button>
                </span>
              </div>

              {soalList.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h4 className="font-semibold text-zinc-900 text-[13px]">Soal Ditambahkan</h4>
                    <span className="text-[11px] text-slate-400">{soalList.length} soal</span>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {soalList.map((s, i) => (
                      <div
                        key={s.id}
                        className={`px-4 py-3 flex items-start gap-3 ${editingId === s.id ? "bg-amber-50" : ""}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-medium text-zinc-900 truncate">{s.pertanyaan}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                s.tipe === "pg"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {s.tipe === "pg" ? "Pilihan Ganda" : "Essay"}
                            </span>
                            {s.topik && (
                              <span className="text-[10px] text-slate-400">{s.topik}</span>
                            )}
                            {s.gambar && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-violet-500 font-semibold">
                                <ImageIcon className="w-3 h-3" /> Gambar
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleEditSoal(s)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSoal(s.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form soal */}
              <div
                className={`border rounded-[14px] p-4 space-y-3 ${
                  editingId
                    ? "border-amber-200 bg-amber-50/50"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-zinc-900 text-[13px]">
                    {editingId ? "Edit Soal" : "Tambah Soal Baru"}
                  </h4>
                  {editingId && (
                    <button
                      onClick={() => { setEditingId(null); resetSoalForm(); }}
                      className="text-[11px] text-slate-500 hover:text-zinc-900 underline"
                    >
                      Batal edit
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                    Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={soalPertanyaan}
                    onChange={(e) => setSoalPertanyaan(e.target.value)}
                    rows={2}
                    placeholder="Tuliskan pertanyaan soal di sini..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none bg-white"
                  />
                </div>

                <SoalImageUpload value={soalGambar} onChange={setSoalGambar} />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tipe Soal</label>
                    <select
                      value={soalTipe}
                      onChange={(e) => setSoalTipe(e.target.value as "pg" | "essay")}
                      className="w-full h-9 px-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none bg-white"
                    >
                      <option value="pg">Pilihan Ganda</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Topik</label>
                    <input
                      type="text"
                      value={soalTopik}
                      onChange={(e) => setSoalTopik(e.target.value)}
                      placeholder="e.g. Limit Fungsi"
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 bg-white"
                    />
                  </div>
                </div>

                {soalTipe === "pg" && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-500 block">Opsi Jawaban</label>
                    {soalOpsi.map((opsi, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full border-[1.5px] border-slate-200 bg-white text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <input
                          type="text"
                          value={opsi}
                          onChange={(e) => {
                            const next = [...soalOpsi];
                            next[i] = e.target.value;
                            setSoalOpsi(next);
                          }}
                          placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                          className="flex-1 h-8 px-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 bg-white"
                        />
                        <input
                          type="radio"
                          name="jawaban-benar-add"
                          checked={soalJawaban === opsi && opsi !== ""}
                          onChange={() => setSoalJawaban(opsi)}
                          title="Tandai sebagai jawaban benar"
                          className="flex-shrink-0 accent-emerald-600"
                        />
                      </div>
                    ))}
                    {soalJawaban && (
                      <p className="text-[10px] text-emerald-600 font-medium">
                        ✓ Jawaban benar: {soalJawaban}
                      </p>
                    )}
                  </div>
                )}

                {soalTipe === "essay" && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                      Kunci Jawaban (Opsional)
                    </label>
                    <textarea
                      value={soalJawaban}
                      onChange={(e) => setSoalJawaban(e.target.value)}
                      rows={2}
                      placeholder="Tuliskan kunci jawaban essay..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none bg-white"
                    />
                  </div>
                )}

                <button
                  onClick={handleAddSoal}
                  disabled={!soalPertanyaan.trim()}
                  className="w-full h-9 bg-zinc-900 text-white rounded-lg text-[12px] font-semibold hover:bg-zinc-800 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {editingId ? "Simpan Perubahan Soal" : "Tambah Soal"}
                </button>
              </div>

              {soalList.length === 0 && (
                <p className="text-[11px] text-slate-400 text-center py-2">
                  Belum ada soal. Anda juga bisa menyimpan tanpa soal dan menambahkan soal nanti.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="p-5 pt-3 shrink-0 border-t border-slate-100">
          {step === 1 ? (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
              >
                Tutup & Simpan Draft
              </button>
              <button
                onClick={handleNextStep}
                disabled={!nama.trim()}
                className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lanjut: Tambah Soal <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
              >
                Tutup & Simpan Draft
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Simpan {TAB_LABELS[activeTab]} ({soalList.length} soal)
              </button>
            </div>
          )}

          {/* hint draft */}
          {hasDraftData && (
            <p className="text-center text-[10px] text-slate-400 mt-2">
              💾 Data Anda tersimpan otomatis — aman jika modal ditutup
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KelolaSoalModal
// ─────────────────────────────────────────────────────────────────────────────
function KelolaSoalModal({
  ujian,
  onClose,
  onUpdate,
}: {
  ujian: UjianDetail;
  onClose: () => void;
  onUpdate: (id: string, soalList: SoalItem[]) => void;
}) {
  const [soalList, setSoalList] = useState<SoalItem[]>(ujian.soalList || []);
  const [soalPertanyaan, setSoalPertanyaan] = useState("");
  const [soalTipe, setSoalTipe] = useState<"pg" | "essay">("pg");
  const [soalTopik, setSoalTopik] = useState("");
  const [soalOpsi, setSoalOpsi] = useState(["", "", "", ""]);
  const [soalJawaban, setSoalJawaban] = useState("");
  const [soalGambar, setSoalGambar] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  function resetSoalForm() {
    setSoalPertanyaan("");
    setSoalTopik("");
    setSoalOpsi(["", "", "", ""]);
    setSoalJawaban("");
    setSoalTipe("pg");
    setSoalGambar(undefined);
  }

  function handleAddSoal() {
    if (!soalPertanyaan.trim()) return;
    const newSoal: SoalItem = {
      id: editingId || Date.now().toString(),
      pertanyaan: soalPertanyaan.trim(),
      tipe: soalTipe,
      opsi: soalTipe === "pg" ? soalOpsi.filter(Boolean) : [],
      jawaban: soalJawaban,
      topik: soalTopik.trim(),
      gambar: soalGambar,
    };
    if (editingId) {
      setSoalList((prev) => prev.map((s) => (s.id === editingId ? newSoal : s)));
      setEditingId(null);
    } else {
      setSoalList((prev) => [...prev, newSoal]);
    }
    resetSoalForm();
    setShowForm(false);
  }

  function handleEditSoal(s: SoalItem) {
    setEditingId(s.id);
    setSoalPertanyaan(s.pertanyaan);
    setSoalTipe(s.tipe);
    setSoalTopik(s.topik);
    setSoalOpsi(s.tipe === "pg" ? [...s.opsi, "", "", "", ""].slice(0, 4) : ["", "", "", ""]);
    setSoalJawaban(s.jawaban);
    setSoalGambar(s.gambar);
    setShowForm(true);
  }

  function handleDeleteSoal(id: string) {
    setSoalList((prev) => prev.filter((s) => s.id !== id));
  }

  function handleSave() {
    onUpdate(ujian.id, soalList);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl shadow-2xl z-10 max-h-[92vh] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Kelola Soal</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{ujian.nama}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-medium">{soalList.length} soal</span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {soalList.length === 0 && !showForm && (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-[13px] font-semibold text-zinc-500">Belum ada soal</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Klik tombol "Tambah Soal" untuk mulai</p>
            </div>
          )}

          {soalList.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden">
              <div className="divide-y divide-slate-50">
                {soalList.map((s, i) => (
                  <div
                    key={s.id}
                    className={`px-4 py-3 flex items-start gap-3 ${
                      editingId === s.id ? "bg-amber-50" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <span className="w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-zinc-900">{s.pertanyaan}</p>
                      {s.gambar && (
                        <img
                          src={s.gambar}
                          alt="Gambar soal"
                          className="mt-1.5 h-12 rounded-lg object-cover border border-slate-200"
                        />
                      )}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            s.tipe === "pg" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {s.tipe === "pg" ? "PG" : "Essay"}
                        </span>
                        {s.topik && <span className="text-[10px] text-slate-400">{s.topik}</span>}
                        {s.gambar && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-violet-500 font-semibold">
                            <ImageIcon className="w-3 h-3" /> Ada gambar
                          </span>
                        )}
                        {s.tipe === "pg" && s.opsi.length > 0 && (
                          <span className="text-[10px] text-slate-400">
                            {s.opsi.length} opsi · Jwb:{" "}
                            <strong className="text-emerald-600">{s.jawaban}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditSoal(s)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSoal(s.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setEditingId(null); resetSoalForm(); }}
              className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl text-[12px] font-semibold text-slate-500 hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Soal Baru
            </button>
          )}

          {showForm && (
            <div
              className={`border rounded-[14px] p-4 space-y-3 ${
                editingId ? "border-amber-200 bg-amber-50/30" : "border-slate-200 bg-slate-50/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-zinc-900 text-[13px]">
                  {editingId ? "✏️ Edit Soal" : "➕ Soal Baru"}
                </h4>
                <button
                  onClick={() => { setShowForm(false); setEditingId(null); resetSoalForm(); }}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Pertanyaan *</label>
                <textarea
                  value={soalPertanyaan}
                  onChange={(e) => setSoalPertanyaan(e.target.value)}
                  rows={2}
                  placeholder="Tuliskan pertanyaan soal..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none bg-white"
                />
              </div>

              <SoalImageUpload value={soalGambar} onChange={setSoalGambar} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Tipe Soal</label>
                  <select
                    value={soalTipe}
                    onChange={(e) => setSoalTipe(e.target.value as "pg" | "essay")}
                    className="w-full h-9 px-2 border border-slate-200 rounded-lg text-[12px] text-slate-700 focus:outline-none bg-white"
                  >
                    <option value="pg">Pilihan Ganda</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Topik</label>
                  <input
                    type="text"
                    value={soalTopik}
                    onChange={(e) => setSoalTopik(e.target.value)}
                    placeholder="e.g. Limit Fungsi"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-[12px] focus:outline-none bg-white"
                  />
                </div>
              </div>

              {soalTipe === "pg" && (
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold text-slate-500 block">
                    Opsi Jawaban{" "}
                    <span className="text-slate-400 font-normal">(klik radio = jawaban benar)</span>
                  </label>
                  {soalOpsi.map((opsi, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full border-[1.5px] border-slate-200 bg-white text-slate-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <input
                        type="text"
                        value={opsi}
                        onChange={(e) => {
                          const next = [...soalOpsi];
                          next[i] = e.target.value;
                          setSoalOpsi(next);
                        }}
                        placeholder={`Opsi ${String.fromCharCode(65 + i)}`}
                        className="flex-1 h-8 px-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none bg-white"
                      />
                      <input
                        type="radio"
                        name="jawaban-kelola"
                        checked={soalJawaban === opsi && opsi !== ""}
                        onChange={() => setSoalJawaban(opsi)}
                        title="Jawaban benar"
                        className="accent-emerald-600"
                      />
                    </div>
                  ))}
                  {soalJawaban && (
                    <p className="text-[10px] text-emerald-600 font-medium">
                      ✓ Jawaban benar: {soalJawaban}
                    </p>
                  )}
                </div>
              )}

              {soalTipe === "essay" && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                    Kunci Jawaban (Opsional)
                  </label>
                  <textarea
                    value={soalJawaban}
                    onChange={(e) => setSoalJawaban(e.target.value)}
                    rows={2}
                    placeholder="Tuliskan kunci jawaban essay..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[12px] focus:outline-none resize-none bg-white"
                  />
                </div>
              )}

              <button
                onClick={handleAddSoal}
                disabled={!soalPertanyaan.trim()}
                className="w-full h-9 bg-zinc-900 text-white rounded-lg text-[12px] font-semibold hover:bg-zinc-800 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" />
                {editingId ? "Simpan Perubahan" : "Tambah Soal"}
              </button>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-slate-100 shrink-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Simpan ({soalList.length} soal)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function GuruMataPelajaran() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: "Matematika Peminatan", kelas: "XII IPA 1", soal: 48, ujian: 2, color: "zinc", desc: "Materi kalkulus, fungsi, dan limit" },
    { id: 2, name: "Matematika Wajib", kelas: "XI IPA 2", soal: 32, ujian: 1, color: "blue", desc: "Trigonometri dan fungsi komposisi" },
    { id: 3, name: "Kimia", kelas: "XII IPS 1", soal: 20, ujian: 0, color: "emerald", desc: "Kimia organik dan reaksi dasar" },
    { id: 4, name: "Fisika", kelas: "XI IPA 1", soal: 15, ujian: 1, color: "violet", desc: "Dinamika dan kinematika" },
    { id: 5, name: "Biologi", kelas: "X IPA 1", soal: 10, ujian: 0, color: "amber", desc: "Sel dan jaringan tumbuhan" },
  ]);

  const [ujianList, setUjianList] = useState<UjianDetail[]>(UJIAN_LIST_DEFAULT);
  const [ulanganList, setUlanganList] = useState<UjianDetail[]>([
    { id: "uh-trigonometri", nama: "UH Trigonometri", tanggal: "15 Mar 2026", durasi: "45", totalSoal: 20, peserta: "30/30", status: "berlangsung", token: "UH-TRI-2026", kelas: "XII IPA 1", soalAcak: true, soalList: [] },
    { id: "uh-fungsi-invers", nama: "UH Fungsi Invers", tanggal: "02 Mar 2026", durasi: "45", totalSoal: 25, peserta: "32/32", status: "selesai", token: "UH-FI-2026", kelas: "XII IPA 1", soalAcak: false, soalList: [] },
  ]);
  const [latihanList, setLatihanList] = useState<UjianDetail[]>([
    { id: "latihan-limit", nama: "Latihan Limit Fungsi", tanggal: "", durasi: "30", totalSoal: 20, peserta: "24/35", status: "berlangsung", token: "", kelas: "XII IPA 1", soalAcak: false, soalList: [] },
    { id: "latihan-integral", nama: "Latihan Integral", tanggal: "20 Feb 2026", durasi: "20", totalSoal: 15, peserta: "30/30", status: "selesai", token: "", kelas: "XII IPA 1", soalAcak: false, soalList: [] },
  ]);
  const [kuisList, setKuisList] = useState<UjianDetail[]>([
    { id: "quiz-fungsi-komposisi", nama: "Quiz Fungsi Komposisi", tanggal: "05 Mar 2026", durasi: "20", totalSoal: 15, peserta: "32/32", status: "selesai", token: "", kelas: "XII IPA 1", soalAcak: true, soalList: [] },
    { id: "quiz-matriks", nama: "Quiz Matriks", tanggal: "", durasi: "15", totalSoal: 10, peserta: "0/35", status: "draft", token: "", kelas: "XII IPA 1", soalAcak: false, soalList: [] },
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

  const [showDetailUjianModal, setShowDetailUjianModal] = useState(false);
  const [selectedUjian, setSelectedUjian] = useState<UjianDetail | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [showKelolaSoalModal, setShowKelolaSoalModal] = useState(false);
  const [kelolaSoalTarget, setKelolaSoalTarget] = useState<UjianDetail | null>(null);

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

  function copyToClipboard(text: string, type: "link" | "token") {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "link") { setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }
      else { setCopiedToken(true); setTimeout(() => setCopiedToken(false), 2000); }
    });
  }

  function openDetailUjian(ujian: UjianDetail) {
    setSelectedUjian(ujian);
    setShowToken(false);
    setCopiedLink(false);
    setCopiedToken(false);
    setShowDetailUjianModal(true);
  }

  function openKelolaSoal(item: UjianDetail) {
    setKelolaSoalTarget(item);
    setShowKelolaSoalModal(true);
  }

  function getListSetter(tab: string) {
    if (tab === "ujian") return setUjianList;
    if (tab === "ulangan") return setUlanganList;
    if (tab === "latihan") return setLatihanList;
    if (tab === "kuis") return setKuisList;
    return setUjianList;
  }

  function getListForTab(tab: string): UjianDetail[] {
    if (tab === "ujian") return ujianList;
    if (tab === "ulangan") return ulanganList;
    if (tab === "latihan") return latihanList;
    if (tab === "kuis") return kuisList;
    return [];
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
    const ts = parseInt(totalSoalStr) || 40;
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

  function handleSaveContent(data: {
    nama: string;
    tanggal: string;
    durasi: string;
    soalAcak: boolean;
    soalList: SoalItem[];
  }) {
    const newItem: UjianDetail = {
      id: `${activeTab}-${Date.now()}`,
      nama: data.nama,
      tanggal: data.tanggal
        ? new Date(data.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "-",
      durasi: data.durasi ? `${data.durasi} menit` : "-",
      totalSoal: data.soalList.length,
      peserta: `0/${selectedSubject?.kelas ? 35 : 35}`,
      status: "draft",
      token: `TKN-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      kelas: selectedSubject?.kelas || "",
      soalAcak: data.soalAcak,
      soalList: data.soalList,
    };
    const setter = getListSetter(activeTab);
    setter((prev) => [newItem, ...prev]);
    setShowContentModal(false);
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
        return laporanSortDir === "asc"
          ? (va as number) > (vb as number) ? 1 : -1
          : (va as number) < (vb as number) ? 1 : -1;
      });
  }

  function getHeaderTitle() {
    if (showLaporanPage) return "Laporan";
    if (selectedSubject) return `${selectedSubject.name} > ${TAB_LABELS[activeTab]}`;
    return "Dashboard > Mata Pelajaran";
  }

  function renderContentTable(
    list: UjianDetail[],
    tab: string,
    setter: React.Dispatch<React.SetStateAction<UjianDetail[]>>
  ) {
    const tabLabel = TAB_LABELS[tab] || tab;
    return (
      <div className="fade-up-2">
        <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900 text-[13px]">Daftar {tabLabel}</h3>
            <span className="text-[11px] text-slate-400 font-medium">{list.length} {tabLabel.toLowerCase()}</span>
          </div>
          {list.length === 0 ? (
            <div className="py-10 text-center">
              <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-[13px] text-slate-400">Belum ada {tabLabel.toLowerCase()}</p>
              <button
                onClick={() => setShowContentModal(true)}
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-zinc-700 underline"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah {tabLabel}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: "580px" }}>
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Nama {tabLabel}</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Tanggal</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden md:table-cell">Peserta</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Soal</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400 hidden sm:table-cell">Urutan</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-400">Status</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold uppercase text-slate-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {list.map((item) => {
                    const soalCount = item.soalList?.length ?? item.totalSoal;
                    const soalDenganGambar = item.soalList?.filter((s) => s.gambar).length ?? 0;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium text-zinc-900 text-[13px]">{item.nama}</td>
                        <td className="px-4 py-3 text-slate-500 text-[12px] hidden sm:table-cell">{item.tanggal || "—"}</td>
                        <td className="px-4 py-3 text-slate-500 text-[12px] hidden md:table-cell">{item.peserta}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-semibold text-zinc-900 text-[12px]">{soalCount}</span>
                            {soalDenganGambar > 0 && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-violet-500 bg-violet-50 px-1 py-0.5 rounded">
                                <ImageIcon className="w-2.5 h-2.5" />{soalDenganGambar}
                              </span>
                            )}
                            <button
                              onClick={() => openKelolaSoal(item)}
                              className="inline-flex items-center gap-1 h-5 px-1.5 rounded text-[9px] font-semibold bg-slate-100 text-slate-500 hover:bg-zinc-900 hover:text-white transition-colors"
                              title="Kelola soal"
                            >
                              <Edit3 className="w-2.5 h-2.5" /> Kelola
                            </button>
                          </div>
                        </td>
                        {/* Kolom urutan soal */}
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {item.soalAcak ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
                              <Shuffle className="w-3 h-3" /> Acak
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                              <ListOrdered className="w-3 h-3" /> Urut
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {item.status === "berlangsung" && (
                            <span className="badge badge-blue">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block mr-1" />
                              BERLANGSUNG
                            </span>
                          )}
                          {item.status === "selesai" && <span className="badge badge-slate">SELESAI</span>}
                          {item.status === "draft" && <span className="badge badge-amber">DRAFT</span>}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {tab === "ujian" && (
                              <button
                                onClick={() => openDetailUjian(item)}
                                className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors"
                              >
                                Detail
                              </button>
                            )}
                            {item.status === "selesai" && (
                              <button
                                onClick={() => openLaporan(item.nama, item.tanggal, item.durasi, String(item.totalSoal))}
                                className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50 transition-colors"
                              >
                                Laporan
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

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
        <div>
          <p className="text-lg font-bold text-zinc-900">{s.val}</p>
          <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
        </div>
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
                <div className="flex-1 bg-slate-100 rounded-full h-[5px]">
                  <div className="h-[5px] rounded-full" style={{ width: `${pct}%`, background: g.color }} />
                </div>
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
        <div className="flex items-center gap-1.5 mb-1" style={{ color: s.color }}>{s.icon}<p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{s.label}</p></div>
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
          <div className="flex-1 bg-slate-100 rounded-full h-[5px]">
            <div className="h-[5px] rounded-full" style={{ width: `${pct}%`, background: r.color }} />
          </div>
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
                      <div className="bg-slate-100 rounded-full h-[4px] w-8">
                        <div className="h-[4px] rounded-full bg-emerald-400" style={{ width: `${benarPct}%` }} />
                      </div>
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
                    <button
                      onClick={() => { setSelectedStudent(s); setShowStudentModal(true); }}
                      className="h-7 px-2.5 border border-slate-200 rounded-lg text-[10px] font-semibold hover:bg-slate-50"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}>
        <Sidebar role="guru" />
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
                <button
                  onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }}
                  className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit"
                >
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
                  <button
                    key={f.key}
                    onClick={() => setCurrentFilter(f.key)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                      currentFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-up-2">
                {filteredSubjects.map((subject) => {
                  const c = COLORS[subject.color as keyof typeof COLORS] || COLORS.zinc;
                  return (
                    <div
                      key={subject.id}
                      onClick={() => handleSelectSubject(subject)}
                      className="bg-white border border-slate-200 rounded-[14px] p-5 cursor-pointer hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 hover:border-slate-300 transition-all group"
                    >
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
                <div
                  onClick={() => { setShowAddModal(true); setNewName(""); setNewKelas(""); setNewDesc(""); setSelectedColor("zinc"); }}
                  className="border-2 border-dashed border-slate-200 rounded-[14px] p-5 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[140px]"
                >
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
                <button
                  onClick={handleBackToSubject}
                  className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 flex-shrink-0"
                >
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

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 fade-up-1">{renderLaporanSummary()}</div>

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
                    <button
                      key={f.key}
                      onClick={() => setLaporanFilter(f.key)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                        laporanFilter === f.key ? "bg-zinc-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                      }`}
                    >
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToMapel}
                    className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-lg bg-white text-slate-500 hover:bg-slate-50 flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mata Pelajaran</p>
                    <h1 className="text-base md:text-lg font-bold text-zinc-900 truncate">{selectedSubject.name} — {selectedSubject.kelas}</h1>
                  </div>
                </div>
                {activeTab !== "nilai" && activeTab !== "soal" && (
                  <button
                    onClick={() => setShowContentModal(true)}
                    className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah {TAB_LABELS[activeTab]}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 fade-up-1">
                {[
                  { label: "Total Soal", val: selectedSubject.soal, icon: <FileText className="w-4 h-4 text-slate-400" /> },
                  { label: "Ujian", val: ujianList.length, icon: <ClipboardList className="w-4 h-4 text-slate-400" /> },
                  { label: "Siswa Aktif", val: 35, icon: <Users className="w-4 h-4 text-slate-400" /> },
                  { label: "Rata-rata", val: "78.5", icon: <TrendingUp className="w-4 h-4 text-slate-400" /> },
                ].map((st) => (
                  <div key={st.label} className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex items-center gap-2 mb-1">{st.icon}<p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{st.label}</p></div>
                    <p className="text-xl md:text-2xl font-bold text-zinc-900">{st.val}</p>
                  </div>
                ))}
              </div>

              <div className="fade-up-1 overflow-x-auto -mx-1 px-1">
                <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                  {Object.entries(TAB_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handleTabChange(key)}
                      className={`px-3 py-2 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer border-none ${
                        activeTab === key ? "bg-white text-zinc-900 shadow-sm" : "text-slate-500 hover:text-zinc-900"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "ujian" && renderContentTable(ujianList, "ujian", setUjianList)}
              {activeTab === "ulangan" && renderContentTable(ulanganList, "ulangan", setUlanganList)}
              {activeTab === "latihan" && renderContentTable(latihanList, "latihan", setLatihanList)}
              {activeTab === "kuis" && renderContentTable(kuisList, "kuis", setKuisList)}

              {activeTab === "soal" && (
                <div className="fade-up-2 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                          type="text"
                          placeholder="Cari soal..."
                          className="h-9 pl-8 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20 w-full sm:w-48"
                        />
                      </div>
                      <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none">
                        <option value="">Semua Tipe</option>
                        <option>Pilihan Ganda</option>
                        <option>Essay</option>
                      </select>
                    </div>
                    <button
                      onClick={() => setShowContentModal(true)}
                      className="h-9 px-4 bg-zinc-900 text-white text-[12px] font-semibold rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1.5 flex-shrink-0"
                    >
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
                        { label: "Ujian", desc: `${ujianList.length} ujian`, color: "violet", icon: <ClipboardList className="w-4 h-4 text-violet-600" />, val: bobotUjian, set: setBobotUjian },
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
                              <input
                                type="number"
                                value={item.val}
                                onChange={(e) => item.set(parseInt(e.target.value) || 0)}
                                className="w-16 h-8 text-center border-[1.5px] border-slate-200 rounded-lg text-[12px] font-semibold text-zinc-900 bg-white focus:border-zinc-900 outline-none"
                              />
                              <span className="text-[12px] font-semibold text-slate-500">%</span>
                            </div>
                          </div>
                          {item.label === "Ujian" && ujianList.length > 0 && (
                            <div className="pl-9 space-y-1.5 pt-2 border-t border-violet-100 mt-2">
                              {ujianList.slice(0, 2).map((u, i) => (
                                <div key={u.id} className="flex items-center justify-between">
                                  <span className="text-[11px] text-slate-600 truncate max-w-[140px]">{u.nama}</span>
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={i === 0 ? subBobotUjian1 : subBobotUjian2}
                                      onChange={(e) => i === 0 ? setSubBobotUjian1(parseInt(e.target.value) || 0) : setSubBobotUjian2(parseInt(e.target.value) || 0)}
                                      className="w-14 h-7 text-center border border-slate-200 rounded-lg text-[11px] font-semibold text-zinc-900 bg-white focus:border-zinc-900 outline-none"
                                    />
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
                        <input
                          type="number"
                          value={kkm}
                          onChange={(e) => setKkm(parseInt(e.target.value) || 0)}
                          className="w-16 h-9 text-center border-[1.5px] border-slate-200 rounded-lg text-[13px] font-semibold text-zinc-900 bg-slate-50 focus:border-zinc-900 outline-none"
                        />
                      </div>
                      <button
                        onClick={hitungNilaiAkhir}
                        disabled={!isBobotValid}
                        className="h-10 px-5 bg-zinc-900 text-white text-[13px] font-bold rounded-xl hover:bg-zinc-800 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                      >
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
                          <select
                            value={nilaiFilter}
                            onChange={(e) => setNilaiFilter(e.target.value)}
                            className="h-8 px-2 border border-slate-200 rounded-lg text-[12px] text-slate-600 focus:outline-none"
                          >
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

        </div>
      </div>

      {/* ======= MODAL: DETAIL UJIAN ======= */}
      {showDetailUjianModal && selectedUjian && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailUjianModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
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
              <button onClick={() => setShowDetailUjianModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Nama Ujian</p>
                  <p className="font-bold text-zinc-900 text-[14px]">{selectedUjian.nama}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5 text-slate-400" />, label: "Tanggal", val: selectedUjian.tanggal },
                    { icon: <Clock className="w-3.5 h-3.5 text-slate-400" />, label: "Durasi", val: selectedUjian.durasi },
                    { icon: <FileText className="w-3.5 h-3.5 text-slate-400" />, label: "Total Soal", val: `${selectedUjian.soalList?.length ?? selectedUjian.totalSoal} soal` },
                    { icon: <Users className="w-3.5 h-3.5 text-slate-400" />, label: "Peserta", val: selectedUjian.peserta },
                  ].map((it) => (
                    <div key={it.label} className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">{it.icon}</div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold uppercase">{it.label}</p>
                        <p className="text-[12px] font-semibold text-zinc-700">{it.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Urutan soal badge di detail */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Urutan Soal:</p>
                  {selectedUjian.soalAcak ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                      <Shuffle className="w-3 h-3" /> Diacak per siswa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <ListOrdered className="w-3 h-3" /> Berurutan (sama semua)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">Status:</p>
                  {selectedUjian.status === "berlangsung" && <span className="badge badge-blue"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block mr-1" />BERLANGSUNG</span>}
                  {selectedUjian.status === "selesai" && <span className="badge badge-slate">SELESAI</span>}
                  {selectedUjian.status === "draft" && <span className="badge badge-amber">DRAFT</span>}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <p className="text-[12px] font-bold text-zinc-900">Link Akses Ujian (Siswa)</p>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                  <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider mb-2">URL Akses</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 bg-white border border-blue-200 rounded-lg px-3 py-2">
                      <p className="text-[11px] font-mono text-blue-700 truncate">{getAksesUjianUrl(selectedUjian.id)}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(getAksesUjianUrl(selectedUjian.id), "link")}
                      className={`flex-shrink-0 h-9 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${copiedLink ? "bg-emerald-500 text-white" : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedLink ? "Disalin!" : "Salin"}
                    </button>
                  </div>
                  <a href={getAksesUjianUrl(selectedUjian.id)} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2">
                    <ExternalLink className="w-3 h-3" /> Buka di tab baru
                  </a>
                </div>
              </div>

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
                      <button onClick={() => setShowToken(!showToken)} className="flex-shrink-0 text-amber-400 hover:text-amber-600">
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
                  <p className="text-[10px] text-amber-600 mt-2">⚠️ Bagikan token ini hanya kepada siswa yang berhak mengikuti ujian.</p>
                </div>
              </div>

              <button
                onClick={() => { setShowDetailUjianModal(false); openKelolaSoal(selectedUjian); }}
                className="w-full h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Kelola Soal ({selectedUjian.soalList?.length ?? 0} soal)
              </button>
            </div>

            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setShowDetailUjianModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">
                Tutup
              </button>
              {selectedUjian.status === "selesai" && (
                <button
                  onClick={() => { setShowDetailUjianModal(false); openLaporan(selectedUjian.nama, selectedUjian.tanggal, selectedUjian.durasi, String(selectedUjian.totalSoal)); }}
                  className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 flex items-center justify-center gap-2"
                >
                  <BarChart2 className="w-4 h-4" /> Lihat Laporan
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

      {/* ======= MODAL: TAMBAH KONTEN (Multi-step) ======= */}
      {showContentModal && (
        <AddContentModal
          activeTab={activeTab}
          onClose={() => setShowContentModal(false)}
          onSave={handleSaveContent}
        />
      )}

      {/* ======= MODAL: KELOLA SOAL ======= */}
      {showKelolaSoalModal && kelolaSoalTarget && (
        <KelolaSoalModal
          ujian={kelolaSoalTarget}
          onClose={() => { setShowKelolaSoalModal(false); setKelolaSoalTarget(null); }}
          onUpdate={(id, soalList) => {
            const allSetters = [setUjianList, setUlanganList, setLatihanList, setKuisList];
            allSetters.forEach((setter) => {
              setter((prev) =>
                prev.map((u) => u.id === id ? { ...u, soalList, totalSoal: soalList.length } : u)
              );
            });
          }}
        />
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