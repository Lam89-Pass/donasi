import React from "react";
import bannerImg from "../../../../assets/banner.png";

export default function HeroSection() {
  return (
    <>
      {/* Banner Utama */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="group w-full h-48 md:h-80 lg:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md relative bg-white">
          <img src={bannerImg} alt="Banner Utama Donasi" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" />
        </div>
      </section>

      {/* Kotak Statistik Otomatis */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
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
    </>
  );
}
