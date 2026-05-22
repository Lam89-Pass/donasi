import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";
import { GoogleLogin } from "@react-oauth/google"; 
import logRegImg from "../../assets/log-reg.png";

const allCountries = [
  { code: "ID", dial_code: "+62", name: "Indonesia" },
  { code: "MY", dial_code: "+60", name: "Malaysia" },
  { code: "SG", dial_code: "+65", name: "Singapore" },
  { code: "SA", dial_code: "+966", name: "Saudi Arabia" },
  { code: "TH", dial_code: "+66", name: "Thailand" },
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", country_code: "+62", phone: "", password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      toast.error("Kata sandi tidak cocok!");
      return;
    }

    setIsLoading(true);
    try {
      await api.post(
        "/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          country_code: formData.country_code,
          phone: formData.phone,
          password: formData.password,
          confirm_password: formData.confirm_password,
        },
        {
          headers: { "ngrok-skip-browser-warning": "true" },
        },
      );

      toast.success("Pendaftaran berhasil! Silakan masuk 🎉", { duration: 2500 });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Register Error:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Terjadi kesalahan saat mendaftar");
    } finally {
      setIsLoading(false);
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
        toast.success("Pendaftaran & Masuk dengan Google berhasil! 🎉", { duration: 2000 });
        setTimeout(() => navigate("/"), 1200);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("ERROR GOOGLE:", error.response);
      toast.error(error.response?.data?.error || "Gagal mendaftar via Google");
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

      {/* Gambar Kiri */}
      <div className="hidden lg:flex w-1/2 relative bg-[#0b1120]">
        <img src={logRegImg} alt="Ruang Donasi" className="w-full h-full object-cover object-center" />
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-white overflow-y-auto">
        <Link to="/" className="absolute top-8 left-6 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm group z-20">
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Beranda
        </Link>

        <div className="w-full max-w-[420px] mt-16 mb-8">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Buat Akun Baru ✨</h2>
            <p className="text-gray-500 font-medium mt-2">Isi formulir di bawah ini dengan data yang valid.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Nama sesuai identitas"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="contoh@email.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor HP/WhatsApp</label>
              <div className="flex gap-2">
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  className="w-[110px] bg-gray-50 border border-gray-200 text-gray-900 px-2 py-3.5 rounded-xl focus:outline-none focus:border-ramadhan-green transition-all text-sm font-bold cursor-pointer"
                >
                  {allCountries.map((country, index) => (
                    <option key={index} value={country.dial_code}>
                      {country.code} {country.dial_code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="81234567890"
                  className="flex-grow bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
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
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green transition-all text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi</label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green transition-all text-sm font-medium"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm font-medium text-gray-600 pt-1 pb-1 cursor-pointer select-none">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-gray-300 text-ramadhan-green transition-all" />
              <span className="leading-relaxed">
                Saya menyetujui{" "}
                <a href="#" className="text-ramadhan-green font-bold">
                  Syarat Layanan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-ramadhan-green font-bold">
                  Privasi
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 mt-2 ${isLoading ? "bg-ramadhan-green/80 cursor-not-allowed" : "bg-ramadhan-green hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"}`}
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
                "Daftar Akun"
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center mt-6 mb-6">
            <span className="absolute bg-white px-4 text-xs font-bold text-gray-400 tracking-wider">ATAU DAFTAR DENGAN</span>
            <div className="w-full h-[1px] bg-gray-200"></div>
          </div>

          <div className="w-full flex justify-center [&>div]:w-full">
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Pendaftaran Google dibatalkan.")} theme="outline" size="large" shape="pill" text="continue_with" width="100%" />
          </div>

          <div className="text-center mt-6 text-sm font-medium text-gray-500">
            Sudah memiliki akun?{" "}
            <Link to="/login" className="text-ramadhan-green hover:text-green-700 font-extrabold hover:underline transition-all">
              Masuk Di Sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
