import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

function DonationCard({ kategori, judul, terkumpul, target, daerah, persen, sisaHari, isUrgent }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      <div className="h-52 bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200"></div>
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/95 backdrop-blur-md text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm">{kategori}</span>
          {isUrgent && <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm border border-red-100 animate-pulse">Mendesak</span>}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-3 text-gray-900 line-clamp-2 group-hover:text-ramadhan-green transition-colors">{judul}</h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center">📍 {daerah}</p>
        <div className="mt-auto">
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div className="bg-ramadhan-green h-2 rounded-full" style={{ width: persen }}></div>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-ramadhan-green">{terkumpul}</span>
            <span className="text-gray-400 font-normal">{sisaHari} Hari lagi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Donasi() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeRegion, setActiveRegion] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const donasiData = [
    { id: 1, kategori: "Sosial", daerah: "Bandung", judul: "Mari Bantu Ibu Adeyati Berjualan Dengan Layak", terkumpul: "Rp 20.000", target: "Rp 5.000.000", persen: "40%", sisaHari: 114, isUrgent: false },
    { id: 2, kategori: "Pendidikan", daerah: "Sumatera", judul: "Tunjukkan Kepedulian untuk Korban Bencana Sumatera", terkumpul: "Rp 0", target: "Rp 10.000.000", persen: "0%", sisaHari: 0, isUrgent: true },
    { id: 3, kategori: "Bencana", daerah: "Jawa Barat", judul: "Pembangunan Hunian Sementara Korban Gempa", terkumpul: "Rp 80.000.000", target: "Rp 100.000.000", persen: "80%", sisaHari: 10, isUrgent: true },
    { id: 4, kategori: "Kesehatan", daerah: "Bandung", judul: "Pengadaan Alat Bantu Dengar Lansia", terkumpul: "Rp 4.200.000", target: "Rp 15.000.000", persen: "28%", sisaHari: 20, isUrgent: false },
    { id: 5, kategori: "Pendidikan", daerah: "Sumatera", judul: "Beasiswa Anak Yatim Berprestasi", terkumpul: "Rp 8.000.000", target: "Rp 20.000.000", persen: "40%", sisaHari: 45, isUrgent: false },
    { id: 6, kategori: "Ekonomi", daerah: "Jawa Barat", judul: "Gerobak Berkah Pejuang Nafkah", terkumpul: "Rp 3.000.000", target: "Rp 15.000.000", persen: "20%", sisaHari: 45, isUrgent: false },
    { id: 7, kategori: "Sosial", daerah: "Bandung", judul: "Sedekah Beras Santri Penghafal Quran", terkumpul: "Rp 21.000.000", target: "Rp 25.000.000", persen: "84%", sisaHari: 3, isUrgent: false },
  ];

  const filteredData = donasiData.filter((item) => (activeCategory === "Semua" || item.kategori === activeCategory) && (activeRegion === "Semua" || item.daerah === activeRegion) && item.judul.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Program Donasi</h1>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-wrap gap-4 items-center">
          <input type="text" placeholder="Cari program..." className="flex-grow p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-ramadhan-green" onChange={(e) => setSearch(e.target.value)} />
          <select onChange={(e) => setActiveRegion(e.target.value)} className="p-3 rounded-xl border border-gray-200 outline-none">
            <option value="Semua">Semua Daerah</option>
            <option value="Bandung">Bandung</option>
            <option value="Sumatera">Sumatera</option>
            <option value="Jawa Barat">Jawa Barat</option>
          </select>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {["Semua", "Sosial", "Pendidikan", "Bencana", "Kesehatan", "Ekonomi"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full font-bold ${activeCategory === cat ? "bg-ramadhan-green text-white" : "bg-white text-gray-600 border"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {currentItems.map((item) => (
            <DonationCard key={item.id} {...item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold ${currentPage === i + 1 ? "bg-ramadhan-green text-white" : "bg-white border"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
