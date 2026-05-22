import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";
const PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'>
  <g fill='none' stroke='%23166534' stroke-width='0.6' opacity='0.07'>
    <polygon points='40,4 76,22 76,58 40,76 4,58 4,22' />
    <polygon points='40,16 64,28 64,52 40,64 16,52 16,28' />
    <line x1='40' y1='4' x2='40' y2='16'/>
    <line x1='76' y1='22' x2='64' y2='28'/>
    <line x1='76' y1='58' x2='64' y2='52'/>
    <line x1='40' y1='76' x2='40' y2='64'/>
    <line x1='4' y1='58' x2='16' y2='52'/>
    <line x1='4' y1='22' x2='16' y2='28'/>
    <circle cx='40' cy='40' r='8' stroke-width='0.5'/>
  </g>
</svg>`;

const CATEGORIES = ["Semua", "Sosial", "Pendidikan", "Bencana Alam", "Kesehatan", "Ekonomi"];
const REGIONS = [
  "Semua",
  "Aceh",
  "Sumatera Utara",
  "Sumatera Barat",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Bengkulu",
  "Sumatera Selatan",
  "Kepulauan Bangka Belitung",
  "Lampung",
  "DKI Jakarta",
  "Jawa Barat",
  "Banten",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Barat",
  "Nusa Tenggara Timur",
  "Kalimantan Barat",
  "Kalimantan Tengah",
  "Kalimantan Selatan",
  "Kalimantan Timur",
  "Kalimantan Utara",
  "Sulawesi Utara",
  "Gorontalo",
  "Sulawesi Tengah",
  "Sulawesi Barat",
  "Sulawesi Selatan",
  "Sulawesi Tenggara",
  "Maluku",
  "Maluku Utara",
  "Papua Barat",
  "Papua Barat Daya",
  "Papua",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Tengah",
  "Belum diatur",
];

function formatRupiah(num) {
  return `Rp ${Number(num).toLocaleString("id-ID")}`;
}

function DonationCard({ id, kategori, judul, terkumpul, target, daerah, sisaHari, isUrgent, imgSeed }) {
  const progressPercent = target > 0 ? Math.min(100, Math.round((terkumpul / target) * 100)) : 0;
  const urgent = isUrgent || sisaHari <= 5;
  const donasiState = { id, kategori, judul, terkumpul, target, daerah, sisaHari };
  const hasImage = imgSeed && imgSeed.trim() !== "";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "ruangdonasiapi-production.up.railway.app";
  const imgSrc = hasImage ? (imgSeed.startsWith("http") ? imgSeed : `${BASE_URL}/${imgSeed.replace(/^\/+/, "")}`) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
        borderRadius: "16px",
        border: urgent ? "1.5px solid #bbf7d0" : "1px solid #e5e7eb",
        overflow: "hidden",
        transition: "box-shadow 0.22s ease, transform 0.22s ease",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        position: "relative",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.10)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Link to={`/donasi/${id}`} state={{ donasi: donasiState }} style={{ textDecoration: "none", color: "inherit" }}>
        <div style={{ height: "160px", position: "relative", overflow: "hidden", background: "#f3f4f6" }}>
          {hasImage ? (
            <img
              src={imgSrc}
              alt={judul}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="48" height="48" fill="none" stroke="#15803d" opacity="0.2" viewBox="0 0 24 24" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          <span
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              background: "rgba(255,255,255,0.92)",
              color: "#166534",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.02em",
            }}
          >
            {kategori}
          </span>

          <span
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: sisaHari <= 5 ? "#dc2626" : "rgba(255,255,255,0.92)",
              color: sisaHari <= 5 ? "#ffffff" : "#166534",
              fontSize: "11px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
            }}
          >
            {sisaHari === 0 ? "Berakhir" : `${sisaHari} hari lagi`}
          </span>
        </div>

        <div style={{ padding: "16px 18px 14px", display: "flex", flexDirection: "column" }}>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: "0 0 6px" }}>{daerah}</p>
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              lineHeight: 1.5,
              margin: "0 0 14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            {judul}
          </h3>

          <div style={{ width: "100%", height: "5px", background: "#f3f4f6", borderRadius: "99px", overflow: "hidden", marginBottom: "8px" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "#15803d", borderRadius: "99px", transition: "width 0.6s ease" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#15803d", margin: 0 }}>{formatRupiah(terkumpul)}</p>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "2px 0 0" }}>dari {formatRupiah(target)}</p>
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6b7280" }}>{progressPercent}%</span>
          </div>
        </div>
      </Link>

      <div style={{ padding: "0 18px 18px" }}>
        <Link
          to={`/donasi/${id}/bayar`}
          state={{ donasi: donasiState }}
          onClick={(e) => e.stopPropagation()}
          style={{
            display: "block",
            width: "100%",
            padding: "10px 0",
            background: "#15803d",
            color: "#ffffff",
            borderRadius: "10px",
            fontSize: "13px",
            fontWeight: 700,
            textAlign: "center",
            textDecoration: "none",
            transition: "background 0.18s ease",
            boxSizing: "border-box",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#166534";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#15803d";
          }}
        >
          Donasi Sekarang
        </Link>
      </div>
    </div>
  );
}

export default function Donasi() {
  const [donasiData, setDonasiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeRegion, setActiveRegion] = useState("Semua");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const response = await api.get("/api/campaigns", {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const result = response.data;
        const campaigns = result.data || [];

        setDonasiData(campaigns);
      } catch (error) {
        console.error("Error Detail Fetch API:", error);
        if (error.response) {
          setErrorMsg(`Error Server (${error.response.status}): ${error.response.data?.message || "Gagal memuat"}`);
        } else {
          setErrorMsg(error.message + " (Cek koneksi internet atau ngrok)");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredData = useMemo(() => {
    return donasiData.filter(
      (item) => (activeCategory === "Semua" || item.kategori === activeCategory) && (activeRegion === "Semua" || item.daerah === activeRegion) && (item.judul ? item.judul.toLowerCase().includes(search.toLowerCase()) : false),
    );
  }, [donasiData, activeCategory, activeRegion, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };
  const handleRegionChange = (e) => {
    setActiveRegion(e.target.value);
    setCurrentPage(1);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        backgroundImage: `url("data:image/svg+xml,${PATTERN_SVG}")`,
        backgroundSize: "80px 80px",
        paddingTop: "96px",
        paddingBottom: "80px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .donasi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:24px; }
        .filter-btn { border:none; background:none; cursor:pointer; }
        .filter-btn:focus-visible { outline:2px solid #166534; outline-offset:2px; border-radius:99px; }
        input:focus, select:focus { outline:none; box-shadow:0 0 0 3px #bbf7d0; border-color:#16a34a !important; }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ marginBottom: "40px", animation: "fadeUp 0.5s ease both" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900,
              color: "#111827",
              fontFamily: "'Poppins', sans-serif",
              margin: "0 0 10px",
              lineHeight: 1.2,
            }}
          >
            Program Donasi
          </h1>
          <p style={{ fontSize: "15px", color: "#6b7280", margin: 0, maxWidth: "480px" }}>Setiap rupiah yang Anda titipkan akan dikelola secara transparan dan amanah untuk sesama yang membutuhkan.</p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            animation: "fadeUp 0.5s 0.1s ease both",
          }}
        >
          <div style={{ flex: "1 1 220px", position: "relative" }}>
            <input
              type="text"
              placeholder="Cari program donasi..."
              onChange={handleSearch}
              style={{
                width: "100%",
                padding: "9px 14px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>

          <select
            onChange={handleRegionChange}
            style={{
              padding: "9px 14px",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              background: "#fff",
              color: "#374151",
              cursor: "pointer",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r === "Semua" ? "Semua Provinsi" : r}
              </option>
            ))}
          </select>

          <span style={{ fontSize: "13px", color: "#9ca3af", marginLeft: "auto" }}>{filteredData.length} program</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            overflowX: "auto",
            paddingBottom: "4px",
            scrollbarWidth: "none",
            animation: "fadeUp 0.5s 0.15s ease both",
          }}
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                className="filter-btn"
                onClick={() => handleCategoryChange(cat)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "99px",
                  fontSize: "13px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  border: active ? "none" : "1px solid #d1d5db",
                  background: active ? "#15803d" : "#ffffff",
                  color: active ? "#ffffff" : "#374151",
                  transition: "all 0.18s ease",
                  boxShadow: active ? "0 4px 12px rgba(21,128,61,0.2)" : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {errorMsg && (
          <div style={{ textAlign: "center", padding: "40px 24px", background: "#fef2f2", color: "#991b1b", borderRadius: "16px", border: "1px solid #fca5a5", marginBottom: "48px" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>Gagal Mengambil Data Backend!</h3>
            <p style={{ margin: 0, fontSize: "14px" }}>{errorMsg}</p>
          </div>
        )}

        {!errorMsg && isLoading && (
          <div style={{ textAlign: "center", padding: "80px 24px", color: "#166534", fontWeight: 600 }}>
            <div style={{ display: "inline-block", width: "30px", height: "30px", border: "4px solid #bbf7d0", borderTopColor: "#15803d", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "15px" }}></div>
            <p>Mengambil data dari server...</p>
          </div>
        )}

        {!errorMsg && !isLoading && currentItems.length > 0 ? (
          <div className="donasi-grid" style={{ marginBottom: "48px", animation: "fadeUp 0.5s 0.2s ease both" }}>
            {currentItems.map((item) => (
              <DonationCard key={item.id} {...item} />
            ))}
          </div>
        ) : (
          !errorMsg &&
          !isLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                marginBottom: "48px",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>Program belum ada</p>
              <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Belum ada data campaign dari Server.</p>
            </div>
          )
        )}

        {!isLoading && !errorMsg && totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap", marginBottom: "64px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: currentPage === 1 ? "default" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
                fontSize: "16px",
              }}
            >
              ‹
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  border: currentPage === i + 1 ? "none" : "1px solid #e5e7eb",
                  background: currentPage === i + 1 ? "#15803d" : "#ffffff",
                  color: currentPage === i + 1 ? "#ffffff" : "#374151",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: currentPage === i + 1 ? "0 4px 12px rgba(21,128,61,0.25)" : "none",
                  transition: "all 0.18s ease",
                }}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                background: "#fff",
                cursor: currentPage === totalPages ? "default" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
                fontSize: "16px",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
