import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";

const allCountries = [
  { code: "ID", dial_code: "+62", name: "Indonesia" },
  { code: "MY", dial_code: "+60", name: "Malaysia" },
  { code: "SG", dial_code: "+65", name: "Singapore" },
  { code: "SA", dial_code: "+966", name: "Saudi Arabia" },
  { code: "TH", dial_code: "+66", name: "Thailand" },
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country_code: "+62",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        country_code: formData.country_code,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        navigate("/login");
      }, 2500);
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Terjadi kesalahan saat mendaftar");
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white font-sans overflow-hidden relative">
      <Toaster position="top-center" reverseOrder={false} />

      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500">
          <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center shadow-2xl transform scale-100 animate-[pulse_0.5s_ease-in-out]">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-ramadhan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-gray-500 font-medium text-center">
              Akun Anda telah dibuat.
              <br />
              Mengarahkan ke halaman login...
            </p>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-6 overflow-hidden">
              <div className="bg-ramadhan-green h-full rounded-full animate-[pulse_2s_ease-in-out_infinite] w-full"></div>
            </div>
          </div>
        </div>
      )}

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
            Jadilah Bagian dari <span className="text-ramadhan-green">Perubahan.</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">Daftar sekarang dan bergabunglah dengan ribuan donatur lainnya. 100% transparan dan disalurkan tepat sasaran.</p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-gray-500 text-sm font-medium mt-auto">
          <span>&copy; {new Date().getFullYear()} RuangDonasi</span>
        </div>
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
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
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
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nomor HP/WhatsApp</label>
              <div className="flex gap-2">
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                  className="w-[110px] bg-gray-50 border border-gray-200 text-gray-900 px-2 py-3.5 rounded-xl focus:outline-none focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-bold cursor-pointer"
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
                  className="flex-grow bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
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
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-4 text-gray-400 hover:text-gray-700">
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
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
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-10 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-4 text-gray-400 hover:text-gray-700">
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 text-sm font-medium text-gray-600 pt-1 pb-1 cursor-pointer select-none">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-gray-300 text-ramadhan-green focus:ring-ramadhan-green transition-all cursor-pointer" />
              <span className="leading-relaxed">
                Saya menyetujui{" "}
                <a href="#" className="text-ramadhan-green font-bold hover:underline">
                  Syarat Layanan
                </a>{" "}
                dan{" "}
                <a href="#" className="text-ramadhan-green font-bold hover:underline">
                  Privasi
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 text-base mt-2 ${isLoading || isSuccess ? "bg-ramadhan-green/80 cursor-not-allowed" : "bg-ramadhan-green hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"}`}
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
