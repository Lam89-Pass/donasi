import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";
import logRegImg from "../../assets/log-reg.png";

function EyeIcon({ show }) {
  return show ? (
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
  );
}

function FormReset({ token }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ["", "Lemah", "Cukup", "Kuat", "Sangat Kuat"][strength];
  const strengthColor = ["", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-ramadhan-green"][strength];
  const strengthText = ["", "text-red-400", "text-yellow-500", "text-blue-500", "text-ramadhan-green"][strength];

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => navigate("/login"), 3000);
    return () => clearTimeout(t);
  }, [done, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Kata sandi tidak cocok!");
      return;
    }
    if (password.length < 8) {
      toast.error("Kata sandi minimal 8 karakter!");
      return;
    }
    setIsLoading(true);
    try {
      await api.post("/api/auth/reset-password", {
        token,
        new_password: password,
        new_password_confirmation: confirmPassword,
      });
      toast.success("Kata sandi berhasil diubah!", { duration: 2000 });
      setDone(true);
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Gagal mengubah kata sandi. Tautan mungkin sudah kadaluarsa.");
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-ramadhan-green/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-ramadhan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-ramadhan-green/30 animate-ping" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Kata Sandi Diperbarui</h2>
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">Kata sandi Anda telah berhasil diubah. Silakan masuk dengan kata sandi baru.</p>
        <Link to="/login" className="inline-flex items-center gap-2 bg-ramadhan-green text-white font-extrabold py-3.5 px-8 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] hover:bg-green-700 transition-all text-sm">
          Masuk Sekarang
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
        <p className="text-xs text-gray-400 font-medium mt-4">Mengalihkan otomatis dalam 3 detik...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Buat Kata Sandi Baru</h2>
        <p className="text-gray-500 font-medium mt-2 text-sm leading-relaxed">Buat kata sandi baru yang kuat. Pastikan tidak sama dengan kata sandi sebelumnya.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi Baru</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 karakter"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors">
              <EyeIcon show={showPass} />
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-gray-200"}`} />
                ))}
              </div>
              <p className={`text-xs font-bold ${strengthText}`}>{strengthLabel}</p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Kata Sandi</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className={`w-full bg-gray-50 border text-gray-900 pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium
                ${
                  confirmPassword && password !== confirmPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : confirmPassword && password === confirmPassword
                      ? "border-green-300 focus:border-ramadhan-green focus:ring-ramadhan-green/10"
                      : "border-gray-200 focus:border-ramadhan-green focus:ring-ramadhan-green/10"
                }`}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-700 transition-colors">
              <EyeIcon show={showConfirm} />
            </button>
            {confirmPassword && (
              <div className="absolute right-12 top-3.5">
                {password === confirmPassword ? (
                  <svg className="w-5 h-5 text-ramadhan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            )}
          </div>
          {confirmPassword && password !== confirmPassword && <p className="text-xs font-bold text-red-400 mt-1">Kata sandi tidak cocok</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading || password !== confirmPassword || password.length < 8}
          className={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 text-base mt-2
            ${isLoading || password !== confirmPassword || password.length < 8 ? "bg-ramadhan-green/60 cursor-not-allowed" : "bg-ramadhan-green hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              Simpan Kata Sandi
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function InvalidToken() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Tautan Tidak Valid</h2>
      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-6">Tautan reset kata sandi ini tidak valid atau sudah kadaluarsa. Silakan minta tautan baru.</p>
      <Link to="/forgot-password" className="inline-flex items-center gap-2 bg-ramadhan-green text-white font-extrabold py-3.5 px-8 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] hover:bg-green-700 transition-all text-sm">
        Minta Tautan Baru
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

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
        <div className="w-full max-w-[420px]">{token ? <FormReset token={token} /> : <InvalidToken />}</div>
      </div>
    </div>
  );
}
