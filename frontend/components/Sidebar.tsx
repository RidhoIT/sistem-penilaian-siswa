"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  MoreVertical,
} from "lucide-react";

interface SidebarProps {
  role: "admin" | "guru";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const basePath = isAdmin ? "/admin" : "/guru";

  return (
    <aside className="w-[248px] min-h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="h-14 flex items-center px-5 border-b border-slate-100 flex-shrink-0">
        <Link href={`${basePath}/dashboard`} className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white text-lg" />
          </div>
          <span className="font-bold text-zinc-900 text-[15px] tracking-tight">ExamHub</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
        <Link
          href={`${basePath}/dashboard`}
          className={`nav-link ${pathname === `${basePath}/dashboard` ? "active" : ""}`}
        >
          <LayoutDashboard className="text-[18px] flex-shrink-0" />
          Dashboard
        </Link>

        <Link
          href={`${basePath}/mata-pelajaran`}
          className={`nav-link ${pathname.startsWith(`${basePath}/mata-pelajaran`) ? "active" : ""}`}
        >
          <BookOpen className="text-[18px] flex-shrink-0" />
          Mata Pelajaran
        </Link>

        {isAdmin && (
          <Link
            href={`${basePath}/manajemen-user`}
            className={`nav-link ${pathname === `${basePath}/manajemen-user` ? "active" : ""}`}
          >
            <Users className="text-[18px] flex-shrink-0" />
            Manajemen User
          </Link>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-9 h-9 bg-zinc-900 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            BS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-zinc-900 truncate">Budi Santosa</p>
            <p className="text-[11px] text-slate-400 truncate">{isAdmin ? "Administrator" : "Guru Matematika"}</p>
          </div>
          <MoreVertical className="text-slate-400 text-base flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}