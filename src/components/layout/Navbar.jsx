import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/logo-ruangdonasi.png";

const STATIC_PAGES = [
  { label: "Beranda", url: "/", type: "halaman" },
  { label: "Berita", url: "/berita", type: "halaman" },
  { label: "Donasi", url: "/donasi", type: "halaman" },
  { label: "Dashboard", url: "/dashboard", type: "halaman" },
  { label: "Riwayat Transaksi", url: "/riwayat", type: "halaman" },
];

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 350);
  const searchDesktopRef = useRef(null);
  const searchMobileRef = useRef(null);

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

  const dashboardLink = "/dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsProfileOpen(false);
    toast.success("Berhasil keluar dari akun!");
    navigate("/login");
  };

  const isDarkHeader = location.pathname === "/" && !isScrolled;

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      setIsSearchLoading(true);
      try {
        const [beritaRes, donasiRes] = await Promise.allSettled([
          fetch(`/api/berita?search=${encodeURIComponent(q)}&limit=5`, { signal: controller.signal }),
          fetch(`/api/donasi?search=${encodeURIComponent(q)}&limit=5`, { signal: controller.signal }),
        ]);

        const results = [];

        if (beritaRes.status === "fulfilled" && beritaRes.value.ok) {
          const data = await beritaRes.value.json();
          const items = data?.data ?? data ?? [];
          items.forEach((item) => {
            results.push({
              label: item.judul || item.title || "Berita",
              url: `/berita/${item.slug || item.id}`,
              type: "berita",
            });
          });
        }

        if (donasiRes.status === "fulfilled" && donasiRes.value.ok) {
          const data = await donasiRes.value.json();
          const items = data?.data ?? data ?? [];
          items.forEach((item) => {
            results.push({
              label: item.judul || item.nama || item.title || "Program Donasi",
              url: `/donasi/${item.slug || item.id}`,
              type: "donasi",
            });
          });
        }

        const staticMatches = STATIC_PAGES.filter((p) => p.label.toLowerCase().includes(q.toLowerCase()));
        setSearchResults([...staticMatches, ...results]);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gagal mengambil hasil pencarian:", err);
          const staticMatches = STATIC_PAGES.filter((p) => p.label.toLowerCase().includes(debouncedQuery.toLowerCase()));
          setSearchResults(staticMatches);
        }
      } finally {
        setIsSearchLoading(false);
      }
    };

    fetchResults();
    return () => controller.abort();
  }, [debouncedQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim().length === 0) setSearchResults([]);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter") {
      if (searchResults.length > 0) {
        navigate(searchResults[0].url);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        toast.error(`Tidak ada hasil untuk "${searchQuery}"`);
      }
    }
  };

  const handleSearchSelect = (url) => {
    navigate(url);
    setSearchQuery("");
    setSearchResults([]);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRefDesktop.current && !profileRefDesktop.current.contains(event.target) && profileRefMobile.current && !profileRefMobile.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (searchDesktopRef.current && !searchDesktopRef.current.contains(event.target) && searchMobileRef.current && !searchMobileRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const typeBadge = { halaman: "bg-blue-50 text-blue-500", berita: "bg-amber-50 text-amber-600", donasi: "bg-green-50 text-[#1a7a4a]" };
  const typeLabel = { halaman: "Halaman", berita: "Berita", donasi: "Donasi" };

  const SearchDropdown = () => {
    const showDropdown = isSearchFocused && searchQuery.trim().length >= 2;
    if (!showDropdown) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-[fadeIn_0.15s_ease-out] min-w-[240px]">
        {isSearchLoading ? (
          <div className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400">
            <svg className="w-4 h-4 animate-spin flex-shrink-0 text-[#1a7a4a]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Mencari...</span>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <p className="px-4 pt-2.5 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hasil Pencarian</p>
            {searchResults.map((item) => (
              <button key={item.url} onMouseDown={() => handleSearchSelect(item.url)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#1a7a4a] transition-colors text-left">
                <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span className="font-medium flex-1 truncate">{item.label}</span>
                {item.type && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${typeBadge[item.type] || "bg-gray-100 text-gray-500"}`}>{typeLabel[item.type] || item.type}</span>}
              </button>
            ))}
            <div className="h-1" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-4 text-sm text-gray-400 text-center">
            <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Tidak ada hasil untuk <strong className="text-gray-600">&quot;{searchQuery}&quot;</strong>
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-[#1a7a4a]/10" : "bg-transparent border-b-0"}`}>
        <div className={`w-full px-6 lg:px-12 flex items-center justify-between transition-all duration-500 ${isScrolled ? "h-16" : "h-20"}`}>
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Ruang Donasi" className={`object-contain transition-all duration-500 ${isScrolled ? "h-9" : "h-12"}`} />
            </Link>
          </div>

          <nav className="flex items-center space-x-1 font-medium">
            {[
              { name: "Beranda", url: "/" },
              { name: "Berita", url: "/berita" },
              { name: "Donasi", url: "/donasi" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.url}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isDarkHeader ? "text-white hover:text-green-100 hover:bg-white/20" : "text-gray-700 hover:text-[#1a7a4a] hover:bg-[#1a7a4a]/10"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative flex items-center" ref={searchDesktopRef}>
              <input
                type="text"
                placeholder="Cari program..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchSubmit}
                onFocus={() => setIsSearchFocused(true)}
                className={`pl-10 pr-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 transition-all duration-500 w-40 focus:w-64 border ${
                  isScrolled
                    ? "bg-white/60 border-transparent text-gray-800 focus:ring-[#1a7a4a]/40 placeholder-gray-500"
                    : isDarkHeader
                      ? "bg-white/10 border-white/30 text-white focus:ring-white/50 placeholder-gray-300"
                      : "bg-gray-100 border-gray-200 text-gray-800 focus:ring-[#1a7a4a] placeholder-gray-500"
                }`}
              />
              <svg className={`w-4 h-4 absolute left-3.5 ${isDarkHeader ? "text-gray-300" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <SearchDropdown />
            </div>

            <div className={`h-5 w-px ${isDarkHeader ? "bg-white/30" : "bg-gray-300"}`} />

            <div className="relative flex items-center" ref={profileRefDesktop}>
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className={`text-sm font-bold px-5 py-2 rounded-full border-2 transition-all duration-300 mr-2 ${
                      isDarkHeader ? "border-white text-white hover:bg-white hover:text-gray-900" : "border-[#1a7a4a] text-[#1a7a4a] hover:bg-[#1a7a4a] hover:text-white"
                    }`}
                  >
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className={`text-sm font-bold px-5 py-2 rounded-full border-2 transition-all duration-300 hover:opacity-90 shadow-md hover:-translate-y-0.5 ${
                      isDarkHeader ? "bg-white border-white text-gray-900" : "bg-[#1a7a4a] border-[#1a7a4a] text-white"
                    }`}
                  >
                    Daftar
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`w-10 h-10 rounded-full border hover:shadow-md transition-all active:scale-95 flex items-center justify-center ${
                      isDarkHeader ? "bg-white/20 border-white/30 text-white hover:bg-white/30" : "bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-label="Menu akun"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden origin-top-right animate-[fadeIn_0.18s_ease-out]">
                      <div className="py-1">
                        <Link to={dashboardLink} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#1a7a4a] transition-colors group">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1a7a4a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                          </svg>
                          <span className="font-semibold">Dashboard</span>
                        </Link>

                        {userRole !== "superadmin" && (
                          <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#1a7a4a] transition-colors group">
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-[#1a7a4a] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">Riwayat Transaksi</span>
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-100" />
                      <div className="py-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span className="font-semibold">Keluar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div
        className={`md:hidden fixed top-0 left-0 right-0 z-50 px-4 h-14 flex items-center justify-between shadow-sm transition-all duration-300 ${
          isScrolled || !isDarkHeader ? "bg-[#eaf5ef]/90 backdrop-blur-md border-b border-[#1a7a4a]/10" : "bg-transparent border-transparent"
        }`}
      >
        <Link to="/">
          <img src={logo} alt="Ruang Donasi" className="h-8 object-contain" />
        </Link>

        <div className="relative flex items-center" ref={searchMobileRef}>
          <input
            type="text"
            placeholder="Cari..."
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={() => setIsSearchFocused(true)}
            className={`pl-9 pr-3 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#1a7a4a] w-36 ${
              isDarkHeader && !isScrolled ? "bg-white/20 text-white placeholder-gray-200" : "bg-white/70 text-gray-800 placeholder-gray-500"
            }`}
          />
          <svg className={`w-4 h-4 absolute left-3 ${isDarkHeader && !isScrolled ? "text-gray-300" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <SearchDropdown />
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#f9fdfa]/95 backdrop-blur-lg border-t border-[#1a7a4a]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-2xl">
        <div className="flex justify-around items-center h-16 px-2">
          <Link to="/" className="flex flex-col items-center justify-center text-gray-400 hover:text-[#1a7a4a] group w-16">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold mt-1">Beranda</span>
          </Link>

          <Link to="/berita" className="flex flex-col items-center justify-center text-gray-400 hover:text-[#1a7a4a] group w-16">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2zM14 2v4a2 2 0 002 2h4M7 10h10M7 14h10" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Berita</span>
          </Link>

          <Link to="/donasi" className="flex flex-col items-center justify-center text-gray-400 hover:text-[#1a7a4a] group w-16">
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-[10px] font-medium mt-1">Donasi</span>
          </Link>

          {!isLoggedIn ? (
            <Link to="/login" className="flex flex-col items-center justify-center text-gray-400 hover:text-[#1a7a4a] group w-16">
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[10px] font-medium mt-1">Masuk</span>
            </Link>
          ) : (
            <div className="relative flex flex-col items-center justify-center w-16" ref={profileRefMobile}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex flex-col items-center group" aria-label="Menu akun">
                <svg className={`w-5 h-5 transition-transform group-hover:scale-110 ${isProfileOpen ? "text-[#1a7a4a]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className={`text-[10px] mt-1 font-semibold ${isProfileOpen ? "text-[#1a7a4a]" : "text-gray-500"}`}>Akun</span>
              </button>

              {isProfileOpen && (
                <div className="absolute bottom-16 right-[-8px] mb-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_-8px_40px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-[fadeIn_0.18s_ease-out]">
                  <div className="py-1">
                    <Link to={dashboardLink} onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#1a7a4a] hover:bg-green-50 transition-colors">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      Dashboard
                    </Link>

                    {userRole !== "superadmin" && (
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-[#1a7a4a] hover:bg-green-50 transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Riwayat Transaksi
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-gray-100" />
                  <div className="py-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
