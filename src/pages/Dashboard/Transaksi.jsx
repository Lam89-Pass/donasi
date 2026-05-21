import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";

export default function Transaksi() {
  const [userRole, setUserRole] = useState("user");
  useEffect(() => {
    setUserRole(localStorage.getItem("devRole") || "user");
  }, []);

  const [transactions] = useState([
    { id: "TRX-88291", user: "Muhamad Nur Salam", program: "Bantuan Pangan Pelosok Garut", amount: 150000, date: "20 Mei 2026", status: "Sukses" },
    { id: "TRX-88290", user: "Siti Maela", program: "Renovasi Madrasah", amount: 250000, date: "20 Mei 2026", status: "Pending" },
    { id: "TRX-88285", user: "Nazala (Nana)", program: "Air Bersih NTT", amount: 500000, date: "19 Mei 2026", status: "Sukses" },
    { id: "TRX-88210", user: "Nanas", program: "Beasiswa Anak Yatim", amount: 100000, date: "18 Mei 2026", status: "Gagal" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    return transactions.filter((t) => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.program.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [transactions, searchTerm]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Sukses":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Pending":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default:
        return "text-red-400 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="h-24 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-10 sticky top-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Financial Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">{userRole === "user" ? "Riwayat Donasi" : "Data Transaksi"}</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Volume</p>
              <h3 className="text-2xl font-black text-white">Rp 1.000.000</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sukses</p>
              <h3 className="text-2xl font-black text-emerald-400">650.000</h3>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Pending</p>
              <h3 className="text-2xl font-black text-amber-400">350.000</h3>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Cari ID transaksi atau nama program..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-96 bg-[#18181b] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all"
            />
          </div>

          <div className="bg-[#18181b]/80 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#09090b]/80 border-b border-white/5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-5">ID Transaksi</th>
                  <th className="px-6 py-5">Donatur</th>
                  <th className="px-6 py-5">Program</th>
                  <th className="px-6 py-5">Jumlah</th>
                  <th className="px-6 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredData.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 font-black text-white font-mono">{t.id}</td>
                    <td className="px-6 py-4 text-zinc-300">{t.user}</td>
                    <td className="px-6 py-4 text-zinc-300">{t.program}</td>
                    <td className="px-6 py-4 font-bold text-white">Rp {t.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(t.status)}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
