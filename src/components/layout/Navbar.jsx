import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRefDesktop = useRef(null);
  const profileRefMobile = useRef(null);
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  let userRole = "user";

  if (isLoggedIn) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role || "user";
    } catch (error) {
      console.error("Token tidak valid");
    }
  }

  const dashboardLink = userRole === "admin" ? "/admin" : userRole === "superadmin" ? "/superadmin" : "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    toast.success("Berhasil keluar dari akun!");
    navigate("/");
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRefDesktop.current && !profileRefDesktop.current.contains(event.target) && profileRefMobile.current && !profileRefMobile.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200" : "bg-transparent border-b-0"}`}>
        <div className={`w-full px-6 lg:px-12 flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-16" : "h-24"}`}>
          <div className="flex-shrink-0">
            <Link to="/" className="font-black text-3xl tracking-tight flex items-center gap-1 group">
              <span className="text-gray-900 group-hover:text-ramadhan-green transition-colors">Ruang Donasi</span>
            </Link>
          </div>

          <div className="flex items-center space-x-3 font-medium">
            {[
              { name: "Beranda", url: "/" },
              { name: "Berita", url: "/berita" },
              { name: "Donasi", url: "/donasi" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.url}
                className="px-5 py-2.5 rounded-full text-base font-semibold tracking-wide text-gray-700 hover:text-ramadhan-green hover:bg-white/50 transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 block transition-transform duration-300 group-hover:scale-105">{link.name}</span>
              </Link>
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

            <div className="flex items-center space-x-3 relative" ref={profileRefDesktop}>
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="inline-block text-center text-base font-bold px-6 py-2.5 rounded-full border-2 border-ramadhan-green text-ramadhan-green hover:bg-ramadhan-green hover:text-white transition-all duration-300 transform active:scale-95"
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="inline-block text-center text-base font-bold px-6 py-2.5 rounded-full bg-ramadhan-green border-2 border-ramadhan-green text-white hover:bg-ramadhan-light shadow-md transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Daftar
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1.5 pr-4 bg-white/80 border border-gray-200 rounded-full hover:shadow-md transition-all active:scale-95">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-ramadhan-green to-green-500 flex items-center justify-center text-white font-bold text-sm shadow-sm uppercase">{userRole.charAt(0)}</div>
                    <span className="text-sm font-bold text-gray-800 capitalize">{userRole}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isProfileOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 origin-top-right animate-[fadeIn_0.2s_ease-out]">
                      <Link to={dashboardLink} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-green-50 hover:text-ramadhan-green transition-colors">
                        Dashboard
                      </Link>
                      {userRole !== "superadmin" && (
                        <Link to="/riwayat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-green-50 hover:text-ramadhan-green transition-colors">
                          Riwayat Donasi
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                        Keluar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
          <Link to="/" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span className="text-xs font-bold mt-1 tracking-wide">Beranda</span>
          </Link>

          <Link to="/berita" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v4a2 2 0 002 2h4M7 10h10M7 14h10"></path>
            </svg>
            <span className="text-xs font-medium mt-1 tracking-wide">Berita</span>
          </Link>

          <Link to="/donasi" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span className="text-xs font-medium mt-1 tracking-wide">Donasi</span>
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="flex flex-col items-center justify-center text-gray-400 hover:text-ramadhan-green group w-16">
              <div className="w-6 h-6 rounded-full border border-gray-300 overflow-hidden flex items-center justify-center group-hover:border-ramadhan-green transition-colors">
                <svg className="w-4 h-4 text-gray-400 group-hover:text-ramadhan-green" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <span className="text-xs font-medium mt-1 tracking-wide">Masuk</span>
            </Link>
          ) : (
            <div className="relative flex flex-col items-center justify-center w-16 cursor-pointer" ref={profileRefMobile}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex flex-col items-center group">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-ramadhan-green to-green-500 flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase group-hover:scale-110 transition-transform">
                  {userRole.charAt(0)}
                </div>
                <span className={`text-xs mt-1 tracking-wide font-bold ${isProfileOpen ? "text-ramadhan-green" : "text-gray-500"}`}>Akun</span>
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-16 right-[-10px] mb-2 w-48 bg-white rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-3 animate-[fadeIn_0.2s_ease-out]">
                  <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                    <p className="text-xs text-gray-500 font-medium">Masuk sebagai</p>
                    <p className="text-sm font-bold text-gray-900 capitalize">{userRole}</p>
                  </div>
                  <Link to={dashboardLink} onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:text-ramadhan-green">
                    Dashboard
                  </Link>
                  {userRole !== "superadmin" && (
                    <Link to="/riwayat" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm font-bold text-gray-700 hover:text-ramadhan-green">
                      Riwayat Donasi
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={handleLogout} className="w-full text-left block px-4 py-1 text-sm font-bold text-red-600">
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
