import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

export default function KelolaBerita() {
  const [userRole, setUserRole] = useState("user");
  useEffect(() => {
    setUserRole(localStorage.getItem("devRole") || "superadmin");
  }, []);

  const canManage = userRole === "superadmin" || userRole === "admin";
  const canDelete = userRole === "superadmin";

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Penyaluran Tahap 1 Bantuan Gempa Cianjur Selesai",
      category: "Laporan Penyaluran",
      author: "Tim RuangDonasi",
      date: "20 Mei 2026",
      content:
        "Alhamdulillah, berkat donasi dari orang-orang baik, bantuan tahap pertama berupa tenda darurat, selimut, dan makanan siap saji telah berhasil didistribusikan ke 5 desa terdampak paling parah di Kabupaten Cianjur. Tim relawan kami terus bersiaga di lokasi untuk tahap kedua.",
      status: "Dipublikasi",
      gradient: "from-emerald-600/40 to-teal-900",
    },
    {
      id: 2,
      title: "Kisah Inspiratif: Nenek Salma Bisa Kembali Tersenyum",
      category: "Cerita Kebaikan",
      author: "Muhamad Nur Salam",
      date: "18 Mei 2026",
      content:
        "Nenek Salma (72) hidup sebatang kara di gubuk reot. Melalui program bedah rumah RuangDonasi, kini beliau memiliki tempat tinggal yang layak dan bersih. Terima kasih kepada 1.200 donatur yang telah patungan mewujudkan mimpi Nenek Salma.",
      status: "Dipublikasi",
      gradient: "from-blue-600/40 to-indigo-900",
    },
    {
      id: 3,
      title: "Transparansi Keuangan RuangDonasi Kuartal 1 2026",
      category: "Informasi Sistem",
      author: "Admin Keuangan",
      date: "15 Mei 2026",
      content:
        "Sebagai bentuk komitmen transparansi, kami merilis laporan keuangan kuartal 1 tahun 2026. Total donasi yang masuk mencapai Rp 4.2 Miliar dengan tingkat penyaluran sebesar 88%. Laporan lengkap dapat diakses melalui menu dokumen transparansi.",
      status: "Dipublikasi",
      gradient: "from-purple-600/40 to-pink-900",
    },
    {
      id: 4,
      title: "Persiapan Qurban Pelosok Negeri 2026",
      category: "Campaign Baru",
      author: "Tim Event",
      date: "10 Mei 2026",
      content: "Menjelang Idul Adha, RuangDonasi kembali meluncurkan program Qurban Pelosok. Tahun ini target kita adalah mendistribusikan daging qurban ke 50 titik terluar Indonesia yang jarang tersentuh bantuan.",
      status: "Draft",
      gradient: "from-orange-600/40 to-red-900",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedNews, setSelectedNews] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Laporan Penyaluran",
    content: "",
    status: "Dipublikasi",
  });

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      if (!canManage && item.status === "Draft") return false;

      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === "Semua" || item.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [news, searchTerm, filterCategory, canManage]);

  const getRandomGradient = () => {
    const gradients = ["from-emerald-600/40 to-teal-900", "from-blue-600/40 to-indigo-900", "from-purple-600/40 to-pink-900", "from-orange-600/40 to-red-900", "from-cyan-600/40 to-blue-900"];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const openFormModal = (mode, item = null) => {
    setModalMode(mode);
    if (mode === "edit" && item) {
      setSelectedNews(item);
      setFormData({ title: item.title, category: item.category, content: item.content, status: item.status });
    } else {
      setFormData({ title: "", category: "Laporan Penyaluran", content: "", status: "Dipublikasi" });
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Judul dan konten berita wajib diisi!");
      return;
    }

    if (modalMode === "add") {
      const newItem = {
        id: Date.now(),
        ...formData,
        author: userRole === "superadmin" ? "Super Admin" : "Administrator",
        date: "Hari Ini", 
        gradient: getRandomGradient(),
      };
      setNews([newItem, ...news]);
      toast.success("Berita berhasil dipublikasikan!");
    } else {
      setNews((prev) => prev.map((n) => (n.id === selectedNews.id ? { ...n, ...formData } : n)));
      toast.success("Perubahan berita berhasil disimpan!");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Hapus artikel berita ini secara permanen?")) {
      setNews((prev) => prev.filter((n) => n.id !== id));
      toast.success("Berita berhasil dihapus!");
    }
  };

  const openDetail = (item) => {
    setSelectedNews(item);
    setIsDetailOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="h-24 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-20 sticky top-0">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-emerald-500 uppercase">Pusat Informasi</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Kabar & Berita</h1>
        </div>
        {canManage && (
          <button onClick={() => openFormModal("add")} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105">
            + Tulis Artikel
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-sm shadow-xl">
            <div className="relative w-full md:w-96 group">
              <input
                type="text"
                placeholder="Cari judul artikel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#09090b]/50 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all duration-300 placeholder:text-zinc-600"
              />
              <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-3.5 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto bg-[#09090b]/50 border border-white/10 px-4 py-2 rounded-2xl">
              <span className="text-xs font-bold text-zinc-500">Kategori:</span>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-transparent text-xs text-white font-black outline-none cursor-pointer hover:text-blue-400">
                <option value="Semua" className="bg-zinc-900">
                  Semua Kabar
                </option>
                <option value="Laporan Penyaluran" className="bg-zinc-900">
                  Laporan Penyaluran
                </option>
                <option value="Cerita Kebaikan" className="bg-zinc-900">
                  Cerita Kebaikan
                </option>
                <option value="Informasi Sistem" className="bg-zinc-900">
                  Informasi Sistem
                </option>
                <option value="Campaign Baru" className="bg-zinc-900">
                  Campaign Baru
                </option>
              </select>
            </div>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col bg-[#18181b]/80 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative"
                >
                  <div className={`h-40 w-full bg-gradient-to-br ${item.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50"></div>

                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      <span className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[9px] font-black text-white uppercase tracking-widest shadow-lg">{item.category}</span>
                      {canManage && (
                        <span
                          className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${item.status === "Dipublikasi" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-orange-500/20 text-orange-300 border border-orange-500/30"}`}
                        >
                          {item.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 relative bg-gradient-to-b from-transparent to-[#18181b]">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 mb-3 uppercase tracking-widest">
                      <span>{item.date}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span>Oleh {item.author}</span>
                    </div>

                    <h3 className="text-lg font-black text-white leading-snug mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-6 flex-1">{item.content}</p>

                    <button onClick={() => openDetail(item)} className="mt-auto text-[11px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 group/btn hover:text-blue-400 transition-colors w-fit">
                      Baca Selengkapnya
                      <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                      </svg>
                    </button>
                  </div>

                  {canManage && (
                    <div className="absolute top-0 right-0 p-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => openFormModal("edit", item)}
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 border border-blue-400/50"
                        title="Edit Artikel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                      </button>
                      {canDelete && (
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-110 border border-red-400/50"
                          title="Hapus Permanen"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border border-white/5 rounded-3xl bg-white/[0.02] backdrop-blur-md">
              <svg className="w-16 h-16 text-zinc-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
              </svg>
              <p className="text-white font-bold">Kabar belum tersedia</p>
              <p className="text-zinc-500 text-xs mt-1">Belum ada artikel yang sesuai dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && canManage && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>
          <div className="bg-[#18181b] border border-white/10 rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            <div className="px-6 py-5 border-b border-white/5 bg-blue-500/5 flex items-center justify-between">
              <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">{modalMode === "add" ? "Tulis Artikel Baru" : "Edit Publikasi Berita"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Judul Artikel</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Masukkan judul berita yang menarik..."
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Kategori Tulisan</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-blue-500/50 outline-none transition-colors"
                  >
                    <option value="Laporan Penyaluran">Laporan Penyaluran</option>
                    <option value="Cerita Kebaikan">Cerita Kebaikan</option>
                    <option value="Informasi Sistem">Informasi Sistem</option>
                    <option value="Campaign Baru">Campaign Baru</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Status Publikasi</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white focus:border-blue-500/50 outline-none transition-colors"
                  >
                    <option value="Dipublikasi">Publikasi Langsung</option>
                    <option value="Draft">Simpan ke Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Isi Konten Berita</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Tuliskan isi laporan atau cerita kebaikan di sini..."
                  rows="6"
                  className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-colors resize-none [&::-webkit-scrollbar]:hidden"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl font-bold text-xs transition-colors">
                  Batal
                </button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-bold text-xs shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-colors">
                  {modalMode === "add" ? "Tayangkan Berita" : "Simpan Pembaruan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDetailOpen && selectedNews && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div onClick={() => setIsDetailOpen(false)} className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-md transition-all"></div>

          <div className="bg-[#09090b] border border-white/10 rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out] flex flex-col max-h-[90vh]">
            <div className={`h-48 w-full bg-gradient-to-br ${selectedNews.gradient} relative shrink-0`}>
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>

              <button
                onClick={() => setIsDetailOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:bg-black/80 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>

              <div className="absolute bottom-6 left-8 right-8">
                <span className="px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest shadow-lg inline-block mb-3">{selectedNews.category}</span>
                <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-lg">{selectedNews.title}</h2>
              </div>
            </div>

            <div className="p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden flex-1 bg-[#09090b]">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-black text-white text-lg">{selectedNews.author.charAt(0)}</div>
                <div>
                  <p className="font-bold text-white">{selectedNews.author}</p>
                  <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Diterbitkan pada {selectedNews.date}</p>
                </div>
              </div>

              <div className="prose prose-invert prose-emerald max-w-none">
                <p className="text-zinc-300 leading-loose text-sm md:text-base whitespace-pre-wrap">{selectedNews.content}</p>
              </div>

              <div className="mt-12 pt-6 border-t border-white/5">
                <button onClick={() => setIsDetailOpen(false)} className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-sm font-bold text-white transition-colors">
                  Tutup Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
}
