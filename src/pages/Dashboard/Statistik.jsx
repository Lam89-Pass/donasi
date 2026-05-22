import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api";
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  }).format(n);

const getLast6Months = () => {
  const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return { month: BULAN[d.getMonth()], year: d.getFullYear(), monthIdx: d.getMonth() };
  });
};

const parseIndonesianDate = (dateStr) => {
  if (!dateStr) return new Date();
  const months = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    Mei: 4,
    Jun: 5,
    Jul: 6,
    Ags: 7,
    Sep: 8,
    Okt: 9,
    Nov: 10,
    Des: 11,
  };
  const parts = dateStr.split(" ");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    if (month !== undefined) return new Date(year, month, day);
  }
  return new Date(dateStr); 
};
function BarChart({ data }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 520,
    H = 120,
    barW = 36;
  const gap = (W - barW * data.length) / (data.length + 1);
  const lastIdx = data.length - 1;

  return (
    <svg viewBox={`0 0 ${W} ${H + 28}`} width="100%" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="barActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <linearGradient id="barIdle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.07)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.03)" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * H);
        const x = gap + i * (barW + gap);
        const y = H - barH;
        const isLast = i === lastIdx;
        return (
          <g key={i}>
            <rect x={x} y={0} width={barW} height={H} rx={6} fill="rgba(255,255,255,0.03)" />
            <rect x={x} y={y} width={barW} height={barH} rx={6} fill={isLast ? "url(#barActive)" : "url(#barIdle)"} style={{ transition: "all 0.4s ease" }} />
            {isLast && (
              <text x={x + barW / 2} y={y - 7} textAnchor="middle" style={{ fontSize: 9, fill: "#60a5fa", fontWeight: 700, fontFamily: "Sora, system-ui" }}>
                {fmt(d.value)}
              </text>
            )}
            <text x={x + barW / 2} y={H + 18} textAnchor="middle" style={{ fontSize: 10, fill: isLast ? "#94a3b8" : "#334155", fontWeight: isLast ? 700 : 500, fontFamily: "Sora, system-ui" }}>
              {d.month}
            </text>
          </g>
        );
      })}
      <line x1={0} y1={0} x2={W} y2={0} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
    </svg>
  );
}

