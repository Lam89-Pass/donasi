import React, { useState } from "react";
import bannerImg from "../../../assets/banner.png";

function DonationCard({ kategori, judul, terkumpul, target, persen, sisaWaktu }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ramadhan-green text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{kategori}</span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-4 text-gray-900 line-clamp-2 group-hover:text-ramadhan-green transition-colors">{judul}</h3>
        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
            <span>Terkumpul</span>
            <span>Target</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 mb-3">
            <span className="text-ramadhan-green">{terkumpul}</span>
            <span>{target}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
            <div className="bg-ramadhan-green h-2.5 rounded-full relative" style={{ width: persen }}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {sisaWaktu}
            </div>
            <button className="bg-green-50 text-ramadhan-green font-bold px-4 py-2 rounded-lg hover:bg-ramadhan-green hover:text-white transition-colors text-sm">Donasi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const categories = ["Semua", "Ekonomi", "Pendidikan", "Sosial", "Bencana"];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 pt-0 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <section className="w-full">
          <div className="group w-full h-[300px] md:h-[500px] overflow-hidden shadow-sm relative bg-white pt-24 md:pt-28">
            <img src={bannerImg} alt="Banner Utama Donasi" className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
          </div>
        </section>

        <section className="w-full px-4 md:px-8 lg:px-12 mt-8">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
            {[
              { label: "Penerima Manfaat", value: "15.4K+" },
              { label: "Penghimpunan", value: "Rp 8.5M" },
              { label: "Penyaluran", value: "Rp 7.2M" },
              { label: "Donatur", value: "23.1K+" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <p className="text-3xl md:text-4xl font-extrabold text-ramadhan-green group-hover:scale-110 transition-transform duration-300">{stat.value}</p>
                <p className="text-gray-500 mt-2 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Kategori Donasi */}
        <section className="w-full px-4 md:px-8 lg:px-12 py-16 mt-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
            <DonationCard kategori="Pendidikan" judul="Bantu Renovasi Sekolah Pelosok yang Hampir Rubuh" terkumpul="Rp 12.000.000" target="Rp 40.000.000" persen="30%" sisaWaktu="15 Hari" />
            <DonationCard kategori="Ekonomi" judul="Modal Usaha untuk Janda Dhuafa Tulang Punggung Keluarga" terkumpul="Rp 5.500.000" target="Rp 10.000.000" persen="55%" sisaWaktu="7 Hari" />
            <DonationCard kategori="Sosial" judul="Sedekah Beras untuk Santri Penghafal Quran" terkumpul="Rp 21.000.000" target="Rp 25.000.000" persen="84%" sisaWaktu="3 Hari" />
            <DonationCard kategori="Bencana" judul="Pembangunan Hunian Sementara Korban Gempa" terkumpul="Rp 80.000.000" target="Rp 100.000.000" persen="80%" sisaWaktu="10 Hari" />
          </div>
        </section>

        {/* Donasi Terkini */}
        <section className="w-full px-4 md:px-8 lg:px-12 pb-16">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Program Donasi Terkini</h2>
              <p className="text-gray-500">Program terbaru yang sangat membutuhkan uluran tanganmu segera.</p>
            </div>
            <a href="/donasi" className="hidden md:block text-ramadhan-green font-semibold hover:text-ramadhan-light hover:underline transition-all">
              Lihat Semua &rarr;
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
            <DonationCard kategori="Bencana" judul="Bantuan Darurat Evakuasi dan Logistik Gempa Bumi" terkumpul="Rp 45.000.000" target="Rp 100.000.000" persen="45%" sisaWaktu="30 Hari" />
            <DonationCard kategori="Sosial" judul="Pembangunan Masjid Al-Ikhlas di Pelosok Desa" terkumpul="Rp 150.000.000" target="Rp 300.000.000" persen="50%" sisaWaktu="60 Hari" />
            <DonationCard kategori="Kesehatan" judul="Bantu Biaya Pengobatan Kanker Adik Budi" terkumpul="Rp 18.000.000" target="Rp 50.000.000" persen="36%" sisaWaktu="12 Hari" />
            <DonationCard kategori="Ekonomi" judul="Gerobak Berkah untuk Pejuang Nafkah Jalanan" terkumpul="Rp 3.000.000" target="Rp 15.000.000" persen="20%" sisaWaktu="45 Hari" />
          </div>
        </section>

        {/* Berita Terkini */}
        <section className="w-full py-16 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="w-full px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita Terkini</h2>
              <p className="text-gray-500">Ikuti perkembangan penyaluran donasi dan kegiatan kami.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group cursor-pointer bg-white p-4 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                  <div className="h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden">
                    <div className="w-full h-full bg-ramadhan-light/20 group-hover:scale-105 transition-transform duration-500"></div>
                  </div>
                  <p className="text-ramadhan-green font-semibold text-sm mb-2">19 Mei 2026</p>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-ramadhan-green transition-colors line-clamp-2">Penyaluran Dana Bantuan Tahap 1 Sukses Dilaksanakan</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">Alhamdulillah, berkat bantuan para donatur, kami telah menyalurkan bantuan berupa bahan pokok dan obat-obatan...</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
