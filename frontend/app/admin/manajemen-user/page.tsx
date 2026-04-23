"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Search, Plus, Download, ChevronLeft, ChevronRight, Shield, GraduationCap, User, CheckCircle, XCircle, Edit2, Trash2, X } from "lucide-react";

const AVATAR_COLORS = [
  { bg: "#18181b", text: "#fff" },
  { bg: "#2563eb", text: "#fff" },
  { bg: "#059669", text: "#fff" },
  { bg: "#7c3aed", text: "#fff" },
  { bg: "#d97706", text: "#fff" },
  { bg: "#dc2626", text: "#fff" },
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

const USERS = [
  { id: 1, nama: "Budi Santosa", email: "budi.santosa@examhub.id", role: "admin", bidang: "-", nip: "198504152010011001", hp: "081234567890", status: "aktif" },
  { id: 2, nama: "Siti Rahayuni", email: "siti.rahayuni@examhub.id", role: "guru", bidang: "Matematika", nip: "197903202005012003", hp: "082198765432", status: "aktif" },
  { id: 3, nama: "Ahmad Fauzi", email: "ahmad.fauzi@examhub.id", role: "guru", bidang: "Fisika", nip: "198812072015011002", hp: "085312345678", status: "aktif" },
  { id: 4, nama: "Dewi Anggraeni", email: "dewi.anggraeni@examhub.id", role: "guru", bidang: "Kimia", nip: "199001152018012005", hp: "087654321098", status: "nonaktif" },
  { id: 5, nama: "Rizki Maulana", email: "rizki.m@siswa.examhub.id", role: "siswa", bidang: "XII IPA 1", nip: "0051234001", hp: "081122334455", status: "aktif" },
  { id: 6, nama: "Bella Rahmawati", email: "bella.r@siswa.examhub.id", role: "siswa", bidang: "XII IPA 1", nip: "0051234002", hp: "082233445566", status: "aktif" },
  { id: 7, nama: "Candra Wijaya", email: "candra.w@siswa.examhub.id", role: "siswa", bidang: "XI IPA 2", nip: "0051234003", hp: "083344556677", status: "aktif" },
  { id: 8, nama: "Fitri Handayani", email: "fitri.h@siswa.examhub.id", role: "siswa", bidang: "XI IPA 2", nip: "0051234004", hp: "084455667788", status: "aktif" },
  { id: 9, nama: "Gilang Ramadhan", email: "gilang.r@siswa.examhub.id", role: "siswa", bidang: "X IPA 1", nip: "0051234005", hp: "085566778899", status: "aktif" },
  { id: 10, nama: "Hana Safitri", email: "hana.s@siswa.examhub.id", role: "siswa", bidang: "X IPA 1", nip: "0051234006", hp: "086677889900", status: "nonaktif" },
];

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 border border-violet-200",
  guru: "bg-blue-100 text-blue-700 border border-blue-200",
  siswa: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

export default function ManajemenUserPage() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof USERS[0] | null>(null);

  const filtered = USERS.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (searchQuery && !u.nama.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = [
    { label: "Total User", val: USERS.length, icon: <User className="text-zinc-900" /> },
    { label: "Admin", val: USERS.filter((u) => u.role === "admin").length, icon: <Shield className="text-violet-600" /> },
    { label: "Guru", val: USERS.filter((u) => u.role === "guru").length, icon: <GraduationCap className="text-blue-600" /> },
    { label: "Siswa", val: USERS.filter((u) => u.role === "siswa").length, icon: <User className="text-emerald-600" /> },
  ];

  const formatDate = (str: string) => {
    return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const openDetail = (user: typeof USERS[0]) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const openDelete = (user: typeof USERS[0]) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar role="admin" />
      <div className="flex-1 ml-[248px]">
        <Header title="Dashboard > Manajemen User" />

        <div className="p-5 md:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Manajemen User</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Kelola akun guru, siswa, dan administrator</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit"
            >
              <Plus className="w-4 h-4" />
              Tambah User
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-[12px] p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.icon?.props?.className?.includes("violet") ? "#ede9fe" : s.icon?.props?.className?.includes("blue") ? "#dbeafe" : s.icon?.props?.className?.includes("emerald") ? "#d1fae5" : "#f4f4f5"}` }}>
                  {s.icon}
                </div>
                <div>
                  <p className="text-xl font-bold text-zinc-900">{s.val}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Role:</span>
              {["all", "admin", "guru", "siswa"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                    roleFilter === role
                      ? "bg-zinc-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {role === "all" ? "Semua" : role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[14px]" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 w-10">#</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Email</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Role</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Bidang/Kelas</th>
                    <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.slice(0, 10).map((u, i) => {
                    const ac = avatarColor(u.id);
                    const initials = u.nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5 text-slate-400 font-mono text-[11px]">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: ac.bg, color: ac.text }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-900 text-[13px] truncate">{u.nama}</p>
                              <p className="text-[11px] text-slate-400">
                                {u.email.split("@")[0]} · {u.role === "siswa" ? "NISN" : "NIP"}: {u.nip}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[12px] hidden sm:table-cell truncate max-w-[160px]">
                          {u.email}
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${ROLE_BADGE[u.role]}`}>
                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-[12px] hidden lg:table-cell">
                          {u.bidang || "-"}
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                              u.status === "aktif"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                : "bg-red-50 text-red-600 border border-red-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                u.status === "aktif" ? "bg-emerald-500" : "bg-red-500"
                              } ${u.status === "aktif" && "animate-pulse"}`}
                            />
                            {u.status === "aktif" ? "AKTIF" : "NONAKTIF"}
                          </button>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => openDetail(u)}
                              className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                            >
                              Detail
                            </button>
                            <button className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-50 transition-colors">
                              Edit
                            </button>
                            <button
                              onClick={() => openDelete(u)}
                              className="h-7 px-3 border border-slate-200 rounded-lg text-[11px] font-semibold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                            >
                              Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-[12px] text-slate-400">
                Menampilkan 1–{Math.min(10, filtered.length)} dari {filtered.length} pengguna
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronLeft className="text-[14px]" />
                </button>
                <button className="h-7 w-7 rounded-lg bg-zinc-900 text-white text-[12px] font-semibold flex items-center justify-center">
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={filtered.length <= 10}
                  className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40"
                >
                  <ChevronRight className="text-[14px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl z-10 p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">Tambah User</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama Lengkap</label>
                <input type="text" placeholder="e.g. Andi Wijaya" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Email</label>
                <input type="email" placeholder="e.g. andi@examhub.id" className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20" />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Role</label>
                <select className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20">
                  <option value="">-- Pilih Role --</option>
                  <option value="admin">Admin</option>
                  <option value="guru">Guru</option>
                  <option value="siswa">Siswa</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">
                Batal
              </button>
              <button className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl z-10 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600 text-xl" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 text-center mb-1">Hapus User?</h3>
            <p className="text-[13px] text-slate-500 text-center mb-5">
              Anda yakin ingin menghapus akun &quot;{selectedUser.nama}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50">
                Batal
              </button>
              <button className="flex-1 h-10 bg-red-600 rounded-xl text-[13px] font-bold text-white hover:bg-red-700">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Detail User</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: avatarColor(selectedUser.id).bg, color: avatarColor(selectedUser.id).text }}>
                  {selectedUser.nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div>
                  <h2 className="font-bold text-zinc-900 text-[16px]">{selectedUser.nama}</h2>
                  <p className="text-[12px] text-slate-400 mt-0.5">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${ROLE_BADGE[selectedUser.role]}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${
                      selectedUser.status === "aktif"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {selectedUser.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Nama Lengkap", value: selectedUser.nama },
                  { label: "Email", value: selectedUser.email },
                  { label: selectedUser.role === "siswa" ? "NISN" : "NIP", value: selectedUser.nip },
                  { label: "Role", value: selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) },
                  { label: selectedUser.role !== "admin" ? selectedUser.role === "siswa" ? "Kelas" : "Mata Pelajaran" : "-", value: selectedUser.bidang || "-" },
                  { label: "No. HP", value: selectedUser.hp || "-" },
                  { label: "Status", value: selectedUser.status === "aktif" ? "Aktif" : "Nonaktif" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-[12px] text-slate-400 font-medium">{row.label}</span>
                    <span className="text-[13px] font-semibold text-zinc-700">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}