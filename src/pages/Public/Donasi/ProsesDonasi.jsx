import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL || "https://solving-felt-rush-plant.trycloudflare.com";
const getAuthToken = () => localStorage.getItem("token") || sessionStorage.getItem("token") || null;
const PAID_STATUSES = ["paid", "success", "settlement", "capture", "lunas"];
const donasiData = [
  { id: 1, judul: "Mari Bantu Ibu Adeyati Berjualan Dengan Layak" },
  { id: 2, judul: "Tunjukkan Kepedulian untuk Korban Bencana Sumatera" },
  { id: 3, judul: "Pembangunan Hunian Sementara Korban Gempa" },
  { id: 4, judul: "Pengadaan Alat Bantu Dengar Lansia" },
  { id: 5, judul: "Beasiswa Anak Yatim Berprestasi" },
  { id: 6, judul: "Gerobak Berkah Pejuang Nafkah" },
  { id: 7, judul: "Sedekah Beras Santri Penghafal Quran" },
];

const formatRupiahInput = (value) => {
  if (!value) return "";
  const num = value.replace(/[^\d]/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const steps = [
  { number: 1, label: "Nominal" },
  { number: 2, label: "Rincian" },
  { number: 3, label: "Pembayaran" },
];

const POLL_INTERVAL = 5000;
const POLL_TIMEOUT = 5 * 60 * 1000;

export default function ProsesDonasi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const campaign = donasiData.find((d) => d.id === Number(id)) || donasiData[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nominal, setNominal] = useState("");
  const [rawNominal, setRawNominal] = useState(0);
  const [nominalTouched, setNominalTouched] = useState(false);
  const [isAnonim, setIsAnonim] = useState(false);
  const [doa, setDoa] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [txData, setTxData] = useState(null);
  const [pollStatus, setPollStatus] = useState("idle");
  const pollTimerRef = useRef(null);
  const pollTimeoutRef = useRef(null);
  const pollDotRef = useRef(0);
  const [countdown, setCountdown] = useState(5);
  const countdownRef = useRef(null);

  useEffect(() => {
    if (!showSuccess) return;
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [showSuccess]);

  useEffect(() => {
    return () => {
      clearInterval(pollTimerRef.current);
      clearTimeout(pollTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    if (!txData?.transaction_id || currentStep !== 3) return;

    setPollStatus("polling");

    const checkStatus = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/transactions/${txData.transaction_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const status = (json?.data?.status || json?.status || "").toLowerCase();

        if (PAID_STATUSES.includes(status)) {
          stopPolling("confirmed");
          setShowSuccess(true);
        }
      } catch {}
    };

    checkStatus();
    pollTimerRef.current = setInterval(checkStatus, POLL_INTERVAL);
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling("expired");
    }, POLL_TIMEOUT);

    return () => stopPolling("idle");
  }, [txData, currentStep]);

  const stopPolling = (status) => {
    clearInterval(pollTimerRef.current);
    clearTimeout(pollTimeoutRef.current);
    pollTimerRef.current = null;
    pollTimeoutRef.current = null;
    if (status) setPollStatus(status);
  };

  const handleNominalChange = (e) => {
    const raw = e.target.value.replace(/\./g, "");
    setNominalTouched(true);
    if (raw === "" || /^\d+$/.test(raw)) {
      setRawNominal(raw === "" ? 0 : parseInt(raw));
      setNominal(formatRupiahInput(raw));
    }
  };
  const handleQuickSelect = (amount) => {
    setRawNominal(amount);
    setNominal(formatRupiahInput(String(amount)));
    setNominalTouched(true);
  };
  const isNominalError = nominalTouched && rawNominal > 0 && rawNominal < 10000;
  const validateStep1 = () => {
    if (rawNominal < 10000) {
      setNominalTouched(true);
      setApiError("Minimal donasi Rp 10.000");
      return false;
    }
    if (!isAnonim && !namaLengkap.trim()) {
      setApiError("Nama lengkap wajib diisi");
      return false;
    }
    if (!isAnonim && !noTelepon.trim()) {
      setApiError("Nomor telepon wajib diisi");
      return false;
    }
    setApiError("");
    return true;
  };

  const createTransaction = async () => {
    const token = getAuthToken();
    if (!token) {
      navigate("/login");
      return null;
    }
    setIsLoading(true);
    setApiError("");
    try {
      const res = await fetch(`${BASE_URL}/api/transactions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ campaign_id: Number(id), amount: rawNominal }),
      });
      const json = await res.json();
      if (!res.ok) {
        setApiError(json?.error || "Gagal membuat transaksi. Coba lagi.");
        if (res.status === 401) navigate("/auth/login");
        return null;
      }
      return json.data;
    } catch {
      setApiError("Koneksi ke server gagal. Periksa jaringan Anda.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    setApiError("");
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
      window.scrollTo(0, 0);
    } else if (currentStep === 2) {
      const data = await createTransaction();
      if (!data) return;
      setTxData(data);
      setCurrentStep(3);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(`/donasi/${id}`);
      return;
    }
    if (currentStep === 3) {
      stopPolling("idle");
      setTxData(null);
    }
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const displayTotal = txData?.total_pembayaran ?? rawNominal;

  const [dotCount, setDotCount] = useState(1);
  useEffect(() => {
    if (pollStatus !== "polling") return;
    const t = setInterval(() => setDotCount((d) => (d >= 3 ? 1 : d + 1)), 600);
    return () => clearInterval(t);
  }, [pollStatus]);
  const dots = ".".repeat(dotCount);

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-32 relative overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        @keyframes scale-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fade-in  { from{opacity:0} to{opacity:1} }
        @keyframes pop-up   { from{opacity:0;transform:scale(0.85) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes pulse-ring { 0%{transform:scale(0.9);opacity:0.6} 70%{transform:scale(1.15);opacity:0} 100%{transform:scale(0.9);opacity:0} }
        .spinner   { animation: spin 0.8s linear infinite; }
        .step-content { animation: scale-in 0.3s ease-out; }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%2316a34a' stroke-width='0.75' stroke-opacity='0.08'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%2316a34a' stroke-width='0.75' stroke-opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: "80px",
        }}
      />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 relative z-10">
        <button onClick={handleBack} disabled={isLoading} className="inline-flex items-center gap-1 text-gray-500 hover:text-green-700 transition-colors mb-6 group font-medium text-sm disabled:opacity-50">
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </button>
        <div className="mb-6 px-1">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-widest mb-1">Program Donasi</p>
          <h1 className="text-base font-bold text-gray-900 leading-snug line-clamp-2">{campaign.judul}</h1>
        </div>

        <div className="bg-white px-6 py-5 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => {
              const done = currentStep > step.number;
              const active = currentStep === step.number;
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center gap-1.5 w-16">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                      ${done ? "bg-green-700 text-white" : active ? "bg-green-700 text-white ring-4 ring-green-100" : "bg-gray-100 text-gray-400"}`}
                    >
                      {done ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.number
                      )}
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${done || active ? "text-green-700" : "text-gray-400"}`}>{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 mb-4 mx-1 rounded-full overflow-hidden bg-gray-100">
                      <div className="h-full bg-green-700 rounded-full transition-all duration-500" style={{ width: currentStep > step.number ? "100%" : "0%" }} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {apiError && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-medium" style={{ animation: "scale-in 0.2s ease-out" }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {apiError}
          </div>
        )}

        {currentStep === 1 && (
          <div className="step-content space-y-6 pb-10">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <h3 className="text-base font-bold text-gray-900">Masukkan Nominal Donasi</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[10000, 25000, 50000, 100000, 200000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickSelect(amount)}
                    className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all text-center
                      ${rawNominal === amount ? "bg-green-50 border-green-700 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:border-green-700"}`}
                  >
                    Rp {amount.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>
              <div className="pt-2">
                <label className={`text-xs font-semibold mb-1.5 block ${isNominalError ? "text-red-500" : "text-gray-500"}`}>Nominal Lainnya (Minimal Rp 10.000)</label>
                <div className={`flex items-center border-b-2 pb-2 transition-colors ${isNominalError ? "border-red-400" : "border-gray-200 focus-within:border-green-700"}`}>
                  <span className={`text-2xl font-black mr-2 ${isNominalError ? "text-red-400" : "text-gray-900"}`}>Rp</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={nominal}
                    onChange={handleNominalChange}
                    placeholder="0"
                    className={`w-full text-4xl font-black outline-none bg-transparent placeholder:text-gray-200 ${isNominalError ? "text-red-500" : "text-gray-900"}`}
                  />
                </div>
                {isNominalError && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Minimal donasi Rp 10.000
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Data Donatur</h3>
              </div>

              <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center border border-gray-100">
                Sudah punya akun?{" "}
                <button onClick={() => navigate("/login")} className="text-green-700 font-bold hover:underline">
                  Masuk di sini
                </button>{" "}
                atau lengkapi data di bawah.
              </div>

              {!isAnonim && (
                <div className="space-y-4" style={{ animation: "scale-in 0.2s ease-out" }}>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={namaLengkap}
                      onChange={(e) => setNamaLengkap(e.target.value)}
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-4 focus:ring-green-50 text-sm bg-white placeholder:text-gray-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={noTelepon}
                      onChange={(e) => setNoTelepon(e.target.value)}
                      placeholder="Contoh: 0812 3456 7890"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-4 focus:ring-green-50 text-sm bg-white placeholder:text-gray-300 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                      Email <span className="text-gray-400 font-normal">(Opsional)</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-4 focus:ring-green-50 text-sm bg-white placeholder:text-gray-300 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer select-none" onClick={() => setIsAnonim(!isAnonim)}>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Donasi sebagai Hamba Allah</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Sembunyikan nama Anda dari publik</p>
                </div>
                <div className={`w-12 h-7 rounded-full p-1 flex transition-colors duration-300 flex-shrink-0 ${isAnonim ? "bg-green-700" : "bg-gray-200"}`}>
                  <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${isAnonim ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-2 block">
                  Pesan & Doa <span className="font-normal">(Opsional)</span>
                </label>
                <textarea
                  value={doa}
                  onChange={(e) => setDoa(e.target.value)}
                  placeholder="Tulis pesan atau doa untuk diri sendiri / penerima manfaat"
                  rows="4"
                  className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:border-green-700 focus:ring-4 focus:ring-green-50 bg-gray-50 text-sm placeholder:text-gray-300 resize-none transition-all"
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                Dengan menekan <strong className="text-gray-600">Lanjut ke Rincian</strong>, Anda menyetujui <button className="text-green-700 font-semibold hover:underline">Syarat & Ketentuan</button> yang berlaku.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content space-y-4 pb-10">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 pb-3 border-b border-gray-100">Ringkasan Donasi</h3>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-1">Total yang kamu donasikan</p>
                  <p className="text-4xl font-black text-gray-900">Rp {rawNominal.toLocaleString("id-ID")}</p>
                </div>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    window.scrollTo(0, 0);
                  }}
                  className="text-xs font-bold text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all"
                >
                  Ubah
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-gray-500">Nama Donatur</span>
                  <span className="font-bold text-gray-900">{isAnonim ? "Hamba Allah" : namaLengkap || "—"}</span>
                </div>
                {!isAnonim && noTelepon && (
                  <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                    <span className="text-gray-500">No. Telepon</span>
                    <span className="font-bold text-gray-900">{noTelepon}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2.5 border-b border-gray-50">
                  <span className="text-gray-500">Program</span>
                  <span className="font-bold text-gray-900 text-right max-w-[55%] line-clamp-2 leading-snug">{campaign.judul}</span>
                </div>
                {doa && (
                  <div className="flex justify-between items-start py-2.5 border-b border-gray-50 gap-4">
                    <span className="text-gray-500 flex-shrink-0">Pesan / Doa</span>
                    <span className="font-medium text-gray-700 text-right text-xs leading-relaxed">{doa}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3 px-4 py-4 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 14v1m8-8h-1M5 12H4m14.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-green-800 mb-0.5">Pembayaran via QRIS</p>
                <p className="text-xs text-green-700 leading-relaxed">Setelah konfirmasi, sistem generate QRIS khusus transaksi ini. Pembayaran otomatis terkonfirmasi setelah kamu scan dan bayar — tanpa perlu tap tombol apapun.</p>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && txData && (
          <div className="step-content space-y-4 pb-10">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex flex-col items-center text-center gap-4">
                {pollStatus === "polling" && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-bold px-4 py-2 rounded-full border border-blue-100" style={{ animation: "scale-in 0.3s ease-out" }}>
                    <svg className="w-3.5 h-3.5 spinner" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Menunggu pembayaran{dots}
                  </div>
                )}
                {pollStatus === "expired" && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-500 text-xs font-bold px-4 py-2 rounded-full border border-red-100">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    QR sudah kedaluwarsa — silakan ulangi transaksi
                  </div>
                )}

                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-bold px-3 py-1.5 rounded-full border border-amber-100">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  QR berlaku 5 menit
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                  <span className="text-xs text-gray-400 font-medium">ID Transaksi:</span>
                  <span className="text-xs font-bold text-gray-700 font-mono">#{txData.transaction_id}</span>
                </div>

                <div className={`relative p-3 rounded-2xl border-2 border-dashed transition-all ${pollStatus === "expired" ? "border-red-200 bg-red-50 opacity-50" : "border-green-200 bg-green-50"}`}>
                  <img src={txData.qris_image} alt="QRIS Ruang Donasi" style={{ width: "220px", height: "220px", borderRadius: "12px", display: "block" }} />
                  <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-green-700 rounded-tl-md" />
                  <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-green-700 rounded-tr-md" />
                  <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-green-700 rounded-bl-md" />
                  <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-green-700 rounded-br-md" />
                </div>
                <div>
                  <p className="text-2xl font-black text-gray-900">Rp {txData.total_pembayaran.toLocaleString("id-ID")}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Termasuk kode unik <span className="text-green-700 font-bold">+Rp {txData.kode_unik}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap justify-center">
                  {[
                    { name: "DANA", logo: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg" },
                    { name: "GoPay", logo: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg" },
                    { name: "OVO", logo: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg" },
                    { name: "ShopeePay", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/ShopeePay_logo.svg/512px-ShopeePay_logo.svg.png" },
                  ].map((w) => (
                    <div key={w.name} className="w-12 h-7 flex items-center justify-center bg-white rounded-lg border border-gray-100 p-1 shadow-sm">
                      <img
                        src={w.logo}
                        alt={w.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Scan QR di atas. Konfirmasi pembayaran akan <strong className="text-gray-600">otomatis terdeteksi</strong> — tidak perlu tap tombol apapun setelah bayar.
                </p>

                {pollStatus === "polling" && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div style={{ position: "relative", width: 10, height: 10 }}>
                      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#16a34a", animation: "pulse-ring 1.5s ease infinite" }} />
                      <div style={{ position: "absolute", inset: 2, borderRadius: "50%", background: "#16a34a" }} />
                    </div>
                    Sistem sedang memantau status pembayaran
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 pb-3 border-b border-gray-100">Rincian Transaksi</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nominal Donasi</span>
                  <span className="font-bold text-gray-900">Rp {txData.nominal_asli.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Kode Unik Sistem</span>
                  <span className="font-bold text-green-700">+ Rp {txData.kode_unik}</span>
                </div>
                <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Tagihan</span>
                  <span className="text-xl font-black text-gray-900">Rp {txData.total_pembayaran.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Data Donatur</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Nama</span>
                  <span className="font-bold text-gray-900">{isAnonim ? "Hamba Allah" : namaLengkap || "—"}</span>
                </div>
                {!isAnonim && noTelepon && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Telepon</span>
                    <span className="font-bold text-gray-900">{noTelepon}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    Menunggu Pembayaran
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.04)] p-4 z-50">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Donasi</p>
            <p className="text-xl font-black text-gray-900">Rp {displayTotal > 0 ? displayTotal.toLocaleString("id-ID") : "0"}</p>
          </div>

          {currentStep === 3 ? (
            <div
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold
              ${pollStatus === "expired" ? "bg-red-50 text-red-500 border border-red-200" : "bg-green-50 text-green-700 border border-green-200"}`}
            >
              {pollStatus === "polling" && (
                <svg className="w-4 h-4 spinner" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {pollStatus === "polling" ? `Menunggu${dots}` : pollStatus === "expired" ? "QR Kedaluwarsa" : "Terkonfirmasi"}
            </div>
          ) : (
            <button
              onClick={handleNextStep}
              disabled={isLoading || (currentStep === 1 && rawNominal < 10000)}
              className={`px-6 sm:px-10 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2
                ${isLoading ? "bg-green-700 text-white cursor-wait opacity-80" : currentStep === 1 && rawNominal < 10000 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-700 text-white hover:bg-green-800"}`}
            >
              {isLoading && (
                <svg className="w-4 h-4 spinner" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isLoading ? "Memproses..." : currentStep === 1 ? "Lanjut ke Rincian" : "Generate QRIS"}
            </button>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ animation: "fade-in 0.3s ease-out" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center" style={{ animation: "pop-up 0.4s cubic-bezier(0.175,0.885,0.32,1.275)" }}>
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-green-50 animate-ping opacity-30" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shadow-lg shadow-green-200">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-1">Pembayaran Berhasil!</h2>
            <p className="text-gray-500 text-sm mb-1 leading-relaxed">Jazakallah khayran atas donasi Anda sebesar</p>
            <span className="text-2xl font-black text-green-700 block mb-2">Rp {(txData?.nominal_asli ?? rawNominal).toLocaleString("id-ID")}</span>
            {txData && (
              <p className="text-xs text-gray-400 mb-5">
                ID Transaksi: <span className="font-bold font-mono">#{txData.transaction_id}</span>
              </p>
            )}

            <div className="border-t border-dashed border-gray-100 mb-5" />

            <div className="grid grid-cols-2 gap-3 text-left mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Nama</p>
                <p className="text-xs font-bold text-gray-800 truncate">{isAnonim ? "Hamba Allah" : namaLengkap || "—"}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Metode</p>
                <p className="text-xs font-bold text-gray-800">QRIS</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/");
                }}
                className="w-full py-3.5 rounded-xl bg-green-700 text-white font-bold text-sm hover:bg-green-800 active:scale-95 transition-all shadow-md shadow-green-100"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate(`/donasi/${id}`);
                }}
                className="w-full py-3 rounded-xl bg-gray-50 text-gray-500 font-semibold text-sm hover:bg-gray-100 active:scale-95 transition-all border border-gray-100"
              >
                Lihat Detail Program
              </button>
            </div>

            <p className="text-[10px] text-gray-300 mt-4">Halaman otomatis kembali dalam {countdown}s</p>
          </div>
        </div>
      )}
    </div>
  );
}
