import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProgramDonasi() {
  const [userRole, setUserRole] = useState("user");
  useEffect(() => {
    setUserRole(localStorage.getItem("devRole") || "superadmin");
  }, []);

  const canManage = userRole === "superadmin" || userRole === "admin";
  const canDelete = userRole === "superadmin"; 

  const [campaigns, setCampaigns] = useState([
    { id: 1, title: "Bantuan Pangan Pelosok Garut", category: "Kemanusiaan", target: 50000000, gathered: 45200000, deadline: "2026-12-31", status: "Aktif" },
    { id: 2, title: "Renovasi Madrasah Al-Ikhlas", category: "Infrastruktur", target: 120000000, gathered: 42000000, deadline: "2026-08-15", status: "Aktif" },
    { id: 3, title: "Beasiswa Anak Yatim Berprestasi", category: "Pendidikan", target: 25000000, gathered: 25000000, deadline: "2026-05-01", status: "Selesai" },
    { id: 4, title: "Air Bersih untuk NTT", category: "Infrastruktur", target: 200000000, gathered: 15500000, deadline: "2026-10-20", status: "Aktif" },
    { id: 5, title: "Bantuan Medis Ibu Aminah", category: "Kesehatan", target: 30000000, gathered: 12000000, deadline: "2026-06-30", status: "Aktif" },
    { id: 6, title: "Tanggap Darurat Banjir Demak", category: "Bencana Alam", target: 100000000, gathered: 85000000, deadline: "2026-05-25", status: "Aktif" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); 
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Kemanusiaan",
    target: "",
    deadline: "",
    status: "Aktif",
  });
  const formatRupiah = (angka) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
  const getPercent = (gathered, target) => Math.min(Math.round((gathered / target) * 100), 100);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((camp) => {
      const matchSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === "Semua" || camp.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [campaigns, searchTerm, filterCategory]);

  const openFormModal = (mode, camp = null) => {
    setModalMode(mode);
    if (mode === "edit" && camp) {
      setSelectedCampaign(camp);
      setFormData({
        title: camp.title,
        category: camp.category,
        target: camp.target,
        deadline: camp.deadline,
        status: camp.status,
      });
    } else {
      setFormData({ title: "", category: "Kemanusiaan", target: "", deadline: "", status: "Aktif" });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.deadline) {
      toast.error("Mohon lengkapi semua data wajib!");
      return;
    }

    if (modalMode === "add") {
      const newCamp = {
        id: Date.now(),
        ...formData,
        target: Number(formData.target),
        gathered: 0,
      };
      setCampaigns([newCamp, ...campaigns]);
      toast.success("Program donasi baru berhasil dibuat!");
    } else {
      setCampaigns((prev) => prev.map((c) => (c.id === selectedCampaign.id ? { ...c, ...formData, target: Number(formData.target) } : c)));
      toast.success("Data program berhasil diperbarui!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus program donasi ini secara permanen?")) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Program donasi dihapus!");
    }
  };

  const openDetail = (camp) => {
    setSelectedCampaign(camp);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[50%] h-[30%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <header className="h-24 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-20 sticky top-0">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Kelola Campaign</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Program Donasi</h1>
        </div>
        {canManage && (
          <button onClick={() => openFormModal("add")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105">
            + Buat Program
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-sm shadow-xl">
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                placeholder="Cari nama program donasi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#09090b]/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-all duration-300 placeholder:text-zinc-600"
              />
              <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5 group-focus-within:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto bg-[#09090b]/50 border border-white/10 px-4 py-2 rounded-2xl">
              <span className="text-xs font-bold text-zinc-500">Kategori:</span>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-xs text-white font-black outline-none cursor-pointer hover:text-emerald-400">
                <option value="Semua" className="bg-zinc-900">
                  Semua Kategori
                </option>
                <option value="Kemanusiaan" className="bg-zinc-900">
                  Kemanusiaan
                </option>
                <option value="Pendidikan" className="bg-zinc-900">
                  Pendidikan
                </option>
                <option value="Kesehatan" className="bg-zinc-900">
                  Kesehatan
                </option>
                <option value="Bencana Alam" className="bg-zinc-900">
                  Bencana Alam
                </option>
                <option value="Infrastruktur" className="bg-zinc-900">
                  Infrastruktur
                </option>
              </select>
            </div>
          </div>

          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map((camp) => {
                const percent = getPercent(camp.gathered, camp.target);
                const isDone = camp.status === "Selesai" || percent >= 100;

                return (
                  <div
                    key={camp.id}
                    className="group relative bg-[#18181b]/80 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 overflow-hidden hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] group-hover:bg-emerald-500/10 transition-colors duration-500 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-zinc-400 uppercase tracking-widest">{camp.category}</span>
                      <div className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-full ${isDone ? "bg-zinc-500/10 text-zinc-400" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
                        {!isDone && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                        {isDone ? "TERCAPAI" : "AKTIF"}
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug mb-6 relative z-10 group-hover:text-emerald-400 transition-colors line-clamp-2">{camp.title}</h3>

                    <div className="mt-auto relative z-10">
                      <div className="flex justify-between items-end mb-2">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-zinc-500 mb-0.5">Terkumpul</span>
                          <span className="text-sm font-black text-white">{formatRupiah(camp.gathered)}</span>
                        </div>
                        <span className="text-[2rem] font-black text-white/5 group-hover:text-emerald-500/10 transition-colors leading-none tracking-tighter">{percent}%</span>
                      </div>

                      <div className="w-full bg-[#09090b] rounded-full h-2 border border-white/5 overflow-hidden">
                        <div
                          className={`h-full rounded-full relative transition-all duration-1000 ease-out ${isDone ? "bg-zinc-500" : "bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"}`}
                          style={{ width: `${percent}%` }}
                        >
                          {!isDone && <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-[10px] font-bold text-zinc-500">
                        <span>Target: {formatRupiah(camp.target)}</span>
                        <span>Sisa: {Math.max(0, camp.target - camp.gathered) === 0 ? "-" : formatRupiah(camp.target - camp.gathered)}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <button onClick={() => openDetail(camp)} className="w-12 h-12 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110" title="Lihat Detail">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      {canManage && (
                        <button
                          onClick={() => openFormModal("edit", camp)}
                          className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                          title="Edit Program"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(camp.id)}
                          className="w-12 h-12 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                          title="Hapus Permanen"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-md">
              <svg className="w-16 h-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
              <p className="text-white font-bold">Tidak ada program ditemukan</p>
              <p className="text-zinc-500 text-xs mt-1">Coba sesuaikan kata kunci atau kategori pencarian.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && canManage && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>
          <div className="bg-[#18181b] border border-white/10 rounded-[2rem] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            <div className="px-6 py-5 border-b border-white/5 bg-emerald-500/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest">{modalMode === "add" ? "Buat Program Baru" : "Edit Program Donasi"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Judul Program</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Bantuan Pangan Palestina"
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Kategori</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500/50 outline-none transition-colors"
                  >
                    <option value="Kemanusiaan">Kemanusiaan</option>
                    <option value="Pendidikan">Pendidikan</option>
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Bencana Alam">Bencana Alam</option>
                    <option value="Infrastruktur">Infrastruktur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-emerald-500/50 outline-none transition-colors"
                  >
                    <option value="Aktif">Sedang Berjalan</option>
                    <option value="Selesai">Ditutup / Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Target Dana (Rp)</label>
                  <input
                    type="number"
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    placeholder="50000000"
                    min="0"
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-emerald-500/50 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Batas Waktu (Deadline)</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-400 focus:text-white focus:border-emerald-500/50 outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl font-bold text-xs transition-colors">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-colors">
                  {modalMode === "add" ? "Publikasi Program" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && selectedCampaign && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>
          <div className="bg-[#18181b] border border-white/10 rounded-[2rem] w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] flex flex-col max-h-[90vh]">
            <div className="h-32 bg-gradient-to-tr from-emerald-900/40 to-zinc-900 border-b border-white/5 relative p-6 flex flex-col justify-end">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <span className="w-fit px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-2">{selectedCampaign.category}</span>
              <h2 className="text-xl font-black text-white leading-tight">{selectedCampaign.title}</h2>
            </div>

            <div className="p-6 overflow-y-auto [&::-webkit-scrollbar]:hidden">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${selectedCampaign.status === "Aktif" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}
                >
                  Status: {selectedCampaign.status}
                </div>
                <p className="text-[10px] font-bold text-zinc-500">
                  Berakhir: <span className="text-white">{selectedCampaign.deadline}</span>
                </p>
              </div>

              <div className="bg-[#09090b] border border-white/5 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-zinc-400">Pencapaian Donasi</span>
                  <span className="text-xl font-black text-emerald-400">{getPercent(selectedCampaign.gathered, selectedCampaign.target)}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-2 mb-4">
                  <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${getPercent(selectedCampaign.gathered, selectedCampaign.target)}%` }}></div>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Terkumpul</p>
                    <p className="font-bold text-white">{formatRupiah(selectedCampaign.gathered)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Target</p>
                    <p className="font-bold text-white">{formatRupiah(selectedCampaign.target)}</p>
                  </div>
                </div>
              </div>

              <button onClick={() => setIsDetailOpen(false)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white transition-colors">
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>
    </div>
  );
}
