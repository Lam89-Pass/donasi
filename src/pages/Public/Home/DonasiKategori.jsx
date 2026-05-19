import React, { useState } from "react";
import DonationCard from "../../../../components/common/DonationCard";

export default function DonasiKategori() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Ekonomi", "Pendidikan", "Sosial", "Bencana"];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 mt-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Pilih Kategori Donasi</h2>

        <div className="flex justify-center gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                activeCategory === cat ? "bg-ramadhan-green text-white shadow-md transform scale-105" : "bg-white text-gray-600 border border-gray-200 hover:border-ramadhan-green hover:text-ramadhan-green"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <DonationCard kategori="Pendidikan" judul="Bantu Renovasi Sekolah Pelosok yang Hampir Rubuh" terkumpul="Rp 12.000.000" target="Rp 40.000.000" persen="30%" sisaWaktu="15 Hari" />
        <DonationCard kategori="Ekonomi" judul="Modal Usaha untuk Janda Dhuafa Tulang Punggung Keluarga" terkumpul="Rp 5.500.000" target="Rp 10.000.000" persen="55%" sisaWaktu="7 Hari" />
        <DonationCard kategori="Sosial" judul="Sedekah Beras untuk Santri Penghafal Quran" terkumpul="Rp 21.000.000" target="Rp 25.000.000" persen="84%" sisaWaktu="3 Hari" />
      </div>
    </section>
  );
}
