import React, { useState } from "react";
import bannerImg from "../../../assets/banner.png";

function DonationCard({ kategori, judul, terkumpul, target, persen, sisaWaktu }) {
  return (
    <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-[0_15px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 group flex flex-col relative z-10">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200"></div>
        <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-ramadhan-green text-xs font-bold px-4 py-2 rounded-full shadow-sm">{kategori}</span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-4 text-gray-900 line-clamp-2 transition-colors group-hover:text-ramadhan-green">{judul}</h3>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
            <span>Terkumpul</span>
            <span>Target</span>
          </div>
          <div className="flex justify-between font-extrabold text-gray-900 mb-4">
            <span className="text-ramadhan-green">{terkumpul}</span>
            <span>{target}</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-5 overflow-hidden shadow-inner">
            <div className="bg-ramadhan-green h-2.5 rounded-full relative" style={{ width: persen }}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {sisaWaktu}
            </div>
            <button className="bg-green-50 text-ramadhan-green font-bold px-5 py-2.5 rounded-xl hover:bg-ramadhan-green hover:text-white hover:shadow-md transition-all duration-300 text-sm">Donasi</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentSlidePage, setCurrentSlidePage] = useState(0);

  const categories = ["Semua", "Ekonomi", "Pendidikan", "Sosial", "Bencana"];

  const statsData = [
    {
      label: "Penerima Manfaat",
      value: "50+",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
    },
    {
      label: "Penghimpunan",
      value: "Rp 12.5 Jt",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      label: "Penyaluran",
      value: "Rp 8.2 Jt",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      label: "Donatur",
      value: "120+",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      ),
    },
  ];

  const allDonationsData = [
    { kategori: "Pendidikan", judul: "Bantu Renovasi Sekolah Pelosok yang Hampir Rubuh", terkumpul: "Rp 4.500.000", target: "Rp 40.000.000", persen: "11%", sisaWaktu: "15 Hari" },
    { kategori: "Ekonomi", judul: "Modal Usaha untuk Janda Dhuafa Tulang Punggung Keluarga", terkumpul: "Rp 1.500.000", target: "Rp 10.000.000", persen: "15%", sisaWaktu: "7 Hari" },
    { kategori: "Sosial", judul: "Sedekah Beras untuk Santri Penghafal Quran", terkumpul: "Rp 3.000.000", target: "Rp 25.000.000", persen: "12%", sisaWaktu: "3 Hari" },
    { kategori: "Bencana", judul: "Paket Sembako Darurat Korban Tanah Longsor Jawa Barat", terkumpul: "Rp 5.200.000", target: "Rp 15.000.000", persen: "34%", sisaWaktu: "5 Hari" },
    { kategori: "Ekonomi", judul: "Bantuan Pengadaan Alat Jahit Kelompok Difabel Kreatif", terkumpul: "Rp 2.100.000", target: "Rp 8.000.000", persen: "26%", sisaWaktu: "22 Hari" },
    { kategori: "Bencana", judul: "Penyediaan Air Bersih untuk Pengungsi Erupsi Gunung", terkumpul: "Rp 7.000.000", target: "Rp 30.000.000", persen: "23%", sisaWaktu: "18 Hari" },
  ];

  const displayedDonations = allDonationsData.slice(currentSlidePage * 3, (currentSlidePage + 1) * 3);
  const totalPages = Math.ceil(allDonationsData.length / 3);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 relative">
      <div className="absolute inset-0 z-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" style={{ backgroundAttachment: "fixed" }}></div>

      <div className="relative z-10 w-full">
        <section className="w-full">
          <div className="w-full h-screen relative bg-white cursor-pointer">
            <img src={bannerImg} alt="Banner Utama Donasi" className="w-full h-full object-cover object-center" />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 relative z-20 -mt-24 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.05)] border border-white grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-10 relative overflow-hidden">
            {statsData.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center group cursor-default">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm border border-gray-50 flex items-center justify-center mb-5 group-hover:bg-ramadhan-green group-hover:border-ramadhan-green group-hover:-translate-y-2 transition-all duration-300">
                  <div className="text-ramadhan-green group-hover:text-white transition-colors duration-300">{stat.icon}</div>
                </div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-ramadhan-green transition-colors duration-300">{stat.value}</p>
                <p className="text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">Pilih Kategori Donasi</h2>
            <div className="flex justify-center gap-3 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-7 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
                    activeCategory === cat
                      ? "bg-ramadhan-green text-white shadow-[0_4px_15px_rgba(22,163,74,0.3)] transform scale-105"
                      : "bg-white/80 backdrop-blur-sm text-gray-600 border border-white hover:border-ramadhan-green hover:text-ramadhan-green hover:shadow-md"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
            {displayedDonations.map((item, index) => (
              <DonationCard key={index} {...item} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2.5 mt-10">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlidePage(idx)}
                className={`h-3 rounded-full transition-all duration-300 ${currentSlidePage === idx ? "bg-ramadhan-green w-7 shadow-[0_2px_8px_rgba(22,163,74,0.3)]" : "bg-gray-300 w-3 hover:bg-gray-400"}`}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href="/donasi"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-bold px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
            >
              Lihat Semua Kategori
              <svg className="w-5 h-5 text-ramadhan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </section>

        <section className="py-16 mt-8 bg-white border-y border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Program Donasi Terkini</h2>
                <p className="text-gray-500 font-medium">Program mendesak yang sangat membutuhkan uluran tanganmu segera.</p>
              </div>
              <a href="/donasi" className="text-ramadhan-green font-bold hover:text-green-700 hover:underline transition-all flex items-center gap-1">
                Lihat Semua{" "}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <DonationCard kategori="Bencana" judul="Bantuan Darurat Evakuasi dan Logistik Gempa Bumi" terkumpul="Rp 2.000.000" target="Rp 100.000.000" persen="2%" sisaWaktu="30 Hari" />
              <DonationCard kategori="Sosial" judul="Pembangunan Masjid Al-Ikhlas di Pelosok Desa" terkumpul="Rp 1.500.000" target="Rp 300.000.000" persen="0.5%" sisaWaktu="60 Hari" />
              <DonationCard kategori="Kesehatan" judul="Bantu Biaya Pengobatan Kanker Adik Budi" terkumpul="Rp 0" target="Rp 50.000.000" persen="0%" sisaWaktu="12 Hari" />
            </div>
          </div>
        </section>

        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Berita Terkini</h2>
              <a href="/berita" className="text-[#d81b60] font-bold hover:text-pink-700 transition-colors flex items-center gap-1 text-sm md:text-base">
                Lihat semua &rarr;
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500 h-[350px] md:h-[400px]">
                <div className="absolute inset-0 bg-slate-700">
                  <div className="w-full h-full bg-ramadhan-green/40 group-hover:scale-105 transition-transform duration-700 ease-out"></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                  <div className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 mb-3 w-fit border border-white/20">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    26 Dec 2025
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-snug group-hover:text-gray-200 transition-colors">Bantuan Gizi dari Laznas PYI Disambut Para Petani Dhuafa Desa Tarumajaya Bandung</h3>
                </div>
              </div>

              <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex flex-col overflow-hidden h-[350px] md:h-[400px]">
                <div className="h-44 bg-gray-200 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200"></div>
                  <div className="w-full h-full bg-ramadhan-light/20 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-ramadhan-green transition-colors line-clamp-4 leading-snug">Wujudkan Solidaritas, FOZ Jawa Barat Pimpin Pelepasan Bantuan untuk...</h3>
                  <p className="text-gray-400 text-sm mt-auto font-medium">26 Dec 2025</p>
                </div>
              </div>

              <div className="md:col-span-1 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex flex-col overflow-hidden h-[350px] md:h-[400px]">
                <div className="h-44 bg-gray-200 relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200"></div>
                  <div className="w-full h-full bg-ramadhan-light/20 group-hover:scale-110 transition-transform duration-700 ease-out"></div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-base font-bold text-gray-900 mb-3 group-hover:text-ramadhan-green transition-colors line-clamp-4 leading-snug">Program MESRA Laznas PYI Salurkan Bantuan Gizi untuk Anak Yatim dan Dhuafa di...</h3>
                  <p className="text-gray-400 text-sm mt-auto font-medium">26 Dec 2025</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
