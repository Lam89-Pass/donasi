import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";
import { GoogleLogin } from "@react-oauth/google";
import logRegImg from "../../assets/log-reg.png";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const redirectByRole = (userData) => {
    try {
      const token = userData.token;
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || "user";
      if (role === "admin" || role === "superadmin") {
        return "/dashboard";
      }
    } catch (e) {}
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email_or_phone: formData.identifier,
        password: formData.password,
      });

      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setIsLoading(false);
        toast.success("Berhasil masuk! Selamat datang kembali 👋", {
          duration: 2000,
        });
        setTimeout(() => navigate(redirectByRole(response.data.data)), 1200);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Email / Nomor HP atau kata sandi salah!");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/google", {
        access_token: credentialResponse.credential,
      });

      if (response.data && response.data.data && response.data.data.token) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        setIsLoading(false);
        toast.success("Berhasil masuk dengan Google! 👋", { duration: 2000 });
        setTimeout(() => navigate(redirectByRole(response.data.data)), 1200);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("ERROR GOOGLE:", error.response);
      toast.error(error.response?.data?.error || "Gagal masuk dengan Google");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden relative">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: "12px", fontWeight: "600", fontSize: "14px" },
          success: { style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }, iconTheme: { primary: "#16a34a", secondary: "#f0fdf4" } },
          error: { style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }, iconTheme: { primary: "#dc2626", secondary: "#fef2f2" } },
        }}
      />

      <div className="hidden lg:flex w-1/2 relative bg-[#0b1120]">
        <img src={logRegImg} alt="Ruang Donasi" className="w-full h-full object-cover object-center" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white">
        <Link to="/" className="absolute top-8 left-6 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm group">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Beranda
        </Link>

        <div className="w-full max-w-[420px] mt-10 lg:mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Selamat Datang 👋</h2>
            <p className="text-gray-500 font-medium mt-2">Silakan masukkan detail akun Anda di bawah ini.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email atau Nomor HP</label>
              <input
                type="text"
                name="identifier"
                required
                value={formData.identifier}
                onChange={handleChange}
                placeholder="contoh@email.com atau 0812..."
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
              />
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
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
                />
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

            <div className="flex items-center justify-between text-sm font-medium pt-1 pb-2">
              <label className="flex items-center gap-2.5 text-gray-600 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-ramadhan-green focus:ring-ramadhan-green transition-all cursor-pointer" />
                Ingat Saya
              </label>

              <Link to="/forgot-password" className="text-ramadhan-green hover:text-green-700 font-bold transition-colors">
                Lupa Sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 text-base mt-2 ${isLoading ? "bg-ramadhan-green/80 cursor-not-allowed" : "bg-ramadhan-green hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-6 mb-6">
            <span className="absolute bg-white px-4 text-xs font-bold text-gray-400 tracking-wider">ATAU MASUK DENGAN</span>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <div className="w-full flex justify-center [&>div]:w-full">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Login Google dibatalkan.")} theme="outline" size="large" shape="pill" text="continue_with" width="100%" />
          </div>

          <div className="text-center mt-8 text-sm font-medium text-gray-500">
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
