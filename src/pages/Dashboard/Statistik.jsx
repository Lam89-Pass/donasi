import React, { useState, useEffect } from "react";

export default function Statistik() {
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    setUserRole(localStorage.getItem("devRole") || "superadmin");
  }, []);

  const isUser = userRole === "user";
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b]">
      <header className="h-[72px] bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800/60 flex items-center justify-between px-8 z-10 sticky top-0">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{isUser ? "Ringkasan Donatur" : "Tinjauan Platform"}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time Sinkronisasi
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 max-w-7xl mx-auto">
          <div className="col-span-1 md:col-span-12 lg:col-span-4 relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 to-[#09090b] border border-zinc-800 p-6 flex flex-col justify-between min-h-[220px]">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none"></div>

            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">{isUser ? "Total Kebaikan Saya" : "Akumulasi Dana Masuk"}</p>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">{isUser ? "Rp 1.240.500" : "Rp 8,42M"}</h2>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md w-fit border border-emerald-500/20">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                +12.4% vs bulan lalu
              </div>
              <svg className="w-8 h-8 text-zinc-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-[#18181b] border border-zinc-800/80 rounded-3xl p-5 flex flex-col justify-center relative hover:bg-zinc-900 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white">{isUser ? "12" : "148"}</h3>
              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{isUser ? "Program Didukung" : "Program Donasi Aktif"}</p>
            </div>

            <div className="bg-[#18181b] border border-zinc-800/80 rounded-3xl p-5 flex flex-col justify-center relative hover:bg-zinc-900 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white">{isUser ? "15" : "4,291"}</h3>
              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">Transaksi Sukses</p>
            </div>

            <div className="hidden md:flex bg-[#18181b] border border-zinc-800/80 rounded-3xl p-5 flex-col justify-center relative hover:bg-zinc-900 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-white">{isUser ? "0" : "12.4K"}</h3>
              <p className="text-[11px] font-medium text-zinc-500 mt-0.5">{isUser ? "Sertifikat Kebaikan" : "Total Donatur Terdaftar"}</p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-[#18181b] border border-zinc-800/80 rounded-3xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white">Program Mendesak</h3>
              <button className="text-[11px] font-bold text-zinc-500 hover:text-white transition-colors">Lihat Semua →</button>
            </div>

            <div className="space-y-5 flex-1">
              {[
                { title: "Bantuan Pangan Pelosok Garut", terkumpul: "45.200.000", target: "50.000.000", percent: 90 },
                { title: "Renovasi Madrasah Al-Ikhlas", terkumpul: "12.500.000", target: "25.000.000", percent: 50 },
                { title: "Air Bersih untuk NTT", terkumpul: "8.100.000", target: "100.000.000", percent: 8 },
              ].map((prog, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors">{prog.title}</p>
                    <span className="text-[10px] text-zinc-500 font-medium">
                      Rp {prog.terkumpul} / Rp {prog.target}
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden border border-zinc-800">
                    <div className={`h-full rounded-full relative ${prog.percent > 80 ? "bg-emerald-500" : prog.percent > 40 ? "bg-blue-500" : "bg-red-500"}`} style={{ width: `${prog.percent}%` }}>
                      <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-12 lg:col-span-5 bg-[#18181b] border border-zinc-800/80 rounded-3xl p-6">
            <h3 className="text-sm font-bold text-white mb-6">Aktivitas Terbaru</h3>

            <div className="space-y-4">
              {[
                { name: isUser ? "Anda" : "Hamba Allah", act: "berdonasi Rp 100.000", target: "Renovasi Madrasah", time: "2 mnt lalu" },
                { name: isUser ? "Sistem" : "Muhamad Nur Salam", act: "verifikasi data pencairan", target: "Bantuan Pangan", time: "15 mnt lalu" },
                { name: isUser ? "Anda" : "Siti Maela", act: "berdonasi Rp 50.000", target: "Air Bersih NTT", time: "1 jam lalu" },
                { name: isUser ? "Sistem" : "Anonim", act: "berdonasi Rp 500.000", target: "Bantuan Pangan", time: "2 jam lalu" },
              ].map((feed, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      <span className="font-bold text-zinc-200">{feed.name}</span> {feed.act} untuk <span className="font-medium text-emerald-400">{feed.target}</span>.
                    </p>
                    <p className="text-[9px] font-bold text-zinc-600 mt-0.5">{feed.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center border-t border-zinc-800/50 pt-6 gap-2">
          <p className="text-[10px] font-medium text-zinc-600">© 2026 RuangDonasi. Developed for UNITY #14.</p>
          <div className="flex gap-4 text-[10px] font-bold text-zinc-500">
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Panduan Sistem</span>
            <span className="hover:text-zinc-300 cursor-pointer transition-colors">Lapor Kendala</span>
          </div>
        </div>
      </div>
    </div>
  );
}
