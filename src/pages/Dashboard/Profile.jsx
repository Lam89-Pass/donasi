import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Profile() {
  const [loading, setLoading] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Profil berhasil diperbarui!");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="h-24 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5 flex items-center px-8 z-10 sticky top-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-widest text-blue-500 uppercase">Manajemen Identitas</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Pengaturan Profil</h1>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <form onSubmit={handleSave} className="max-w-5xl mx-auto space-y-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-sm font-black text-white">Data Pribadi</h3>
              <p className="text-xs text-zinc-500 mt-2">Informasi dasar yang digunakan untuk identitas donasi Anda.</p>
            </div>
            <div className="md:col-span-2 bg-[#18181b]/80 border border-white/5 p-8 rounded-3xl space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
                  <input type="text" defaultValue="Muhamad Nur Salam" className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Email</label>
                  <input type="email" defaultValue="alam@unpas.ac.id" className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Nomor Telepon</label>
                <input type="tel" defaultValue="081234567890" className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="border-t border-white/5"></div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-sm font-black text-white">Keamanan Akun</h3>
              <p className="text-xs text-zinc-500 mt-2">Kelola kata sandi Anda. Pastikan kombinasi yang kuat.</p>
            </div>
            <div className="md:col-span-2 bg-[#18181b]/80 border border-white/5 p-8 rounded-3xl space-y-6">
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Kata Sandi Baru</label>
                <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Konfirmasi Kata Sandi Baru</label>
                <input type="password" placeholder="Ulangi kata sandi baru" className="w-full bg-[#09090b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-blue-500/50 outline-none transition-all" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold text-xs transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 disabled:opacity-50">
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
