import React, { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../../api";

function useNotif() {
  const [list, setList] = useState([]);
  const push = (msg, type = "success") => {
    const id = Date.now() + Math.random();
    setList((p) => [...p, { id, msg, type }]);
    setTimeout(() => setList((p) => p.filter((n) => n.id !== id)), 4500);
  };
  const remove = (id) => setList((p) => p.filter((n) => n.id !== id));
  return { list, push, remove };
}
const NOTIF_THEME = {
  success: { bg: "#05140d", border: "#16a34a", bar: "#22c55e", text: "#86efac", icon: "✓" },
  error: { bg: "#140505", border: "#dc2626", bar: "#ef4444", text: "#fca5a5", icon: "✕" },
};
function Notifs({ list, onRemove }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
      {list.map((n) => {
        const t = NOTIF_THEME[n.type] || NOTIF_THEME.success;
        return (
          <div
            key={n.id}
            style={{
              pointerEvents: "auto",
              background: t.bg,
              border: `1px solid ${t.border}`,
              borderLeft: `3px solid ${t.bar}`,
              color: t.text,
              padding: "11px 14px 11px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              minWidth: 260,
              maxWidth: 320,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              animation: "notifIn 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 11, opacity: 0.7 }}>{t.icon}</span>
            <span style={{ flex: 1, lineHeight: 1.4 }}>{n.msg}</span>
            <button onClick={() => onRemove(n.id)} style={{ background: "none", border: "none", cursor: "pointer", color: t.text, opacity: 0.5, fontSize: 18, lineHeight: 1, padding: 0 }}>
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(3,5,10,0.85)", backdropFilter: "blur(6px)" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: 420,
          background: "#10121a",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
          animation: "modalIn 0.18s cubic-bezier(0.16,1,0.3,1)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const ROLE_CFG = {
  superadmin: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "rgba(167,139,250,0.2)", label: "Super Admin" },
  admin: { bg: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "rgba(96,165,250,0.2)", label: "Admin" },
  user: { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.2)", label: "Donatur" },
};
const getRoleCfg = (role) => ROLE_CFG[role] || ROLE_CFG.user;

const Ic = {
  Search: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Eye: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Edit: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Close: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
};

function MobileUserCard({ user, idx, currentPage, itemsPerPage, onDetail, onEdit, onDelete }) {
  const rc = getRoleCfg(user.role);
  const isAktif = user.status === "Aktif";
  const num = (currentPage - 1) * itemsPerPage + idx + 1;
  return (
    <div
      style={{
        background: "#0d1020",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 12,
        padding: "13px 14px",
        marginBottom: 8,
        animation: `fadeUp 0.3s ease ${idx * 30}ms both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: rc.bg,
              border: `1px solid ${rc.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: rc.color,
              flexShrink: 0,
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
            <p style={{ fontSize: 10, color: "#475569", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
          </div>
        </div>
        <span style={{ fontSize: 10, color: "#334155", marginLeft: 8, flexShrink: 0 }}>#{num}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 6,
            background: rc.bg,
            color: rc.color,
            border: `1px solid ${rc.border}`,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {rc.label}
        </span>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 6,
            background: isAktif ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
            border: `1px solid ${isAktif ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isAktif ? "#22c55e" : "#ef4444" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: isAktif ? "#4ade80" : "#f87171" }}>{user.status}</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => onDetail(user)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.07)",
            color: "#64748b",
            borderRadius: 8,
            padding: "7px 0",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {Ic.Eye} Detail
        </button>
        <button
          onClick={() => onEdit(user)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            background: "rgba(29,78,216,0.14)",
            border: "1px solid rgba(29,78,216,0.2)",
            color: "#60a5fa",
            borderRadius: 8,
            padding: "7px 0",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {Ic.Edit} Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            background: "rgba(220,38,38,0.12)",
            border: "1px solid rgba(220,38,38,0.15)",
            color: "#f87171",
            borderRadius: 8,
            padding: "7px 0",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {Ic.Trash} Hapus
        </button>
      </div>
    </div>
  );
}

export default function KelolaRole() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editData, setEditData] = useState({ role: "", status: "" });
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { list: notifs, push: notify, remove: removeNotif } = useNotif();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await api.get("/api/users/", {
        headers: { Authorization: `Bearer ${token}`, "ngrok-skip-browser-warning": "true" },
      });
      const data = response.data.data || response.data || [];
      const mappedUsers = data.map((u) => ({
        id: u.id || u.ID,
        name: u.name || u.Name || "Pengguna Tanpa Nama",
        email: u.email || u.Email || "-",
        phone: u.phone || u.Phone || "Tidak Ada",
        transactionCount: u.transaction_count || 0,
        role: (u.role || u.Role || "user").toLowerCase(),
        status: u.is_active === false ? "Ditangguhkan" : "Aktif",
      }));
      setUsers(mappedUsers);
    } catch (error) {
      notify(error.response?.data?.message || "Gagal memuat data pengguna dari server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentItems = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const openDetailModal = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditData({ role: user.role, status: user.status });
    setIsEditModalOpen(true);
  };
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const isActiveBoolean = editData.status === "Aktif";
      await api.put(`/api/users/${selectedUser.id}`, { role: editData.role, is_active: isActiveBoolean }, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, role: editData.role, status: editData.status } : u)));
      toast.success("Hak akses dan status berhasil diperbarui!");
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal memperbarui data pengguna");
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/users/${selectedUser.id}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      notify("Pengguna berhasil dihapus");
      setIsDeleteModalOpen(false);
      if (currentItems.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
    } catch (error) {
      notify(error.response?.data?.message || "Gagal menghapus pengguna", "error");
    }
  };

  const stats = useMemo(
    () => ({
      total: users.length,
      superadmin: users.filter((u) => u.role === "superadmin").length,
      admin: users.filter((u) => u.role === "admin").length,
      suspended: users.filter((u) => u.status === "Ditangguhkan").length,
    }),
    [users],
  );

  const pageRange = useMemo(() => {
    const delta = isMobile ? 1 : 2;
    const range = [];
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) range.push(i);
    return range;
  }, [currentPage, totalPages, isMobile]);

  const px = isMobile ? "14px" : "24px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#07090e", fontFamily: "'Sora','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes notifIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.97) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to { transform: rotate(360deg); } }
        .row-hover:hover td { background: rgba(255,255,255,0.025) !important; }
        .act-btn { display:flex;align-items:center;justify-content:center;border:none;border-radius:7px;padding:6px;cursor:pointer;transition:all 0.15s; }
        .act-btn:hover { opacity:0.8;transform:scale(0.95); }
        .pg-btn { min-width:30px; height:30px; border-radius:7px; border:1px solid rgba(255,255,255,0.07); background:transparent; color:#475569; cursor:pointer; font-size:12px; transition:all 0.12s; font-family:'Sora',sans-serif; }
        .pg-btn:hover:not(:disabled) { border-color:rgba(255,255,255,0.14); color:#94a3b8; }
        .pg-btn:disabled { color:#1e293b; cursor:not-allowed; }
        .pg-btn.active { background:#1d4ed8; border-color:#1d4ed8; color:#fff; font-weight:700; }
        .stats-grid-role { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
        @media (max-width: 767px) {
          .stats-grid-role { grid-template-columns: repeat(2,1fr) !important; gap: 8px !important; }
          .pg-footer-role { flex-direction: column; gap: 8px; align-items: center !important; }
          .toolbar-role { flex-wrap: wrap; gap: 8px !important; }
          .toolbar-right-role { width: 100%; display: flex; gap: 8px; }
          .toolbar-right-role select { flex: 1; }
        }
      `}</style>

      <Notifs list={notifs} onRemove={removeNotif} />

      <div style={{ padding: `0 ${px}`, flexShrink: 0 }}>
        <div style={{ height: isMobile ? 56 : 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: 0 }}>AKSES & KEAMANAN</p>
            <h1 style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>Manajemen Role</h1>
          </div>
        </div>

        <div className="stats-grid-role" style={{ padding: "14px 0 0", animation: "fadeUp 0.3s ease both" }}>
          {[
            { label: "Total Pengguna", value: stats.total, accent: "#94a3b8" },
            { label: "Super Admin", value: stats.superadmin, accent: "#a78bfa" },
            { label: "Admin", value: stats.admin, accent: "#60a5fa" },
            { label: "Ditangguhkan", value: stats.suspended, accent: "#f87171" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: isMobile ? "10px 12px" : "13px 16px", animation: `fadeUp 0.3s ease ${i * 50}ms both` }}>
              <p style={{ fontSize: 9, color: "#334155", margin: "0 0 4px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</p>
              <p style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, color: s.accent, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="toolbar-role" style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ position: "relative", flex: 1, minWidth: isMobile ? "100%" : 0 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#334155" }}>{Ic.Search}</span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={isMobile ? "Cari pengguna..." : "Cari berdasarkan nama atau email..."}
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
          <div className="toolbar-right-role" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>Tampilkan</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              style={{
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
              }}
            >
              {[10, 15, 50, 100].map((n) => (
                <option key={n} value={n} style={{ background: "#0d1020" }}>
                  {n} baris
                </option>
              ))}
            </select>
            {!isMobile && <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>{filteredUsers.length} pengguna</span>}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: `12px ${px} 0`, scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.07) transparent" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200 }}>
            <div style={{ width: 28, height: 28, border: "2px solid #1d4ed8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 12 }} />
            <p style={{ fontSize: 12, color: "#475569" }}>Memuat data pengguna...</p>
          </div>
        ) : isMobile ? (
          <div>
            {currentItems.length === 0 ? (
              <div style={{ padding: "60px 0", textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 6px" }}>Data tidak ditemukan</p>
                <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Coba sesuaikan kata kunci pencarian.</p>
              </div>
            ) : (
              currentItems.map((user, idx) => <MobileUserCard key={user.id} user={user} idx={idx} currentPage={currentPage} itemsPerPage={itemsPerPage} onDetail={openDetailModal} onEdit={openEditModal} onDelete={openDeleteModal} />)
            )}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                {["#", "Pengguna", "Otorisasi", "Status", "Aksi"].map((h, i) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: i === 4 ? "right" : "left",
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#334155",
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "60px 0", textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 6px" }}>Data tidak ditemukan</p>
                    <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Coba sesuaikan kata kunci pencarian.</p>
                  </td>
                </tr>
              ) : (
                currentItems.map((user, idx) => {
                  const rc = getRoleCfg(user.role);
                  const isAktif = user.status === "Aktif";
                  const num = (currentPage - 1) * itemsPerPage + idx + 1;
                  return (
                    <tr key={user.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", animation: `fadeUp 0.3s ease ${idx * 30}ms both` }}>
                      <td style={{ padding: "13px 14px", fontSize: 11, color: "#334155", width: 40 }}>{num}</td>
                      <td style={{ padding: "13px 14px", minWidth: 200 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{user.name}</p>
                        <p style={{ fontSize: 10, color: "#475569", margin: "2px 0 0" }}>{user.email}</p>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                          {rc.label}
                        </span>
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "4px 10px",
                            borderRadius: 6,
                            background: isAktif ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                            border: `1px solid ${isAktif ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)"}`,
                          }}
                        >
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: isAktif ? "#22c55e" : "#ef4444" }} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: isAktif ? "#4ade80" : "#f87171" }}>{user.status}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 14px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                          <button className="act-btn" title="Detail" onClick={() => openDetailModal(user)} style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                            {Ic.Eye}
                          </button>
                          <button className="act-btn" title="Edit" onClick={() => openEditModal(user)} style={{ background: "rgba(29,78,216,0.14)", color: "#60a5fa" }}>
                            {Ic.Edit}
                          </button>
                          <button className="act-btn" title="Hapus" onClick={() => openDeleteModal(user)} style={{ background: "rgba(220,38,38,0.12)", color: "#f87171" }}>
                            {Ic.Trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && totalPages > 0 && (
        <div className="pg-footer-role" style={{ padding: isMobile ? `12px ${px}` : `14px ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>
            Menampilkan <span style={{ color: "#94a3b8", fontWeight: 600 }}>{currentItems.length}</span> dari <span style={{ color: "#94a3b8", fontWeight: 600 }}>{filteredUsers.length}</span> data
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

      <Modal open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        {selectedUser &&
          (() => {
            const rc = getRoleCfg(selectedUser.role);
            const isAktif = selectedUser.status === "Aktif";
            return (
              <>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${rc.color}, transparent)` }} />
                <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Detail Akun</p>
                  <button onClick={() => setIsDetailModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                    {Ic.Close}
                  </button>
                </div>
                <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: "50%",
                        background: rc.bg,
                        border: `1px solid ${rc.border}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 16,
                        fontWeight: 700,
                        color: rc.color,
                        flexShrink: 0,
                      }}
                    >
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{selectedUser.name}</p>
                      <p style={{ fontSize: 11, color: "#475569", margin: "2px 0 0" }}>{selectedUser.email}</p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: "Role", value: rc.label, accent: rc.color },
                      { label: "Status", value: selectedUser.status, accent: isAktif ? "#4ade80" : "#f87171" },
                      { label: "No. Telepon", value: selectedUser.phone || "Tidak Ada", accent: "#94a3b8" },
                      { label: "Transaksi", value: `${selectedUser.transactionCount} sukses`, accent: "#60a5fa" },
                    ].map((item) => (
                      <div key={item.label} style={{ background: "#080a12", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "11px 14px" }}>
                        <p style={{ fontSize: 9, fontWeight: 600, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 5px" }}>{item.label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: item.accent, margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#475569", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Tutup
                  </button>
                </div>
              </>
            );
          })()}
      </Modal>

      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        {selectedUser && (
          <>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>Edit Otorisasi</p>
                <p style={{ fontSize: 10, color: "#475569", margin: "3px 0 0" }}>Ubah role dan status pengguna</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                {Ic.Close}
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ background: "#080a12", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "11px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: getRoleCfg(selectedUser.role).bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: getRoleCfg(selectedUser.role).color,
                      flexShrink: 0,
                    }}
                  >
                    {selectedUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{selectedUser.name}</p>
                    <p style={{ fontSize: 10, color: "#334155", margin: "2px 0 0" }}>{selectedUser.email}</p>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Tingkat Akses</label>
                  <select
                    value={editData.role}
                    onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                    style={{ width: "100%", background: "#080a12", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#e2e8f0", outline: "none", cursor: "pointer" }}
                  >
                    <option value="user" style={{ background: "#10121a" }}>
                      Donatur (Akses Dasar)
                    </option>
                    <option value="admin" style={{ background: "#10121a" }}>
                      Administrator
                    </option>
                    <option value="superadmin" style={{ background: "#10121a" }}>
                      Super Admin
                    </option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Status Layanan</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    style={{ width: "100%", background: "#080a12", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9, padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#e2e8f0", outline: "none", cursor: "pointer" }}
                  >
                    <option value="Aktif" style={{ background: "#10121a" }}>
                      Aktif
                    </option>
                    <option value="Ditangguhkan" style={{ background: "#10121a" }}>
                      Tangguhkan Akses
                    </option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, paddingTop: 4, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: "#475569", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      background: submitting ? "#1e3a5f" : "#1d4ed8",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      padding: "10px 0",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? "Menyimpan..." : "Terapkan"}
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </Modal>

      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        {selectedUser && (
          <div style={{ padding: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              {Ic.Trash}
            </div>
            <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Hapus Pengguna</p>
            <p style={{ textAlign: "center", fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 22 }}>
              Aksi ini permanen. Akun <span style={{ color: "#e2e8f0", fontWeight: 500 }}>"{selectedUser.name}"</span> akan dihapus dari sistem.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: "#475569", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Batal
              </button>
              <button onClick={handleDelete} style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Hapus
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