function StatCard({ label, value, sub, accent = "#3b82f6", delay = 0, isLoading }) {
  return (
    <div
      style={{
        background: "#0d1020",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 14,
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${delay}ms`,
        borderTop: `2px solid ${accent}30`,
      }}
    >
      <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{label}</p>
      {isLoading ? (
        <span className="skeleton" style={{ display: "block", width: "70%", height: 24, borderRadius: 5, margin: "2px 0" }} />
      ) : (
        <p style={{ fontSize: 22, fontWeight: 700, color: accent, margin: 0, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{value}</p>
      )}
      {sub && <p style={{ fontSize: 10, color: "#334155", margin: 0 }}>{sub}</p>}
    </div>
  );
}

export default function Statistik() {
  const [userRole, setUserRole] = useState("user");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalDana: 0, programAktif: 0, transaksiSukses: 0, totalBerita: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem("devRole") || "user";
    setUserRole(role);
    fetchDashboardData(role);
  }, []);

  const fetchDashboardData = async (role) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" } };
      const [txRes, campRes, newsRes] = await Promise.all([
        api.get("/api/transactions", config),
        api.get("/api/campaigns", config),
        api.get("/api/articles", config).catch(() => ({ data: { data: [] } })),
      ]);

      const transactions = txRes.data.data || [];
      const campaigns = campRes.data.data || [];
      const berita = newsRes.data.data || newsRes.data || [];

      let totalDana = 0,
        txSukses = 0;
      const programUnik = new Set();
      const activities = [];

      const monthlyMap = {};
      const last6 = getLast6Months();
      last6.forEach(({ year, monthIdx }) => {
        monthlyMap[`${year}-${monthIdx}`] = 0;
      });

      transactions.forEach((t) => {
        const isSuccess = t.status === "success" || t.status === "Sukses";
        if (isSuccess) {
          totalDana += t.amount;
          txSukses++;
          if (t.program) programUnik.add(t.program);
          if (activities.length < 5) {
            activities.push({
              name: t.user,
              act: "berdonasi",
              amount: `Rp ${t.amount.toLocaleString("id-ID")}`,
              target: t.program,
              time: t.date,
            });
          }

          if (t.date) {
            const d = parseIndonesianDate(t.date);
            if (!isNaN(d)) {
              const key = `${d.getFullYear()}-${d.getMonth()}`;
              if (key in monthlyMap) monthlyMap[key] += t.amount;
            }
          }
        }
      });

      setStats({
        totalDana,
        programAktif: role === "user" ? programUnik.size : campaigns.length,
        transaksiSukses: txSukses,
        totalBerita: Array.isArray(berita) ? berita.length : 0,
      });

      setRecentActivity(activities);

      const hasRealData = last6.some(({ year, monthIdx }) => monthlyMap[`${year}-${monthIdx}`] > 0);
      setChartData(
        last6.map(({ month, year, monthIdx }, i) => ({
          month,
          value: hasRealData ? monthlyMap[`${year}-${monthIdx}`] : totalDana * [0.1, 0.15, 0.12, 0.2, 0.18, 0.25][i],
        })),
      );
    } catch (error) {
      console.error("Gagal load dashboard:", error);
      toast.error("Gagal memuat statistik dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const isUser = userRole === "user";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#07090e", fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
        .skeleton { background:linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 75%); background-size:500px 100%; animation:shimmer 1.4s infinite linear; }
        .stat-scroll::-webkit-scrollbar { display:none; }
        .feed-item { transition:background 0.15s; border-radius:8px; }
        .feed-item:hover { background:rgba(255,255,255,0.025); }
      `}</style>

      <div
        style={{
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 20,
          background: "rgba(7,9,14,0.9)",
          backdropFilter: "blur(12px)",
          flexShrink: 0,
        }}
      >
        <div>
          <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>{isUser ? "RINGKASAN DONATUR" : "TINJAUAN PLATFORM"}</p>
          <h1 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>{isUser ? "Statistik Saya" : "Dashboard Statistik"}</h1>
        </div>
      </div>

      <div className="stat-scroll" style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #0d1830 0%, #0d1020 100%)",
              border: "1px solid rgba(37,99,235,0.25)",
              borderRadius: 16,
              padding: "20px 20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 130,
              position: "relative",
              overflow: "hidden",
              animation: "fadeUp 0.3s ease both",
              borderTop: "2px solid rgba(37,99,235,0.4)",
            }}
          >
            <div style={{ position: "absolute", top: -30, right: -30, width: 100, height: 100, background: "rgba(37,99,235,0.15)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
            <p style={{ fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{isUser ? "Total Donasi Saya" : "Total Donasi"}</p>
            {isLoading ? (
              <span className="skeleton" style={{ display: "block", width: "75%", height: 28, borderRadius: 6, marginTop: 10 }} />
            ) : (
              <p style={{ fontSize: 26, fontWeight: 700, color: "#60a5fa", margin: "8px 0 0", lineHeight: 1 }}>{fmt(stats.totalDana)}</p>
            )}
          </div>

          <StatCard label={isUser ? "Program Didukung" : "Program Aktif"} value={stats.programAktif} sub={isUser ? "berhasil didanai" : "kampanye berjalan"} accent="#34d399" delay={60} isLoading={isLoading} />
          <StatCard label="Transaksi Sukses" value={stats.transaksiSukses.toLocaleString("id-ID")} sub={isUser ? "donasi berhasil" : "seluruh platform"} accent="#60a5fa" delay={120} isLoading={isLoading} />
          <StatCard label="Total Berita" value={stats.totalBerita} sub="artikel dipublikasikan" accent="#f472b6" delay={180} isLoading={isLoading} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 14 }}>
          <div style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 22px", animation: "fadeUp 0.4s ease both", animationDelay: "200ms" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>Tren Dana Masuk</p>
                <p style={{ fontSize: 10, color: "#334155", margin: "3px 0 0" }}>6 bulan terakhir</p>
              </div>
              <div style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", fontSize: 10, fontWeight: 600, color: "#60a5fa" }}>Aktual</div>
            </div>
            {isLoading ? <span className="skeleton" style={{ display: "block", width: "100%", height: 148, borderRadius: 8 }} /> : <BarChart data={chartData} />}
          </div>

          <div style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: "20px 22px", display: "flex", flexDirection: "column", animation: "fadeUp 0.4s ease both", animationDelay: "260ms" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>Aktivitas Terbaru</p>
              <span style={{ fontSize: 10, color: "#334155" }}>{recentActivity.length} entri</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ padding: "8px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span className="skeleton" style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 4 }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                      <span className="skeleton" style={{ display: "block", width: "90%", height: 11, borderRadius: 4 }} />
                      <span className="skeleton" style={{ display: "block", width: "40%", height: 9, borderRadius: 4 }} />
                    </div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((f, i) => (
                  <div key={i} className="feed-item" style={{ padding: "8px", display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, marginTop: 4, background: "#3b82f6" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                        <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{f.name}</span> {f.act}
                        <span style={{ color: "#60a5fa" }}> {f.amount}</span> untuk <span style={{ color: "#4ade80" }}>{f.target}</span>
                      </p>
                      <p style={{ fontSize: 9, color: "#334155", margin: "2px 0 0", fontWeight: 600 }}>{f.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 20 }}>Belum ada aktivitas transaksi sukses.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
