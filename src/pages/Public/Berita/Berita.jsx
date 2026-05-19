import React, { useState, useEffect } from "react";

export default function Berita() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ["Semua", "Penyaluran", "Kemanusiaan", "Inspirasi", "Edukasi"];

  const newsData = [
    {
      id: 1,
      title: "Bantuan Ekstra: 1000 Paket Sembako Menuju Pelosok Timur Indonesia",
      excerpt:
        "Menyambut bulan suci, tim RuangDonasi memastikan tidak ada saudara kita yang kelaparan. Perjalanan panjang melintasi lautan demi senyum mereka di ujung timur nusantara. Bantuan ini hasil dari urunan ribuan donatur baik hati.",
      category: "Kemanusiaan",
      date: "19 Mei 2026",
      readTime: "5 Min Baca",
      imageTag: "Highlight",
    },
    {
      id: 2,
      title: "Penyaluran Dana Bantuan Tahap 1 Sukses Dilaksanakan di Pelosok Garut",
      excerpt: "Alhamdulillah, berkat bantuan para donatur, kami telah menyalurkan bantuan bahan pokok dan obat-obatan kepada 500+ keluarga yang membutuhkan.",
      category: "Penyaluran",
      date: "18 Mei 2026",
      readTime: "3 Min Baca",
    },
    {
      id: 3,
      title: "Kisah Inspiratif: Pak Budi Bangkit dari Keterpurukan Berkat Modal Usaha",
      excerpt: "Sempat kehilangan pekerjaan akibat krisis, Pak Budi kini sukses membuka warung kelontong berkat dana pemberdayaan ekonomi.",
      category: "Inspirasi",
      date: "15 Mei 2026",
      readTime: "4 Min Baca",
    },
    {
      id: 4,
      title: "Darurat Bencana: Tim Relawan Diberangkatkan ke Lokasi Banjir Bandang",
      excerpt: "Merespon cepat bencana banjir yang melanda wilayah pesisir, tim gabungan relawan kemanusiaan telah berangkat membawa 2 ton logistik darurat.",
      category: "Kemanusiaan",
      date: "12 Mei 2026",
      readTime: "2 Min Baca",
    },
    {
      id: 5,
      title: "Pentingnya Sedekah Subuh untuk Membuka Pintu Rezeki Tiada Henti",
      excerpt: "Tahukah Anda bahwa sedekah di waktu subuh memiliki keutamaan khusus? Mari pelajari bagaimana rutinitas kecil ini bisa berdampak besar.",
      category: "Edukasi",
      date: "10 Mei 2026",
      readTime: "5 Min Baca",
    },
    {
      id: 6,
      title: "Peresmian Sekolah Darurat untuk Anak-Anak Korban Gempa",
      excerpt: "Pendidikan tidak boleh berhenti. Hari ini kami meresmikan 3 tenda sekolah darurat yang dilengkapi fasilitas belajar mengajar yang layak.",
      category: "Penyaluran",
      date: "08 Mei 2026",
      readTime: "3 Min Baca",
    },
    {
      id: 7,
      title: "Laporan Transparansi Donasi Bulan April 2026",
      excerpt: "Sebagai bentuk amanah, berikut adalah rincian lengkap penghimpunan dan penyaluran dana donasi selama bulan April 2026.",
      category: "Edukasi",
      date: "01 Mei 2026",
      readTime: "6 Min Baca",
    },
    {
      id: 8,
      title: "Kolaborasi RuangDonasi dan Komunitas Lokal Bersihkan Pantai",
      excerpt: "Lebih dari 200 relawan turun tangan membersihkan area pesisir pantai dari sampah plastik dalam rangka memperingati Hari Bumi.",
      category: "Inspirasi",
      date: "28 April 2026",
      readTime: "3 Min Baca",
    },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const filteredNews = activeCategory === "Semua" ? newsData : newsData.filter((item) => item.category === activeCategory);

  const highlightNews = filteredNews.length > 0 ? filteredNews[0] : null;
  const restNews = filteredNews.length > 1 ? filteredNews.slice(1) : [];

  const totalPages = Math.ceil(restNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNews = restNews.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 600, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pt-28 pb-24 relative selection:bg-ramadhan-green selection:text-white">
      <div className="absolute inset-0 z-0 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" style={{ backgroundAttachment: "fixed" }}></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm text-gray-800 text-xs font-black tracking-wider uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-ramadhan-green animate-pulse"></span>
            Ruang Redaksi
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
            Kisah, Kabar & <span className="text-transparent bg-clip-text bg-gradient-to-r from-ramadhan-green to-green-800">Inspirasi</span>
          </h1>
          <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">Menyelami cerita di balik setiap uluran tangan. Dari laporan transparansi hingga kisah perjuangan di pelosok negeri.</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-gray-200 pb-6">
          <div className="flex overflow-x-auto gap-2 w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeCategory === cat ? "bg-gray-900 text-white shadow-md" : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 group">
            <input
              type="text"
              placeholder="Cari artikel..."
              className="w-full bg-white/50 border border-gray-200 text-gray-900 pl-11 pr-4 py-2.5 rounded-full focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all duration-300 text-sm font-medium"
            />
            <svg className="w-4 h-4 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-ramadhan-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
        </div>

        {highlightNews && currentPage === 1 && (
          <div className="mb-20 group cursor-pointer">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              <div className="w-full lg:w-3/5 h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                <div className="absolute inset-0 bg-slate-800">
                  <div className="w-full h-full bg-ramadhan-green/20 group-hover:scale-105 transition-transform duration-1000 ease-out"></div>
                </div>
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm z-10">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs font-black text-gray-900 tracking-wider uppercase">Terkini</span>
                </div>
              </div>

              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5 text-sm font-medium text-gray-500">
                  <span className="text-ramadhan-green font-bold bg-green-50 px-3 py-1 rounded-md">{highlightNews.category}</span>
                  <span>•</span>
                  <span>{highlightNews.date}</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-[1.2] tracking-tight mb-5 group-hover:text-ramadhan-green transition-colors duration-300">{highlightNews.title}</h2>

                <p className="text-gray-500 text-lg leading-relaxed mb-8">{highlightNews.excerpt}</p>

                <div className="flex items-center gap-2 text-gray-900 font-bold group-hover:text-ramadhan-green transition-colors">
                  <span>Baca Selengkapnya</span>
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {restNews.length > 0 && (
          <>
            <h3 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-200 pb-4 inline-block">Artikel Lainnya</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {paginatedNews.map((news) => (
                <div key={news.id} className="group cursor-pointer flex flex-col h-full">
                  <div className="h-60 rounded-3xl overflow-hidden relative mb-6 shadow-sm border border-gray-100">
                    <div className="absolute inset-0 bg-slate-200">
                      <div className="w-full h-full bg-ramadhan-light/10 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-900 shadow-sm">{news.readTime}</div>
                  </div>

                  <div className="flex flex-col flex-grow px-2">
                    <div className="flex items-center gap-2 text-xs font-bold mb-3">
                      <span className="text-ramadhan-green uppercase tracking-wider">{news.category}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">{news.date}</span>
                    </div>

                    <h4 className="text-xl font-black text-gray-900 mb-3 leading-snug group-hover:text-ramadhan-green transition-colors duration-300 line-clamp-2">{news.title}</h4>

                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-5">{news.excerpt}</p>

                    <div className="mt-auto flex items-center text-sm font-bold text-gray-900 group-hover:text-ramadhan-green transition-colors">
                      Baca Artikel
                      <svg className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-20 pt-8 border-t border-gray-200">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                    currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200 bg-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 ${
                      currentPage === page ? "bg-gray-900 text-white shadow-md transform scale-105" : "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
                    currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-200 bg-white"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            )}
          </>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center py-32">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Belum Ada Kabar</h3>
            <p className="text-gray-500 font-medium">Berita untuk kategori ini sedang dalam tahap penyusunan redaksi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
