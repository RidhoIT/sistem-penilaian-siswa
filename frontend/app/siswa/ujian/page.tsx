"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Clock, Menu, X, ArrowLeft, ArrowRight, CheckCircle, 
  AlertTriangle, Flag, Maximize, ShieldAlert 
} from "lucide-react";

const QUESTIONS = [
  { 
    id: 12, 
    topic: "Fungsi Kuadrat", 
    level: "C3", 
    question: "Diketahui fungsi f(x) = 2x² + 3x − 5. Tentukan nilai f(3).", 
    options: ["20", "22", "25", "30"] 
  },
];

const GRID_STATES = {
  answered: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
  skipped: [7],
  current: [12],
};

export default function UjianPage() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5382);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(12);
  
  // --- STATE ANTI-CHEATING ---
  const [violationCount, setViolationCount] = useState(0);
  const [violationAlert, setViolationAlert] = useState({ show: false, message: "" });

  /**
   * Fungsi untuk menangani pelanggaran
   */
  const triggerViolation = (message: string) => {
    if (violationAlert.show) return; 

    const nextCount = violationCount + 1;
    setViolationCount(nextCount);

    if (nextCount >= 3) {
      // LOGIKA DISKUALIFIKASI: Langsung lempar ke halaman selesai
      // Pastikan path sesuai dengan struktur routing Next.js Anda
      router.push("/siswa/selsai-ujian");
    } else {
      setViolationAlert({ show: true, message });
    }
  };

  // Timer Effect
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Anti-Cheating Listeners Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen") {
        e.preventDefault();
        triggerViolation("Tindakan Screenshot terdeteksi. Sistem telah mencatat aktivitas ini.");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        triggerViolation("Dilarang menyalin (Copy) soal ujian.");
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation("Anda meninggalkan halaman ujian. Dilarang membuka tab atau aplikasi lain.");
      }
    };

    const handleBlur = () => {
      triggerViolation("Fokus ujian hilang. Harap pastikan Anda tetap berada di halaman ini.");
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerViolation("Fungsi klik kanan dinonaktifkan.");
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation("Dilarang menyalin soal.");
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, [violationCount, violationAlert.show]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isWarning = timeLeft < 900;

  return (
    <div className="flex min-h-screen select-none bg-slate-50">
      
      {/* ALERT POP UP (Hanya muncul jika < 3 pelanggaran) */}
      {violationAlert.show && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[380px] overflow-hidden border border-slate-200">
            <div className="bg-red-50 px-6 py-8 text-center border-b border-red-100">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-red-200">
                <ShieldAlert className="text-red-600 w-8 h-8" strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-bold text-red-900">Peringatan Keamanan</h2>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-[11px] font-bold uppercase tracking-wider">
                Pelanggaran ke-{violationCount} dari 3
              </div>
            </div>

            <div className="p-8 text-center">
              <p className="text-[14px] text-slate-600 leading-relaxed mb-8">
                {violationAlert.message}
                <br />
                <span className="font-semibold text-zinc-900 mt-2 block">
                  Jika Anda melanggar 1x lagi, ujian akan dihentikan secara otomatis.
                </span>
              </p>

              <button
                onClick={() => setViolationAlert({ show: false, message: "" })}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
              >
                Saya Mengerti & Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 w-[280px] h-full z-50 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Ujian Aktif</p>
              <h2 className="text-[13px] font-bold text-zinc-900">UAS Matematika Peminatan</h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-slate-400 w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sisa Waktu</span>
          </div>
          <div className={`text-[36px] font-mono font-bold ${isWarning ? "text-red-600 animate-pulse" : "text-zinc-900"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 40 }, (_, i) => {
              const num = i + 1;
              const isAnswered = GRID_STATES.answered.includes(num);
              const isSkipped = GRID_STATES.skipped.includes(num);
              const isCurrent = currentQuestion === num;
              return (
                <button
                  key={num}
                  onClick={() => setCurrentQuestion(num)}
                  className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center border transition-all ${
                    isCurrent ? "bg-zinc-900 text-white border-zinc-900 shadow-md" :
                    isAnswered ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    isSkipped ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 space-y-3">
          <button onClick={() => setFlagged(!flagged)} className="flex items-center gap-3 w-full group">
            <div className="relative w-10 h-6 flex-shrink-0">
              <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${flagged ? "bg-amber-400" : "bg-slate-200"}`} />
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${flagged ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <div className="text-left flex-1">
              <p className="text-xs font-bold text-zinc-900">Ragu-ragu</p>
            </div>
            <Flag className={`w-4 h-4 ${flagged ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
          </button>
          <Link href="/siswa/selsai-ujian" className="w-full h-10 bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase rounded-xl hover:bg-red-100 flex items-center justify-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Akhiri Ujian
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex flex-col flex-1 md:ml-[280px] min-h-screen">
        <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu className="w-5 h-5" />
            </button>
            <span className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-700 text-[10px] font-bold">
              SOAL {currentQuestion}
            </span>
          </div>
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-zinc-900 text-xs font-medium">
            <Maximize className="w-4 h-4" /> <span className="hidden lg:inline">Full Screen</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 pb-32">
          <div className="max-w-[720px] mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-500 uppercase">Fungsi Kuadrat</span>
            </div>

            <div className="mb-8">
              <h1 className="text-[17px] md:text-xl font-medium text-zinc-800 leading-relaxed">
                Diketahui fungsi <code className="bg-slate-100 px-1.5 rounded">f(x) = 2x² + 3x − 5</code>. Tentukan nilai <code className="bg-slate-100 px-1.5 rounded">f(3)</code>.
              </h1>
            </div>

            <div className="space-y-3">
              {QUESTIONS[0].options.map((opt, i) => {
                const letters = ["A", "B", "C", "D"];
                const isSelected = selectedAnswer === letters[i];
                return (
                  <label key={i} className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={letters[i]}
                      checked={isSelected}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`flex items-center gap-4 px-5 h-14 border rounded-xl transition-all ${isSelected ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-slate-200 hover:bg-slate-50"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? "text-blue-600" : "text-slate-400"}`}>{letters[i]}.</span>
                      <span className={`text-sm ${isSelected ? "font-semibold text-blue-900" : "text-zinc-700"}`}>{opt}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER NAV */}
        <footer className="hidden md:flex h-20 border-t border-slate-200 bg-white fixed bottom-0 right-0 left-[280px]">
          <div className="max-w-[720px] mx-auto w-full px-8 flex items-center justify-between">
            <button onClick={() => setCurrentQuestion(q => Math.max(1, q - 1))} className="h-10 px-5 border border-slate-200 text-sm font-medium rounded-xl flex items-center gap-2 hover:bg-slate-50">
              <ArrowLeft className="w-4 h-4" /> Sebelumnya
            </button>
            <button onClick={() => setCurrentQuestion(q => Math.min(40, q + 1))} className="h-10 px-6 bg-zinc-900 text-white text-sm font-medium rounded-xl flex items-center gap-2 hover:bg-zinc-800 shadow-sm">
              Selanjutnya <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}