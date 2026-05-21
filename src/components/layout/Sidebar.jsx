import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "user");
      } catch (error) {
        console.error("Token error");
      }
    } else {
      setUserRole(localStorage.getItem("devRole") || "superadmin");
    }
  }, []);

  const toggleDevRole = () => {
    const roles = ["superadmin", "admin", "user"];
    const currentIndex = roles.indexOf(userRole);
    const nextRole = roles[(currentIndex + 1) % roles.length];

    localStorage.setItem("devRole", nextRole);
    setUserRole(nextRole);
    toast.success(`Berubah jadi ${nextRole.toUpperCase()}`);
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("devRole");
    toast.success("Berhasil keluar dari akun!");
    navigate("/login");
  };

  const getRoleStyle = (role) => {
    switch (role) {
      case "superadmin":
        return { text: "Super Admin", badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20", dotClass: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.7)]" };
      case "admin":
        return { text: "Administrator", badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20", dotClass: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.7)]" };
      default:
        return { text: "Donatur Baik", badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dotClass: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" };
    }
  };

  const currentRoleStyle = getRoleStyle(userRole);

  const menuConfig = {
    superadmin: [
      { name: "Statistik", path: "/dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" },
      { name: "Kelola Role", path: "/dashboard/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
      {
        name: "Program Donasi",
        path: "/dashboard/campaigns",
        icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
      { name: "Berita", path: "/dashboard/news", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
      { name: "Transaksi", path: "/dashboard/transactions", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
      {
        name: "Profil",
        path: "/dashboard/profile",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      },
    ],
    admin: [
      { name: "Statistik", path: "/dashboard", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" },
      {
        name: "Program Donasi",
        path: "/dashboard/campaigns",
        icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      },
      { name: "Berita", path: "/dashboard/news", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
      {
        name: "Profil",
        path: "/dashboard/profile",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      },
    ],
    user: [
      { name: "Statistik", path: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
      { name: "Riwayat", path: "/dashboard/transactions", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
      {
        name: "Profil",
        path: "/dashboard/profile",
        icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      },
    ],
  };

  const activeMenus = menuConfig[userRole] || menuConfig.user;

  return (
    <>
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[990] transition-opacity duration-300 ${isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
      ></div>

      <button
        onClick={() => setIsMobileOpen(true)}
        className={`md:hidden fixed bottom-6 right-6 z-[980] w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(5,150,105,0.4)] hover:bg-emerald-500 transition-all duration-300 ${isMobileOpen ? "scale-0" : "scale-100"}`}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <aside
        className={`fixed md:relative top-0 left-0 h-screen bg-[#09090b] border-r border-zinc-800/60 text-zinc-300 flex flex-col transition-all duration-300 ease-in-out z-[999] ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${isCollapsed ? "md:w-[88px]" : "md:w-[280px] w-[280px]"}`}
      >
        <div className={`h-24 flex items-center border-b border-zinc-800/60 transition-all ${isCollapsed ? "justify-center px-0" : "justify-between px-6 gap-2"}`}>
          <div className={`items-center group overflow-hidden ${isCollapsed ? "hidden" : "flex"}`}>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white tracking-tight group-hover:text-emerald-400 transition-colors">RuangDonasi</span>

              <button
                onClick={toggleDevRole}
                title="Klik untuk simulasi ganti Role!"
                className={`mt-1 flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold tracking-wide w-fit capitalize cursor-pointer hover:opacity-80 transition-opacity ${currentRoleStyle.badgeClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${currentRoleStyle.dotClass}`}></span>
                {currentRoleStyle.text}
              </button>
            </div>
          </div>

          <button
            onClick={() => {
              window.innerWidth >= 768 ? setIsCollapsed(!isCollapsed) : setIsMobileOpen(false);
            }}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 border border-transparent hover:border-zinc-700/50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <line x1="3" x2="21" y1="12" y2="12"></line>
              <line x1="3" x2="21" y1="6" y2="6"></line>
              <line x1="3" x2="21" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className={`flex-1 py-6 space-y-1.5 overflow-y-auto overflow-x-hidden ${isCollapsed ? "px-3" : "px-4"}`}>
          {!isCollapsed && <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">Menu Utama</p>}
          {activeMenus.map((menu, index) => {
            const isActive = location.pathname === menu.path || (menu.path !== "/dashboard" && location.pathname.startsWith(menu.path));
            return (
              <Link
                key={index}
                to={menu.path}
                title={isCollapsed ? menu.name : ""}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 py-3 rounded-xl font-medium transition-all text-sm ${isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"} ${isActive ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold shadow-sm" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white border border-transparent"}`}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon}></path>
                </svg>
                <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={`border-t border-zinc-800/60 bg-[#09090b] space-y-2 ${isCollapsed ? "p-3" : "p-4"}`}>
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 py-2.5 text-zinc-400 hover:bg-zinc-800/50 hover:text-white rounded-xl font-medium transition-all text-sm w-full ${isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"}`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>Ke Web Utama</span>
          </Link>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 py-2.5 text-red-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl font-medium transition-all text-sm w-full border border-transparent hover:border-red-500/20 ${isCollapsed ? "md:justify-center md:px-0 px-4" : "px-4"}`}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span className={`whitespace-nowrap ${isCollapsed ? "md:hidden" : ""}`}>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
