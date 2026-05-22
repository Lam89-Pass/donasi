import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api";

const Ic = {
  Search: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  SortUp: (
    <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4l-8 8h16z" />
    </svg>
  ),
  SortDown: (
    <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 20l8-8H4z" />
    </svg>
  ),
  SortBoth: (
    <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 4l-5 5h10zm0 16l5-5H7z" />
    </svg>
  ),
};

const STATUS_CFG = {
  Sukses: { color: "#4ade80", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.18)", dot: "#22c55e" },
  Pending: { color: "#fbbf24", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.18)", dot: "#f59e0b" },
  Gagal: { color: "#f87171", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.18)", dot: "#ef4444" },
};
const getStatusCfg = (s) => STATUS_CFG[s] || STATUS_CFG.Gagal;

const fmtRp = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

const trxNum = (id) => parseInt(id.replace("TRX-", ""), 10) || 0;

function SkeletonRow({ cols }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
      {cols.map((w, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <span className="skeleton" style={{ display: "inline-block", width: w, height: 12, borderRadius: 5 }} />
        </td>
      ))}
    </tr>
  );
}

export default function Transaksi() {
  const [userRole, setUserRole] = useState("user");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setUserRole(localStorage.getItem("devRole") || "user");

    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await api.get("/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });
        const data = response.data.data || [];
        const formattedData = data.map((t) => ({
          id: `TRX-${t.id}`,
          user: t.user || "Hamba Allah",
          program: t.program || "Program Donasi",
          amount: t.amount || 0,
          date: t.date,
          status: t.status === "success" ? "Sukses" : t.status === "pending" ? "Pending" : "Gagal",
        }));
        setTransactions(formattedData);
      } catch (error) {
        console.error("Gagal mengambil transaksi:", error);
        toast.error("Gagal memuat data transaksi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const stats = useMemo(() => {
    let total = 0,
      sukses = 0,
      pending = 0,
      gagal = 0;
    transactions.forEach((t) => {
      total += t.amount;
      if (t.status === "Sukses") sukses += t.amount;
      if (t.status === "Pending") pending += t.amount;
      if (t.status === "Gagal") gagal += t.amount;
    });
    return { total, sukses, pending, gagal };
  }, [transactions]);

  const filteredData = useMemo(() => {
    return transactions.filter((t) => t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.program.toLowerCase().includes(searchTerm.toLowerCase()) || t.user.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [transactions, searchTerm]);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc"); 
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleItemsPerPage = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const sortedData = useMemo(() => {
    const afterStatus = statusFilter === "Semua" ? filteredData : filteredData.filter((t) => t.status === statusFilter);

    return [...afterStatus].sort((a, b) => {
      let va, vb;
      if (sortKey === "amount") {
        va = +a.amount;
        vb = +b.amount;
      } else if (sortKey === "id") {
        va = trxNum(a.id);
        vb = trxNum(b.id);
      } else {
        va = String(a[sortKey]).toLowerCase();
        vb = String(b[sortKey]).toLowerCase();
      }
      return sortDir === "asc" ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
  }, [filteredData, sortKey, sortDir, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const currentItems = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pageRange = useMemo(() => {
    const delta = 2,
      range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) range.push(i);
    return range;
  }, [currentPage, totalPages]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <span style={{ opacity: 0.25, marginLeft: 4 }}>{Ic.SortBoth}</span>;
    return <span style={{ color: "#3b82f6", marginLeft: 4 }}>{sortDir === "asc" ? Ic.SortUp : Ic.SortDown}</span>;
  };

  const countStatus = (s) => transactions.filter((t) => t.status === s).length;

  const SELECT_STYLE = {
    background: "#0d1020",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 9,
    padding: "7px 10px",
    fontSize: 11,
    fontWeight: 600,
    color: "#94a3b8",
    outline: "none",
    cursor: "pointer",
    fontFamily: "'Sora', sans-serif",
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#07090e", fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(7px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer  { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
        @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.2} }
        .skeleton { background: linear-gradient(90deg,rgba(255,255,255,0.03) 25%,rgba(255,255,255,0.06) 50%,rgba(255,255,255,0.03) 75%); background-size:500px 100%; animation:shimmer 1.4s infinite linear; }
        .row-hover:hover td { background: rgba(255,255,255,0.02) !important; }
        .col-sort { background:none; border:none; cursor:pointer; display:inline-flex; align-items:center; font-family:inherit; font-size:10px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; color:#334155; padding:0; transition:color 0.12s; }
        .col-sort:hover { color:#94a3b8; }
        .col-sort.active { color:#60a5fa; }
        .pg-btn { min-width:30px; height:30px; border-radius:7px; border:1px solid rgba(255,255,255,0.07); background:transparent; color:#475569; cursor:pointer; font-size:12px; transition:all 0.12s; font-family:'Sora',sans-serif; }
        .pg-btn:hover:not(:disabled) { border-color:rgba(255,255,255,0.14); color:#94a3b8; }
        .pg-btn:disabled { color:#1e293b; cursor:not-allowed; }
        .pg-btn.active { background:#1d4ed8; border-color:#1d4ed8; color:#fff; font-weight:700; }
        select option { background: #0d1020; }
      `}</style>

      <div style={{ padding: "0 24px", flexShrink: 0 }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>Financial Ledger</p>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>{userRole === "user" ? "Riwayat Donasi" : "Data Transaksi"}</h1>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, padding: "18px 0 0" }}>
          {[
            { label: "Total Volume", value: stats.total, sub: `${transactions.length} transaksi`, accent: "#94a3b8" },
            { label: "Berhasil", value: stats.sukses, sub: `${countStatus("Sukses")} sukses`, accent: "#4ade80" },
            { label: "Menunggu", value: stats.pending, sub: `${countStatus("Pending")} pending`, accent: "#fbbf24" },
            { label: "Gagal", value: stats.gagal, sub: `${countStatus("Gagal")} gagal`, accent: "#f87171" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "13px 16px", animation: `fadeUp 0.3s ease ${i * 50}ms both`, borderTop: `2px solid ${s.accent}30` }}>
              <p style={{ fontSize: 10, color: "#334155", margin: "0 0 5px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
              {isLoading ? (
                <span className="skeleton" style={{ display: "block", width: "80%", height: 20, borderRadius: 5, margin: "6px 0 4px" }} />
              ) : (
                <p style={{ fontSize: 17, fontWeight: 700, color: s.accent, margin: "0 0 3px", letterSpacing: "-0.02em" }}>{fmtRp(s.value)}</p>
              )}
              <p style={{ fontSize: 10, color: "#475569", margin: 0, fontWeight: 500 }}>{s.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#334155" }}>{Ic.Search}</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Cari ID transaksi, nama donatur, atau program..."
              style={{
                width: "100%",
                background: "#0d1020",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 9,
                paddingLeft: 34,
                paddingRight: 12,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: 12,
                color: "#e2e8f0",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'Sora', sans-serif",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(59,130,246,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.07)")}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>Urutan</span>
            <select
              value={sortKey === "id" ? (sortDir === "desc" ? "terbaru" : "terlama") : "terbaru"}
              onChange={(e) => {
                if (e.target.value === "terbaru") {
                  setSortKey("id");
                  setSortDir("desc");
                } else {
                  setSortKey("id");
                  setSortDir("asc");
                }
                setCurrentPage(1);
              }}
              style={SELECT_STYLE}
            >
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>Status</span>
            <select value={statusFilter} onChange={handleStatusFilter} style={SELECT_STYLE}>
              <option value="Semua">Semua</option>
              <option value="Sukses">Sukses</option>
              <option value="Pending">Pending</option>
              <option value="Gagal">Gagal</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>Tampilkan</span>
            <select value={itemsPerPage} onChange={handleItemsPerPage} style={SELECT_STYLE}>
              {[10, 25, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} baris
                </option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap", marginLeft: "auto" }}>{sortedData.length} transaksi</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 0", scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.07) transparent" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", width: 40 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#334155", letterSpacing: "0.07em", textTransform: "uppercase" }}>#</span>
              </th>
              {[
                { key: "id", label: "ID Transaksi" },
                { key: "user", label: "Donatur" },
                { key: "program", label: "Program" },
                { key: "date", label: "Tanggal" },
                { key: "amount", label: "Jumlah" },
                { key: "status", label: "Status", right: true },
              ].map(({ key, label, right }) => (
                <th key={key} style={{ padding: "10px 16px", textAlign: right ? "right" : "left" }}>
                  <button
                    className={`col-sort${sortKey === key ? " active" : ""}`}
                    onClick={() => handleSort(key)}
                    style={{ marginLeft: right ? "auto" : 0, display: right ? "flex" : "inline-flex", justifyContent: right ? "flex-end" : "flex-start" }}
                  >
                    {label}
                    <SortIcon col={key} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={[20, 80, 100, 140, 70, 80, 65]} />)
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "60px 0", textAlign: "center" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 6px" }}>Tidak ada transaksi</p>
                  <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Coba sesuaikan filter atau kata kunci pencarian.</p>
                </td>
              </tr>
            ) : (
              currentItems.map((t, idx) => {
                const sc = getStatusCfg(t.status);
                const num = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                  <tr key={t.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", animation: `fadeUp 0.25s ease ${idx * 25}ms both` }}>
                    <td style={{ padding: "13px 16px", fontSize: 11, color: "#334155" }}>{num}</td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.05em" }}>{t.id}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{t.user}</p>
                    </td>
                    <td style={{ padding: "13px 16px", maxWidth: 200 }}>
                      <p style={{ fontSize: 12, color: "#475569", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.program}</p>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 11, color: "#334155", fontWeight: 500 }}>{t.date}</span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>{fmtRp(t.amount)}</span>
                    </td>
                    <td style={{ padding: "13px 16px", textAlign: "right" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: sc.bg,
                          border: `1px solid ${sc.border}`,
                          color: sc.color,
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.dot, display: "inline-block", ...(t.status === "Pending" ? { animation: "pulseDot 1.8s ease-in-out infinite" } : {}) }} />
                        {t.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 0 && (
        <div style={{ padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>
            Menampilkan <span style={{ color: "#94a3b8", fontWeight: 600 }}>{currentItems.length}</span> dari <span style={{ color: "#94a3b8", fontWeight: 600 }}>{sortedData.length}</span> data
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button className="pg-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              «
            </button>
            <button className="pg-btn" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              ‹
            </button>
            {pageRange.map((n) => (
              <button key={n} className={`pg-btn${n === currentPage ? " active" : ""}`} onClick={() => setCurrentPage(n)}>
                {n}
              </button>
            ))}
            <button className="pg-btn" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              ›
            </button>
            <button className="pg-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
