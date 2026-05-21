import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";

export default function KelolaRole() {
  const [users, setUsers] = useState([
    { id: 1, name: "Muhamad Nur Salam", email: "alam@unpas.ac.id", phone: "081234567890", transactionCount: 15, role: "superadmin", department: "Event", status: "Aktif" },
    { id: 2, name: "Nazala (Nana)", email: "nana@ruangdonasi.id", phone: "085678901234", transactionCount: 4, role: "admin", department: "Documentation/Reports", status: "Aktif" },
    { id: 3, name: "Nanas", email: "nanas@ruangdonasi.id", phone: "089876543210", transactionCount: 2, role: "admin", department: "Database", status: "Aktif" },
    { id: 4, name: "Siti Maela", email: "sitimaela@gmail.com", phone: "082123456789", transactionCount: 24, role: "user", department: "-", status: "Aktif" },
    { id: 5, name: "Budi Santoso", email: "budi.s@gmail.com", phone: "081122334455", transactionCount: 1, role: "user", department: "-", status: "Ditangguhkan" },
    { id: 6, name: "Ahmad Fauzi", email: "fauzi.ahmad@yahoo.com", phone: "087788990011", transactionCount: 5, role: "user", department: "-", status: "Aktif" },
    { id: 7, name: "Rina Melati", email: "rina.m@gmail.com", phone: "089911223344", transactionCount: 8, role: "user", department: "-", status: "Aktif" },
    { id: 8, name: "Doni Pratama", email: "doni.p@gmail.com", phone: "082233445566", transactionCount: 0, role: "user", department: "-", status: "Aktif" },
    { id: 9, name: "Citra Lestari", email: "citra.l@gmail.com", phone: "085566778899", transactionCount: 12, role: "user", department: "-", status: "Aktif" },
    { id: 10, name: "Galih Rakasiwi", email: "galih.r@gmail.com", phone: "081299887766", transactionCount: 3, role: "user", department: "-", status: "Aktif" },
    { id: 11, name: "Rizky Firmansyah", email: "rizky.f@gmail.com", phone: "085611223344", transactionCount: 2, role: "user", department: "-", status: "Aktif" },
    { id: 12, name: "Dewi Safitri", email: "dewi.s@gmail.com", phone: "087812341234", transactionCount: 7, role: "user", department: "-", status: "Ditangguhkan" },
    { id: 13, name: "Indra Wijaya", email: "indra.w@gmail.com", phone: "081233445566", transactionCount: 0, role: "user", department: "-", status: "Aktif" },
    { id: 14, name: "Maya Sari", email: "maya.sari@yahoo.com", phone: "085599887766", transactionCount: 11, role: "user", department: "-", status: "Aktif" },
    { id: 15, name: "Surya Dharma", email: "surya.d@gmail.com", phone: "082199887766", transactionCount: 4, role: "user", department: "-", status: "Aktif" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ role: "", status: "" });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({ role: user.role, status: user.status });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: editData.role, status: editData.status } : u)));
    toast.success("Hak akses berhasil diperbarui!");
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Peringatan: Hapus data ini secara permanen?")) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Pengguna berhasil dihapus!");
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }
  };

  const getBadgeStyle = (role) => {
    switch (role) {
      case "superadmin":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]";
      case "admin":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <header className="h-24 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Akses & Keamanan</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Manajemen Role</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-sm">
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                placeholder="Cari pengguna berdasarkan nama atau email..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-[#09090b]/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:border-emerald-500/50 focus:bg-[#09090b] focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 placeholder:text-zinc-600"
              />
              <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto bg-[#09090b]/50 border border-white/10 px-4 py-2 rounded-2xl">
              <span className="text-xs font-bold text-zinc-500">Tampilkan</span>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="bg-transparent text-xs text-white font-black outline-none cursor-pointer hover:text-emerald-400 transition-colors">
                <option value={10} className="bg-zinc-900">
                  10 Baris
                </option>
                <option value={15} className="bg-zinc-900">
                  15 Baris
                </option>
                <option value={50} className="bg-zinc-900">
                  50 Baris
                </option>
                <option value={100} className="bg-zinc-900">
                  100 Baris
                </option>
              </select>
            </div>
          </div>
          <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-[#09090b]/80 border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest sticky top-0 z-20 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-5 pl-8">Pengguna Terdaftar</th>
                    <th className="px-6 py-5">Otorisasi</th>
                    <th className="px-6 py-5">Status Layanan</th>
                    <th className="px-6 py-5 text-right pr-8">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {currentItems.length > 0 ? (
                    currentItems.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors duration-300 group cursor-default">
                        <td className="px-6 py-4 pl-8">
                          <p className="font-bold text-zinc-200 group-hover:text-white transition-colors">{user.name}</p>
                          <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase ${getBadgeStyle(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${user.status === "Aktif" ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Aktif" ? "bg-emerald-500" : "bg-red-500"}`}></span>
                            {user.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right pr-8">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <button onClick={() => openDetailModal(user)} className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-all" title="Lihat Detail">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                              </svg>
                            </button>
                            <button onClick={() => openEditModal(user)} className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-xl transition-all" title="Ubah Otorisasi">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                              </svg>
                            </button>
                            <button onClick={() => handleDelete(user.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all" title="Hapus Permanen">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-zinc-500">
                          <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                            ></path>
                          </svg>
                          <p className="text-sm font-bold">Data tidak ditemukan</p>
                          <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-[#09090b]/80 border-t border-white/5 px-8 py-5 flex items-center justify-between backdrop-blur-md mt-auto">
              <p className="text-xs font-medium text-zinc-500">
                Menampilkan <span className="font-black text-white">{currentItems.length}</span> dari <span className="font-black text-white">{filteredUsers.length}</span> data
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${currentPage === i + 1 ? "bg-emerald-500 text-[#09090b] shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "text-zinc-500 hover:bg-white/5 hover:text-white"}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailModalOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>
          <div className="bg-[#18181b] border border-white/10 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Detail Informasi Akun</h3>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-zinc-500 hover:text-white transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-8">
              <h2 className="text-xl font-black text-white">{selectedUser.name}</h2>
              <p className="text-sm font-medium text-zinc-400 mb-6">{selectedUser.email}</p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Aktivitas Donasi</p>
                      <p className="text-sm font-bold text-white">{selectedUser.transactionCount} Transaksi Sukses</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Kontak</p>
                    <p className="text-sm font-bold text-white">{selectedUser.phone || "Tidak Ada"}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Status Role</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-md border text-[10px] font-black uppercase tracking-wider ${getBadgeStyle(selectedUser.role)}`}>{selectedUser.role}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>
          <div className="bg-[#18181b] border border-white/10 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            <div className="px-6 py-5 border-b border-white/5 bg-blue-500/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Otorisasi Sistem</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              <div className="bg-zinc-900/80 border border-white/5 rounded-2xl p-4">
                <p className="text-sm font-bold text-white leading-tight">{selectedUser.name}</p>
                <p className="text-[10px] text-zinc-500 font-medium">{selectedUser.email}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Tingkat Akses</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold focus:border-blue-500/50 outline-none transition-colors"
                  >
                    <option value="user">Donatur (Akses Dasar)</option>
                    <option value="admin">Administrator</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Status Layanan</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold focus:border-blue-500/50 outline-none transition-colors"
                  >
                    <option value="Aktif">Aktif (Dapat Login)</option>
                    <option value="Ditangguhkan">Tangguhkan Akses</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl font-bold text-xs transition-colors"
                >
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-colors">
                  Terapkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
