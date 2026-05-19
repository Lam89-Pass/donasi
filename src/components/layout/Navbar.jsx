import React, { useState, useEffect } from "react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar Dekstop */}
      <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" : "bg-transparent border-b-0"}`}>
        <div className={`w-full px-6 lg:px-12 flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-16" : "h-24"}`}>
          <div className="flex-shrink-0">
            <a href="/" className="font-black text-3xl tracking-tight flex items-center gap-1 group">
              <span className="text-gray-900 group-hover:text-ramadhan-green transition-colors">Ruang Donasi</span>
            </a>
          </div>

          <div className="flex items-center space-x-3 font-medium">
            {[
              { name: "Beranda", url: "/" },
              { name: "Berita", url: "/berita" },
              { name: "Donasi", url: "/donasi" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="px-5 py-2.5 rounded-full text-base font-semibold tracking-wide text-gray-700 hover:text-ramadhan-green hover:bg-white/50 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 block transition-transform duration-300 group-hover:scale-105">{link.name}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-5">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Cari program..."
                className={`pl-11 pr-4 py-2.5 rounded-full text-sm font-medium focus:outline-none focus:ring-2 transition-all duration-500 w-44 focus:w-72 border ${
                  isScrolled ? "bg-gray-100/80 border-transparent text-gray-800 focus:ring-ramadhan-green/40 placeholder-gray-400" : "bg-white/80 border-gray-200 text-gray-800 focus:ring-ramadhan-green placeholder-gray-500"
                }`}
              />
              <svg className="w-5 h-5 absolute left-3.5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            <div className="flex items-center space-x-3">
              <button className="text-base font-bold px-6 py-2.5 rounded-full border-2 border-ramadhan-green text-ramadhan-green hover:bg-ramadhan-green hover:text-white transition-all duration-300 transform active:scale-95">Masuk</button>
              <button className="text-base font-bold px-6 py-2.5 rounded-full bg-ramadhan-green border-2 border-ramadhan-green text-white hover:bg-ramadhan-light shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95">
                Daftar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md text-gray-900 px-4 h-16 flex items-center justify-between shadow-sm border-b border-gray-100">
        <span className="font-black text-2xl tracking-tight text-ramadhan-green">RuangDonasi</span>
        <div className="relative flex items-center">
          <input type="text" placeholder="Cari..." className="bg-gray-100 text-gray-800 pl-9 pr-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-ramadhan-green placeholder-gray-400 w-40" />
          <svg className="w-4 h-4 absolute left-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] rounded-t-2xl">
        <div className="flex justify-around items-center h-16 px-2">
          <a href="/" className="flex flex-col items-center justify-center text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="text-xs font-bold mt-1 tracking-wide">Beranda</span>
          </a>
          <a href="/berita" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v4a2 2 0 002 2h4M7 10h10M7 14h10"></path>
            </svg>
            <span className="text-xs font-medium mt-1 tracking-wide">Berita</span>
          </a>
          <a href="/donasi" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span className="text-xs font-medium mt-1 tracking-wide">Donasi</span>
          </a>
          <a href="/profile" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <div className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center group-hover:border-ramadhan-green transition-colors">
              <svg className="w-4 h-4 text-gray-400 group-hover:text-ramadhan-green" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <span className="text-xs font-medium mt-1 tracking-wide">Profile</span>
          </a>
        </div>
      </nav>
    </>
  );
}
