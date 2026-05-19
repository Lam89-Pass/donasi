import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden">
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0b1120] relative p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none" style={{ backgroundAttachment: "fixed" }}></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-ramadhan-green/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 bg-ramadhan-green rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <span className="font-black text-2xl tracking-tight text-white">
            Ruang<span className="text-ramadhan-green">Donasi</span>
          </span>
        </div>

        <div className="relative z-10 max-w-md mt-20">
          <h1 className="text-4xl font-black text-white leading-tight mb-6">
            Setiap Langkah Kecilmu Membawa <span className="text-ramadhan-green">Harapan Baru.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">Masuk ke akun Anda dan lanjutkan perjalanan kebaikan. Bersama kita wujudkan senyum untuk mereka yang membutuhkan.</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-gray-500 text-sm font-medium mt-auto">
          <span>&copy; {new Date().getFullYear()} RuangDonasi</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
          <a href="#" className="hover:text-white transition-colors">
            Bantuan
          </a>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-700"></span>
          <a href="#" className="hover:text-white transition-colors">
            Privasi
          </a>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white">
        <Link to="/" className="absolute top-8 left-6 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Beranda
        </Link>

        <div className="w-full max-w-[420px] mt-10 lg:mt-0">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Selamat Datang 👋</h2>
            <p className="text-gray-500 font-medium mt-2">Silakan masukkan detail akun Anda di bawah ini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email atau Nomor HP/WA</label>
              <div className="relative group">
                <input
                  type="text"
                  name="identifier"
                  required
                  value={formData.identifier}
                  onChange={handleChange}
                  placeholder="contoh@email.com atau 0812..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all duration-300 text-sm font-medium"
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-ramadhan-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-11 pr-12 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all duration-300 text-sm font-medium"
                />
                <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-ramadhan-green transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-medium pt-1">
              <label className="flex items-center gap-2.5 text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ramadhan-green focus:ring-ramadhan-green transition-all cursor-pointer" />
                Ingat Saya
              </label>
              <a href="#" className="text-ramadhan-green hover:text-green-700 font-bold transition-colors">
                Lupa Sandi?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-ramadhan-green hover:bg-green-700 text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] hover:shadow-lg transition-all active:scale-[0.98] text-base mt-2 flex items-center justify-center gap-2"
            >
              Masuk
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-8 mb-8">
            <span className="absolute bg-white px-4 text-xs font-bold text-gray-400 tracking-wider">ATAU MASUK DENGAN</span>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 hover:shadow-sm hover:border-gray-300 transition-all active:scale-[0.98] text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <div className="text-center mt-10 text-sm font-medium text-gray-500">
            Belum punya akun?{" "}
            <Link to="/register" className="text-ramadhan-green hover:text-green-700 font-extrabold hover:underline transition-all">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
