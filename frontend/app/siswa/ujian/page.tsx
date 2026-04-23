"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Menu, X, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Flag, Maximize, HelpCircle } from "lucide-react";

const QUESTIONS = [
  { id: 1, topic: "Fungsi Kuadrat", level: "C3", question: "Diketahui fungsi f(x) = 2x² + 3x − 5. Tentukan nilai f(3).", options: ["20", "25", "30", "35"] },
];

const GRID_STATES = {
  answered: [1, 2, 3, 4, 5, 6, 8, 9, 10, 11],
  skipped: [7],
  current: [12],
};

export default function UjianPage() {
  const [timeLeft, setTimeLeft] = useState(5382);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(12);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const isWarning = timeLeft < 900;

  return (
    <div className="flex min-h-screen">
      {/* Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-[280px] h-full z-50 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Ujian Aktif</p>
              <h2 className="text-[13px] font-bold text-zinc-900">UAS Matematika Peminatan — X IPA 2</h2>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="text-xl" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="text-slate-400 text-base" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sisa Waktu</span>
          </div>
          <div className={`text-[36px] font-mono font-bold ${isWarning ? "text-red-600 animate-pulse" : "text-zinc-900"}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-zinc-900">Soal {currentQuestion} / 40</span>
            <span className="text-[10px] font-semibold text-slate-400">30% Selesai</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-zinc-900 h-full rounded-full transition-all duration-500" style={{ width: "30%" }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: 40 }, (_, i) => {
              const num = i + 1;
              const isAnswered = GRID_STATES.answered.includes(num);
              const isSkipped = GRID_STATES.skipped.includes(num);
              const isCurrent = GRID_STATES.current.includes(num);
              return (
                <button
                  key={num}
                  className={`w-full aspect-square rounded-lg text-xs font-bold flex items-center justify-center border ${
                    isAnswered ? "bg-emerald-100 text-emerald-900 border-emerald-300" :
                    isSkipped ? "bg-blue-100 text-blue-800 border-blue-200" :
                    isCurrent ? "bg-zinc-900 text-white border-zinc-900 shadow-md" :
                    "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
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
              <div className={`w-10 h-6 rounded-full transition-colors ${flagged ? "bg-amber-500" : "bg-slate-200"}`} />
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${flagged ? "translate-x-4" : "translate-x-1"}`} />
            </div>
            <div className="text-left flex-1">
              <p className="text-xs font-bold text-zinc-900">Ragu-ragu</p>
              <p className="text-[10px] text-slate-400">Tandai untuk diperiksa</p>
            </div>
            <Flag className={`text-base transition-colors ${flagged ? "text-amber-500" : "text-slate-300"}`} />
          </button>
          <Link href="/siswa/selsai-ujian" className="w-full h-10 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 flex items-center justify-center gap-2">
            <AlertTriangle className="text-base" />
            Akhiri Ujian
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[280px]">
        <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500">
              <Menu className="text-xl" />
            </button>
            <span className="px-2 py-1 rounded-md bg-zinc-900 text-white text-[10px] font-bold tracking-wide">SOAL {currentQuestion}</span>
            <h3 className="text-sm font-semibold text-zinc-900 hidden sm:block">Matematika Peminatan</h3>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-slate-500 hover:text-zinc-900 text-xs font-medium">
              <Maximize className="text-base" />
              <span className="hidden lg:inline">Full Screen</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8">
          <div className="max-w-[720px] mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase">Fungsi Kuadrat</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-600 uppercase">Kognitif: C3</span>
            </div>

            <div className="mb-8">
              <h1 className="text-[18px] md:text-xl font-semibold text-zinc-900 leading-relaxed">
                Diketahui fungsi <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[16px]">f(x) = 2x² + 3x − 5</code>. Tentukan nilai <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[16px]">f(3)</code>.
              </h1>
            </div>

            <div className="space-y-2.5">
              {QUESTIONS[0].options.map((opt, i) => {
                const letters = ["A", "B", "C", "D"];
                return (
                  <label key={i} className="relative block cursor-pointer">
                    <input
                      type="radio"
                      name="answer"
                      value={letters[i]}
                      checked={selectedAnswer === letters[i]}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className={`flex items-center gap-4 px-4 md:px-5 h-14 border-2 rounded-xl bg-white transition-all peer-checked:border-blue-300 peer-checked:bg-blue-50 ${
                      selectedAnswer === letters[i] ? "border-blue-300 bg-blue-50" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${
                        selectedAnswer === letters[i] ? "border-blue-500 bg-blue-500" : "border-slate-300"
                      }`}>
                        {selectedAnswer === letters[i] && (
                          <svg className="text-white text-xs flex items-center justify-center h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <span className="text-xs font-bold text-slate-400 w-4">{letters[i]}.</span>
                      <span className="text-sm font-medium text-zinc-800">{opt}</span>
                    </div>
                  </label>
                );
              })}
            </div>

            {selectedAnswer && (
              <div id="answer-saved-desktop" className="hidden mt-5 items-center gap-2 text-emerald-600 md:flex">
                <CheckCircle className="text-lg" />
                <span className="text-xs font-bold uppercase tracking-wide">Jawaban Tersimpan</span>
              </div>
            )}
          </div>
        </div>

        <footer className="hidden md:flex h-20 border-t border-slate-100 bg-white px-8 items-center justify-between sticky bottom-0 z-40">
          <button onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))} className="h-11 px-5 border border-slate-200 text-zinc-900 text-sm font-semibold rounded-lg flex items-center gap-2.5 hover:bg-slate-50">
            <ArrowLeft className="w-4 h-4" />Sebelumnya
          </button>
          <div className="flex flex-col items-center gap-1">
            {selectedAnswer && (
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="text-lg" />
                <span className="text-xs font-bold uppercase tracking-widest">Jawaban Tersimpan</span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-medium">Gunakan navigasi atau daftar soal untuk berpindah</p>
          </div>
          <button onClick={() => setCurrentQuestion(Math.min(40, currentQuestion + 1))} className="h-11 px-7 bg-zinc-900 text-white text-sm font-semibold rounded-lg flex items-center gap-2.5 hover:bg-zinc-800 shadow-md">
            Selanjutnya<ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 flex md:hidden items-center justify-between gap-2 z-40">
        <button onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))} className="flex-1 h-11 border border-slate-200 text-zinc-900 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50">
          <ArrowLeft className="w-4 h-4" /><span className="text-xs">Sebelumnya</span>
        </button>
        {selectedAnswer && (
          <div className="flex-shrink-0 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 h-11">
            <CheckCircle className="text-emerald-600 text-base" />
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Tersimpan</span>
          </div>
        )}
        <button onClick={() => setCurrentQuestion(Math.min(40, currentQuestion + 1))} className="flex-1 h-11 bg-zinc-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800">
          <span>Selanjutnya</span><ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}