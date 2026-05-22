import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../../api";
import logRegImg from "../../assets/log-reg.png";

function StepInput({ onNext }) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      onNext(email);
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Gagal mengirim email. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Lupa Kata Sandi?</h2>
        <p className="text-gray-500 font-medium mt-2 text-sm leading-relaxed">Masukkan alamat email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3.5 rounded-xl focus:outline-none focus:bg-white focus:border-ramadhan-green focus:ring-4 focus:ring-ramadhan-green/10 transition-all text-sm font-medium"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className={`w-full text-white font-extrabold py-3.5 rounded-xl shadow-[0_4px_15px_rgba(22,163,74,0.25)] transition-all flex items-center justify-center gap-2 text-base mt-2
            ${isLoading || !email.trim() ? "bg-ramadhan-green/60 cursor-not-allowed" : "bg-ramadhan-green hover:bg-green-700 hover:shadow-lg active:scale-[0.98]"}`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              Kirim Tautan Reset
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

function StepSent({ email, onResend }) {
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      toast.success("Email berhasil dikirim ulang!", { duration: 2000 });
      setCooldown(60);
    } catch (error) {
      toast.error("Gagal mengirim ulang. Coba lagi.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="text-center lg:text-left">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ramadhan-green/10 mb-6">
        <svg className="w-8 h-8 text-ramadhan-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Cek Email Anda</h2>
      <p className="text-gray-500 font-medium text-sm leading-relaxed mb-2">Tautan untuk mengatur ulang kata sandi telah dikirim ke</p>
      <p className="text-gray-900 font-extrabold text-sm mb-6">{email}</p>

      <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3.5 mb-8">
        <p className="text-amber-700 text-xs font-semibold leading-relaxed">
          Tautan hanya berlaku selama <span className="font-extrabold">15 menit</span>. Periksa folder spam jika email tidak ditemukan di kotak masuk.
        </p>
      </div>

      <p className="text-sm font-medium text-gray-500">
        Tidak menerima email?{" "}
        <button
          onClick={handleResend}
          disabled={cooldown > 0 || isResending}
          className={`font-extrabold transition-colors ${cooldown > 0 || isResending ? "text-gray-300 cursor-not-allowed" : "text-ramadhan-green hover:text-green-700 hover:underline"}`}
        >
          {cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : isResending ? "Mengirim..." : "Kirim Ulang"}
        </button>
      </p>
    </div>
  );
}

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

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
        {step === 1 && (
          <Link to="/login" className="absolute top-8 left-6 sm:left-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold transition-colors text-sm group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali Masuk
          </Link>
        )}

        <div className="w-full max-w-[420px] mt-10 lg:mt-0">
          {step === 1 && (
            <StepInput
              onNext={(val) => {
                setEmail(val);
                setStep(2);
              }}
            />
          )}
          {step === 2 && <StepSent email={email} />}
        </div>
      </div>
    </div>
  );
}
