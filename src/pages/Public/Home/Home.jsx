import React from "react";
import HeroSection from "./sections/HeroSection";
import DonasiKategori from "./sections/DonasiKategori";
import ProgramDonasiTerkini from "./sections/ProgramDonasiTerkini";
import BeritaTerkini from "./sections/BeritaTerkini";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 pt-24 md:pt-28">
      {/* Bagian Banner & Statistik */}
      <HeroSection />

      {/* Bagian Filter Kategori */}
      <DonasiKategori />

      {/* Bagian List Program Terkini */}
      <ProgramDonasiTerkini />

      {/* Bagian Berita Penyaluran */}
      <BeritaTerkini />
    </div>
  );
}
