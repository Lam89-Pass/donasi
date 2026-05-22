import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0b1120] text-gray-300 py-16 relative overflow-hidden border-t border-gray-800">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-ramadhan-green/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-ramadhan-green/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="flex flex-col">
            <a href="/" className="font-black text-3xl tracking-tight flex items-center gap-1 mb-6 group w-fit">
              <span className="text-white">RuangDonasi</span>
            </a>
            <p className="text-gray-400 font-medium leading-relaxed mb-6 text-sm">Platform donasi terpercaya, transparan, dan amanah. Bersama wujudkan senyum mereka yang membutuhkan melalui langkah kecil kita hari ini.</p>

            <div className="flex items-start gap-3 text-sm text-gray-400 mb-6 border-b border-gray-800/60 pb-6">
              <div className="mt-0.5 p-1.5 rounded-full bg-gray-800/80 text-ramadhan-green shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <p className="leading-relaxed text-xs mt-2">Jl. Tubagus Ismail Dalam, Dago, Kota Bandung, Jawa Barat</p>
            </div>
          </div>

          <div className="md:pl-12">
            <h4 className="text-white font-extrabold mb-6 text-lg tracking-wide relative inline-block">
              Tautan Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-ramadhan-green rounded-full"></span>
            </h4>
            <ul className="space-y-3.5">
              {[
                { label: "Beranda", url: "/" },
                { label: "Program Donasi", url: "/donasi" },
                { label: "Berita", url: "/berita" },
                { label: "FAQ", url: "/faq" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.url} className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block text-sm font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:pl-6">
            <h4 className="text-white font-extrabold mb-6 text-lg tracking-wide relative inline-block">
              Kategori Donasi
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-ramadhan-green rounded-full"></span>
            </h4>
            <ul className="space-y-3.5">
              {["Pendidikan & Beasiswa", "Sosial & Kemanusiaan", "Bantuan Bencana Alam", "Pemberdayaan Ekonomi", "Kesehatan & Medis"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white hover:translate-x-2 transition-all duration-300 inline-block text-sm font-medium">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()}{" "}
            <a href="#">
              {" "}
              <span className="text-gray-400">RuangDonasi</span>
            </a>
            . Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Syarat & Ketentuan
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Bantuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
