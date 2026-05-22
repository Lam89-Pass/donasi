import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api";
function formatRupiah(num) {
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)} jt`;
  if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)} rb`;
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
}

function formatRupiahFull(num) {
  return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
}

const CATEGORY_COLORS = {
  Sosial: { bg: "#f0fdf4", text: "#15803d", dot: "#22c55e" },
  Pendidikan: { bg: "#eff6ff", text: "#1d4ed8", dot: "#60a5fa" },
  Bencana: { bg: "#fff7ed", text: "#c2410c", dot: "#fb923c" },
  "Bencana Alam": { bg: "#fff7ed", text: "#c2410c", dot: "#fb923c" },
  Kesehatan: { bg: "#fdf4ff", text: "#7e22ce", dot: "#c084fc" },
  Ekonomi: { bg: "#fefce8", text: "#854d0e", dot: "#fbbf24" },
};

export default function DonasiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [item, setItem] = useState(null);
  const [programLainnya, setProgramLainnya] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchCampaignDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);
        setImgError(false);
        const response = await api.get("/api/campaigns", {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const campaigns = response.data.data || [];
        const foundItem = campaigns.find((d) => d.id === Number(id));

        if (!foundItem) {
          setErrorMsg("Program donasi tidak ditemukan atau sudah dihapus.");
        } else {
          setItem(foundItem);
          setProgramLainnya(campaigns.filter((d) => d.id !== foundItem.id).slice(0, 3));
        }
      } catch (error) {
        console.error("Error Fetch Detail:", error);
        if (error.response) {
          setErrorMsg(`Error Server (${error.response.status}): ${error.response.data?.message || "Gagal memuat"}`);
        } else {
          setErrorMsg("Gagal memuat data dari server. Cek koneksi internet atau ngrok.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignDetail();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb" }}>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <div style={{ width: "40px", height: "40px", border: "4px solid #bbf7d0", borderTopColor: "#15803d", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "16px" }}></div>
        <p style={{ color: "#166534", fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>Memuat detail program...</p>
      </div>
    );
  }

  if (errorMsg || !item) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f9fafb", fontFamily: "'Poppins', sans-serif" }}>
        <div style={{ background: "#fef2f2", color: "#991b1b", padding: "30px", borderRadius: "16px", border: "1px solid #fca5a5", textAlign: "center", maxWidth: "400px" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>Gagal Memuat!</h3>
          <p style={{ margin: "0 0 20px", fontSize: "14px" }}>{errorMsg}</p>
          <Link to="/donasi" style={{ display: "inline-block", background: "#991b1b", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>
            Kembali ke Daftar Program
          </Link>
        </div>
      </div>
    );
  }

  const persen = item.target > 0 ? Math.min(100, Math.round((item.terkumpul / item.target) * 100)) : 0;
  const catColor = CATEGORY_COLORS[item.kategori] || CATEGORY_COLORS["Sosial"];
  const hasImage = item.imgSeed && item.imgSeed.trim() !== "";

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "ruangdonasiapi-production.up.railway.app";

  const imgSrc = hasImage ? (item.imgSeed.startsWith("http") ? item.imgSeed : `${BASE_URL}/${item.imgSeed.replace(/^\/+/, "")}`) : null;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Yuk ikut patungan donasi untuk: ${item.judul}`;
  const shareLinks = {
    wa: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    fb: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    tg: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link berhasil disalin!");
    setIsShareModalOpen(false);
  };

  const isEnded = item.sisaHari <= 0;
  const isAlmostDone = !isEnded && item.sisaHari <= 5;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

        .donasi-detail * { font-family: 'Poppins', sans-serif; box-sizing: border-box; }

        .donasi-detail .back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          color: #6b7280; font-size: 13px; font-weight: 500;
          text-decoration: none; transition: color 0.2s;
          padding: 6px 0; margin-bottom: 24px;
        }
        .donasi-detail .back-btn:hover { color: #15803d; }
        .donasi-detail .back-btn svg { transition: transform 0.2s; }
        .donasi-detail .back-btn:hover svg { transform: translateX(-3px); }

        .donasi-detail .card {
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        .donasi-detail .hero-img {
          width: 100%; height: 380px; object-fit: cover; display: block;
          transition: opacity 0.3s;
        }
        .donasi-detail .hero-placeholder {
          width: 100%; height: 380px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%);
          display: flex; align-items: center; justify-content: center;
        }

        .donasi-detail .badge {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 600; padding: 4px 10px;
          border-radius: 99px; letter-spacing: 0.02em;
        }

        .donasi-detail .progress-wrap {
          background: #f3f4f6; border-radius: 99px;
          height: 6px; overflow: hidden; margin-bottom: 14px;
        }
        .donasi-detail .progress-bar {
          height: 100%; border-radius: 99px; background: #15803d;
          transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
        }

        .donasi-detail .stat-item {
          display: flex; flex-direction: column; gap: 2px;
        }
        .donasi-detail .stat-value { font-size: 15px; font-weight: 700; color: #111827; }
        .donasi-detail .stat-label { font-size: 11px; color: #9ca3af; font-weight: 500; }

        .donasi-detail .btn-primary {
          width: 100%; padding: 14px;
          background: #15803d; color: #fff;
          border: none; border-radius: 12px;
          font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          font-family: 'Poppins', sans-serif;
        }
        .donasi-detail .btn-primary:hover { background: #166534; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(21,128,61,0.25); }
        .donasi-detail .btn-primary:active { transform: translateY(0); }
        .donasi-detail .btn-primary:disabled { background: #d1d5db; cursor: not-allowed; transform: none; box-shadow: none; }

        .donasi-detail .btn-outline {
          width: 100%; padding: 13px;
          background: transparent; color: #15803d;
          border: 1.5px solid #15803d; border-radius: 12px;
          font-size: 14px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-family: 'Poppins', sans-serif;
        }
        .donasi-detail .btn-outline:hover { background: #f0fdf4; }

        .donasi-detail .share-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(4px);
          display: flex; align-items: flex-end; justify-content: center;
          padding: 0 0 0 0;
          animation: fadeIn 0.2s ease;
        }
        @media (min-width: 640px) {
          .donasi-detail .share-overlay { align-items: center; padding: 24px; }
        }
        .donasi-detail .share-panel {
          background: #fff; border-radius: 24px 24px 0 0;
          width: 100%; max-width: 440px; padding: 28px;
          animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        @media (min-width: 640px) {
          .donasi-detail .share-panel { border-radius: 24px; animation: scaleIn 0.25s ease; }
        }

        .donasi-detail .share-icon-btn {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          cursor: pointer; text-decoration: none;
        }
        .donasi-detail .share-icon-btn span { font-size: 10px; font-weight: 600; color: #6b7280; }
        .donasi-detail .share-icon-circle {
          width: 52px; height: 52px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; transition: transform 0.2s;
        }
        .donasi-detail .share-icon-btn:hover .share-icon-circle { transform: scale(1.08); }

        .donasi-detail .penggalang-row {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 0; border-top: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
          margin: 20px 0;
        }
        .donasi-detail .avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: #dbeafe; color: #1d4ed8;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 15px; flex-shrink: 0;
        }

        .donasi-detail .tag-row {
          display: flex; align-items: center; gap: 8px;
          flex-wrap: wrap; margin-bottom: 12px;
        }

        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }

        @media (min-width: 1024px) {
          .donasi-detail .main-grid {
            display: grid;
            grid-template-columns: 1fr 420px;
            gap: 32px;
            align-items: start;
          }
          .donasi-detail .sticky-col {
            position: sticky;
            top: 112px;
          }
        }
        @media (max-width: 1023px) {
          .donasi-detail .main-grid { display: flex; flex-direction: column; gap: 24px; }
        }
      `}</style>

      <div className="donasi-detail" style={{ minHeight: "100vh", background: "#f9fafb", paddingTop: 112, paddingBottom: 80 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Link to="/donasi" className="back-btn">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Program Donasi
          </Link>

          <div className="main-grid">
            <div>
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ position: "relative" }}>
                  {hasImage && !imgError ? (
                    <img className="hero-img" src={imgSrc} alt={item.judul} onError={() => setImgError(true)} />
                  ) : (
                    <div className="hero-placeholder">
                      <svg width="64" height="64" fill="none" stroke="#15803d" opacity="0.2" viewBox="0 0 24 24" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                    </div>
                  )}

                  <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
                    <span className="badge" style={{ background: "rgba(255,255,255,0.95)", color: catColor.text }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: catColor.dot, flexShrink: 0 }} />
                      {item.kategori}
                    </span>
                    {item.isUrgent && (
                      <span className="badge" style={{ background: "#fee2e2", color: "#dc2626" }}>
                        ⚡ Mendesak
                      </span>
                    )}
                  </div>

                  <div style={{ position: "absolute", top: 14, right: 14 }}>
                    <span
                      className="badge"
                      style={{
                        background: isEnded ? "#f3f4f6" : isAlmostDone ? "#dc2626" : "rgba(255,255,255,0.95)",
                        color: isEnded ? "#6b7280" : isAlmostDone ? "#fff" : "#374151",
                      }}
                    >
                      {isEnded ? "Berakhir" : `${item.sisaHari} hari lagi`}
                    </span>
                  </div>
                </div>

                <div style={{ padding: "28px 28px 32px" }}>
                  <div className="tag-row">
                    <span style={{ fontSize: 12, color: "#9ca3af", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {item.daerah || "Belum diatur"}
                    </span>
                  </div>

                  <h1 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 700, color: "#111827", lineHeight: 1.45, margin: "0 0 20px" }}>{item.judul}</h1>

                  <div className="penggalang-row">
                    <div className="avatar">{(item.penggalang || "A").charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 2px", fontWeight: 500 }}>Penggalang Dana</p>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                        {item.penggalang || "Admin"}
                        <svg width="14" height="14" fill="#3b82f6" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Kisah & Latar Belakang</h2>
                    <div style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{item.deskripsi || "Belum ada deskripsi untuk campaign ini."}</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 28 }}>
                    {[
                      { label: "Donatur", value: (item.donatur || 0).toLocaleString("id-ID") },
                      { label: "Hari Tersisa", value: isEnded ? "Berakhir" : `${item.sisaHari}` },
                      { label: "Tercapai", value: `${persen}%` },
                    ].map((s) => (
                      <div key={s.label} style={{ background: "#f9fafb", borderRadius: 12, padding: "14px 12px", textAlign: "center", border: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky-col">
              <div className="card" style={{ padding: 28 }}>
                <p style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px" }}>Terkumpul</p>
                <p style={{ fontSize: "clamp(24px,3vw,32px)", fontWeight: 800, color: "#111827", margin: "0 0 4px", lineHeight: 1.2 }}>{formatRupiahFull(item.terkumpul)}</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                  dari target <span style={{ fontWeight: 700, color: "#374151" }}>{formatRupiahFull(item.target)}</span>
                </p>

                <div className="progress-wrap">
                  <div className="progress-bar" style={{ width: `${persen}%` }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 20, borderBottom: "1px solid #f3f4f6", marginBottom: 20 }}>
                  <div className="stat-item">
                    <span className="stat-value" style={{ color: "#15803d" }}>
                      {persen}%
                    </span>
                    <span className="stat-label">Tercapai</span>
                  </div>
                  <div style={{ width: 1, background: "#f3f4f6" }} />
                  <div className="stat-item" style={{ textAlign: "center" }}>
                    <span className="stat-value">{(item.donatur || 0).toLocaleString("id-ID")}</span>
                    <span className="stat-label">Donatur</span>
                  </div>
                  <div style={{ width: 1, background: "#f3f4f6" }} />
                  <div className="stat-item" style={{ textAlign: "right" }}>
                    <span className="stat-value" style={{ color: isAlmostDone ? "#dc2626" : "#111827" }}>
                      {isEnded ? "—" : item.sisaHari}
                    </span>
                    <span className="stat-label">{isEnded ? "Berakhir" : "Hari lagi"}</span>
                  </div>
                </div>

                {!isEnded && (
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>Kekurangan dana</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#15803d" }}>{formatRupiah(Math.max(0, item.target - (item.terkumpul || 0)))}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <button className="btn-primary" onClick={() => navigate(`/donasi/${item.id}/bayar`)} disabled={isEnded}>
                    {isEnded ? "Program Telah Berakhir" : "Donasi Sekarang"}
                  </button>
                  <button className="btn-outline" onClick={() => setIsShareModalOpen(true)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                    Bagikan Program
                  </button>
                </div>

                <div style={{ marginTop: 20, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg width="14" height="14" fill="none" stroke="#9ca3af" viewBox="0 0 24 24" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0, lineHeight: 1.6 }}>Dana dikelola secara transparan dan amanah. Laporan penggunaan dana tersedia untuk semua donatur.</p>
                </div>
              </div>

              {programLainnya.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", margin: "0 0 12px" }}>Program lainnya</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {programLainnya.map((d) => {
                      const p2 = d.target > 0 ? Math.min(100, Math.round((d.terkumpul / d.target) * 100)) : 0;
                      const cc = CATEGORY_COLORS[d.kategori] || CATEGORY_COLORS["Sosial"];
                      return (
                        <Link
                          key={d.id}
                          to={`/donasi/${d.id}`}
                          style={{
                            background: "#fff",
                            borderRadius: 14,
                            border: "1px solid #e5e7eb",
                            padding: "14px 16px",
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                            transition: "box-shadow 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                        >
                          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                            <span className="badge" style={{ background: cc.bg, color: cc.text, flexShrink: 0, marginTop: 1 }}>
                              {d.kategori}
                            </span>
                          </div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: "8px 0 8px", lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{d.judul}</p>
                          <div style={{ width: "100%", height: 4, background: "#f3f4f6", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ width: `${p2}%`, height: "100%", background: "#15803d", borderRadius: 99 }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: "#15803d" }}>{formatRupiah(d.terkumpul)}</span>
                            <span style={{ fontSize: 11, color: "#9ca3af" }}>{p2}%</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <div className="donasi-detail share-overlay" onClick={() => setIsShareModalOpen(false)}>
          <div className="share-panel" onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: "#e5e7eb", borderRadius: 99, margin: "0 auto 20px" }} />

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Bagikan Program Ini</h3>
              <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>Ajak lebih banyak orang untuk ikut berdonasi. Setiap share adalah kebaikan.</p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 24 }}>
              <a href={shareLinks.wa} target="_blank" rel="noopener noreferrer" className="share-icon-btn">
                <div className="share-icon-circle" style={{ background: "#25D366" }}>
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                  </svg>
                </div>
                <span>WhatsApp</span>
              </a>

              <a href={shareLinks.fb} target="_blank" rel="noopener noreferrer" className="share-icon-btn">
                <div className="share-icon-circle" style={{ background: "#1877F2" }}>
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span>Facebook</span>
              </a>

              <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="share-icon-btn">
                <div className="share-icon-circle" style={{ background: "#000" }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span>X / Twitter</span>
              </a>

              <a href={shareLinks.tg} target="_blank" rel="noopener noreferrer" className="share-icon-btn">
                <div className="share-icon-circle" style={{ background: "#0088cc" }}>
                  <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.662 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                </div>
                <span>Telegram</span>
              </a>

              <button className="share-icon-btn" onClick={handleCopyLink} style={{ border: "none", background: "none", padding: 0 }}>
                <div className="share-icon-circle" style={{ background: "#f3f4f6" }}>
                  <svg width="20" height="20" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span>Salin Link</span>
              </button>
            </div>

            <div style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "0 0 4px", fontWeight: 600 }}>Link Program</p>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0, wordBreak: "break-all", lineHeight: 1.5 }}>{shareUrl}</p>
            </div>

            <button
              onClick={() => setIsShareModalOpen(false)}
              style={{ width: "100%", padding: "12px", background: "#f3f4f6", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#6b7280", cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
