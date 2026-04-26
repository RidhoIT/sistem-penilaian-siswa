"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  User,
  Trash2,
  X,
  Pencil,
} from "lucide-react";

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

const INITIAL_USERS = [
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
  { id: 11, nama: "Irfan Nugroho", email: "irfan.n@siswa.examhub.id", role: "siswa", bidang: "X IPA 2", nip: "0051234007", hp: "087788990011", status: "aktif" },
  { id: 12, nama: "Julia Pertiwi", email: "julia.p@siswa.examhub.id", role: "siswa", bidang: "X IPA 2", nip: "0051234008", hp: "088899001122", status: "aktif" },
];

type User = typeof INITIAL_USERS[0];

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700 border border-violet-200",
  guru: "bg-blue-100 text-blue-700 border border-blue-200",
  siswa: "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const ITEMS_PER_PAGE = 5;

export default function ManajemenUserPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Users state (agar bisa tambah/hapus/edit)
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  // Form state untuk tambah user
  const [addForm, setAddForm] = useState({ nama: "", email: "", role: "", bidang: "", nip: "", hp: "", status: "aktif" });

  // Form state untuk edit user
  const [editForm, setEditForm] = useState<User | null>(null);

  // --- Filter & Pagination ---
  const filtered = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (
      searchQuery &&
      !u.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // --- Stats ---
  const stats = [
    { label: "Total User", val: users.length, icon: <User className="text-zinc-900 w-4 h-4" />, iconBg: "#f4f4f5" },
    { label: "Admin", val: users.filter((u) => u.role === "admin").length, icon: <Shield className="text-violet-600 w-4 h-4" />, iconBg: "#ede9fe" },
    { label: "Guru", val: users.filter((u) => u.role === "guru").length, icon: <GraduationCap className="text-blue-600 w-4 h-4" />, iconBg: "#dbeafe" },
    { label: "Siswa", val: users.filter((u) => u.role === "siswa").length, icon: <User className="text-emerald-600 w-4 h-4" />, iconBg: "#d1fae5" },
  ];

  // --- Handlers ---
  const openDetail = (user: User) => { setSelectedUser(user); setShowDetailModal(true); };

  const openDelete = (user: User) => { setSelectedUser(user); setShowDeleteModal(true); };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setEditForm({ ...user });
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (!selectedUser) return;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    // Jika halaman sekarang jadi kosong setelah hapus, kembali ke halaman sebelumnya
    const newFiltered = users.filter(
      (u) =>
        u.id !== selectedUser.id &&
        (roleFilter === "all" || u.role === roleFilter) &&
        (!searchQuery ||
          u.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    const newTotalPages = Math.max(1, Math.ceil(newFiltered.length / ITEMS_PER_PAGE));
    if (currentPage > newTotalPages) setCurrentPage(newTotalPages);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const handleAdd = () => {
    if (!addForm.nama || !addForm.email || !addForm.role) return;
    const newUser: User = {
      id: Date.now(),
      nama: addForm.nama,
      email: addForm.email,
      role: addForm.role,
      bidang: addForm.bidang || "-",
      nip: addForm.nip || "-",
      hp: addForm.hp || "-",
      status: addForm.status as "aktif" | "nonaktif",
    };
    setUsers((prev) => [...prev, newUser]);
    setAddForm({ nama: "", email: "", role: "", bidang: "", nip: "", hp: "", status: "aktif" });
    setShowAddModal(false);
  };

  const handleEdit = () => {
    if (!editForm) return;
    setUsers((prev) => prev.map((u) => (u.id === editForm.id ? { ...editForm } : u)));
    setShowEditModal(false);
    setEditForm(null);
    setSelectedUser(null);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-50`}>
        <Sidebar role="admin" />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title="Dashboard > Manajemen User"
          showHamburger
          onHamburgerClick={() => setSidebarOpen(true)}
        />

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-10 space-y-5 md:space-y-6 fade-up">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-lg md:text-xl font-bold text-zinc-900">Manajemen User</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Kelola akun guru, siswa, dan administrator</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-zinc-800 transition-colors shadow-sm w-fit"
              >
                <Plus className="w-4 h-4" />
                Tambah User
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-3 md:p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.iconBg }}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-lg md:text-xl font-bold text-zinc-900">{s.val}</p>
                    <p className="text-[10px] md:text-[11px] text-slate-400 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Role:</span>
                {["all", "admin", "guru", "siswa"].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                      roleFilter === role
                        ? "bg-zinc-900 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:border-slate-400"
                    }`}
                  >
                    {role === "all" ? "Semua" : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari nama atau email..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-9 pl-9 pr-4 bg-white border border-slate-200 rounded-lg text-[13px] w-full focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" style={{ minWidth: "520px" }}>
                  <thead className="border-b border-slate-100 bg-slate-50/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 w-8">#</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Nama</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Email</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Role</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">Bidang/Kelas</th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                      <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-[13px] text-slate-400">
                          Tidak ada user ditemukan.
                        </td>
                      </tr>
                    ) : (
                      paginated.map((u, i) => {
                        const ac = avatarColor(u.id);
                        const initials = u.nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
                        const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + i + 1;
                        return (
                          <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 text-slate-400 font-mono text-[11px]">
                              {String(globalIndex).padStart(2, "0")}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold flex-shrink-0"
                                  style={{ background: ac.bg, color: ac.text }}
                                >
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-zinc-900 text-[12px] md:text-[13px] truncate max-w-[110px] md:max-w-none">{u.nama}</p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {u.role === "siswa" ? "NISN" : "NIP"}: {u.nip}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-[12px] hidden md:table-cell truncate max-w-[140px]">
                              {u.email}
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[u.role]}`}>
                                {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 text-[12px] hidden lg:table-cell">
                              {u.bidang || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.status === "aktif"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                  : "bg-red-50 text-red-600 border border-red-200"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${u.status === "aktif" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                                {u.status === "aktif" ? "AKTIF" : "NON"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => openDetail(u)}
                                  className="h-7 px-2 md:px-3 border border-slate-200 rounded-lg text-[10px] md:text-[11px] font-semibold hover:bg-slate-50 transition-colors"
                                >
                                  Detail
                                </button>
                                <button
                                  onClick={() => openEdit(u)}
                                  className="h-7 px-2 md:px-3 border border-slate-200 rounded-lg text-[10px] md:text-[11px] font-semibold hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors hidden sm:flex items-center gap-1"
                                >
                                  <Pencil className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => openDelete(u)}
                                  className="h-7 px-2 md:px-3 border border-slate-200 rounded-lg text-[10px] md:text-[11px] font-semibold hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-slate-400">
                  {filtered.length === 0
                    ? "0 pengguna"
                    : `${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} dari ${filtered.length} pengguna`}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${
                        page === currentPage
                          ? "bg-zinc-900 text-white"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-7 w-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===== ADD MODAL ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl z-10 p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">Tambah User</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Andi Wijaya"
                  value={addForm.nama}
                  onChange={(e) => setAddForm((f) => ({ ...f, nama: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="e.g. andi@examhub.id"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Role <span className="text-red-500">*</span></label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                >
                  <option value="">-- Pilih Role --</option>
                  <option value="admin">Admin</option>
                  <option value="guru">Guru</option>
                  <option value="siswa">Siswa</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
                  {addForm.role === "siswa" ? "Kelas" : addForm.role === "guru" ? "Mata Pelajaran" : "Bidang"}
                </label>
                <input
                  type="text"
                  placeholder={addForm.role === "siswa" ? "e.g. XII IPA 1" : "e.g. Matematika"}
                  value={addForm.bidang}
                  onChange={(e) => setAddForm((f) => ({ ...f, bidang: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
                  {addForm.role === "siswa" ? "NISN" : "NIP"}
                </label>
                <input
                  type="text"
                  placeholder="Nomor identitas"
                  value={addForm.nip}
                  onChange={(e) => setAddForm((f) => ({ ...f, nip: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">No. HP</label>
                <input
                  type="text"
                  placeholder="e.g. 081234567890"
                  value={addForm.hp}
                  onChange={(e) => setAddForm((f) => ({ ...f, hp: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Status</label>
                <select
                  value={addForm.status}
                  onChange={(e) => setAddForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleAdd}
                disabled={!addForm.nama || !addForm.email || !addForm.role}
                className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg shadow-2xl z-10 p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-zinc-900">Edit User</h3>
              <button onClick={() => setShowEditModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  value={editForm.nama}
                  onChange={(e) => setEditForm((f) => f ? { ...f, nama: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => f ? { ...f, email: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm((f) => f ? { ...f, role: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                >
                  <option value="admin">Admin</option>
                  <option value="guru">Guru</option>
                  <option value="siswa">Siswa</option>
                </select>
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
                  {editForm.role === "siswa" ? "Kelas" : editForm.role === "guru" ? "Mata Pelajaran" : "Bidang"}
                </label>
                <input
                  type="text"
                  value={editForm.bidang}
                  onChange={(e) => setEditForm((f) => f ? { ...f, bidang: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">
                  {editForm.role === "siswa" ? "NISN" : "NIP"}
                </label>
                <input
                  type="text"
                  value={editForm.nip}
                  onChange={(e) => setEditForm((f) => f ? { ...f, nip: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">No. HP</label>
                <input
                  type="text"
                  value={editForm.hp}
                  onChange={(e) => setEditForm((f) => f ? { ...f, hp: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                />
              </div>
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1.5 block">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((f) => f ? { ...f, status: e.target.value } : f)}
                  className="w-full h-10 px-3 border border-slate-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleEdit}
                className="flex-1 h-10 bg-zinc-900 rounded-xl text-[13px] font-bold text-white hover:bg-zinc-800"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE MODAL ===== */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-sm shadow-2xl z-10 p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600 w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 text-center mb-1">Hapus User?</h3>
            <p className="text-[13px] text-slate-500 text-center mb-5">
              Anda yakin ingin menghapus akun &quot;{selectedUser.nama}&quot;? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-10 bg-red-600 rounded-xl text-[13px] font-bold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DETAIL MODAL ===== */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDetailModal(false)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900">Detail User</h3>
              <button onClick={() => setShowDetailModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                  style={{ background: avatarColor(selectedUser.id).bg, color: avatarColor(selectedUser.id).text }}
                >
                  {selectedUser.nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-zinc-900 text-[15px] truncate">{selectedUser.nama}</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_BADGE[selectedUser.role]}`}>
                      {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedUser.status === "aktif"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                      {selectedUser.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-0">
                {[
                  { label: "Nama Lengkap", value: selectedUser.nama },
                  { label: "Email", value: selectedUser.email },
                  { label: selectedUser.role === "siswa" ? "NISN" : "NIP", value: selectedUser.nip },
                  { label: "Role", value: selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1) },
                  { label: selectedUser.role === "siswa" ? "Kelas" : selectedUser.role === "guru" ? "Mata Pelajaran" : "Bidang", value: selectedUser.bidang || "-" },
                  { label: "No. HP", value: selectedUser.hp || "-" },
                  { label: "Status", value: selectedUser.status === "aktif" ? "Aktif" : "Nonaktif" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                    <span className="text-[12px] text-slate-400 font-medium">{row.label}</span>
                    <span className="text-[12px] font-semibold text-zinc-700 text-right max-w-[55%] truncate">{row.value}</span>
                  </div>
                ))}
              </div>
              {/* Shortcut edit dari detail modal */}
              <button
                onClick={() => { setShowDetailModal(false); openEdit(selectedUser); }}
                className="mt-4 w-full h-10 border border-slate-200 rounded-xl text-[13px] font-semibold text-zinc-700 hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" />
                Edit User Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}