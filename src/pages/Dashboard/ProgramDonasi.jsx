import React, { useState, useMemo, useEffect, useCallback } from "react";
import api from "../../api";

const CATEGORIES_FILTER = ["Semua", "Kemanusiaan", "Sosial", "Pendidikan", "Kesehatan", "Bencana Alam", "Infrastruktur", "Ekonomi"];
const CATEGORIES_FORM = ["Kemanusiaan", "Sosial", "Pendidikan", "Kesehatan", "Bencana Alam", "Infrastruktur", "Ekonomi"];
const PER_PAGE_OPTIONS = [10, 25, 50];
const EMPTY_FORM = { title: "", category: "Kemanusiaan", target: "", deadline: "", status: "Aktif", location: "", description: "", image_file: null, image_preview: "" };
const fmt = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0, notation: "compact", compactDisplay: "short" }).format(n);
const fmtFull = (n) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);
const pct = (g, t) => (!t || t <= 0 ? 0 : Math.min(Math.round((g / t) * 100), 100));
const catId = (c) => ({ Kemanusiaan: 1, Sosial: 1, Pendidikan: 2, "Bencana Alam": 3, Kesehatan: 4, Infrastruktur: 5, Ekonomi: 5 })[c] || 1;

function useNotif() {
  const [list, setList] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    setList((p) => [...p, { id, msg, type }]);
    setTimeout(() => setList((p) => p.filter((n) => n.id !== id)), 4800);
  }, []);
  const remove = useCallback((id) => setList((p) => p.filter((n) => n.id !== id)), []);
  return { list, push, remove };
}

const NOTIF_THEME = {
  success: { bg: "#05140d", border: "#16a34a", bar: "#22c55e", text: "#86efac", icon: "✓" },
  error: { bg: "#140505", border: "#dc2626", bar: "#ef4444", text: "#fca5a5", icon: "✕" },
  info: { bg: "#05080f", border: "#2563eb", bar: "#3b82f6", text: "#93c5fd", icon: "i" },
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
              padding: "12px 14px 12px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              minWidth: 280,
              maxWidth: 360,
              display: "flex",
              alignItems: "center",
              gap: 10,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              animation: "notifIn 0.2s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 11, opacity: 0.8 }}>{t.icon}</span>
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

const Icon = {
  Search: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Trash: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Eye: (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Close: (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Sort: (dir) => (
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
      <path d={dir === "asc" ? "M12 4l-8 9h16l-8-9z" : dir === "desc" ? "M12 20l8-9H4l8 9z" : "M8 10l4-6 4 6H8zm8 4l-4 6-4-6h8z"} />
    </svg>
  ),
};

const CAT_BADGE = {
  Kemanusiaan: { bg: "rgba(251,146,60,0.12)", color: "#fb923c" },
  Sosial: { bg: "rgba(56,189,248,0.12)", color: "#38bdf8" },
  Pendidikan: { bg: "rgba(167,139,250,0.12)", color: "#a78bfa" },
  Kesehatan: { bg: "rgba(244,114,182,0.12)", color: "#f472b6" },
  "Bencana Alam": { bg: "rgba(248,113,113,0.12)", color: "#f87171" },
  Infrastruktur: { bg: "rgba(250,204,21,0.12)", color: "#facc15" },
  Ekonomi: { bg: "rgba(52,211,153,0.12)", color: "#34d399" },
};

function Modal({ open, onClose, children, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ background: "rgba(3,5,10,0.82)", backdropFilter: "blur(6px)" }}>
      <div onClick={onClose} className="absolute inset-0" />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[92vh] flex flex-col rounded-2xl overflow-hidden`}
        style={{ background: "#10121a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)", animation: "modalIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div className="flex items-start justify-between px-6 py-5 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div>
        <h2 className="text-sm font-semibold text-white tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
            {subtitle}
          </p>
        )}
      </div>
      <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors mt-0.5" style={{ background: "none", border: "none", cursor: "pointer" }}>
        {Icon.Close}
      </button>
    </div>
  );
}

function FormModal({ open, mode, formData, onChange, onSubmit, onClose, submitting }) {
  const isEdit = mode === "edit";
  const inputStyle = { background: "#080a12", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" };
  const labelStyle = { fontSize: 10, fontWeight: 600, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase", display: "block", marginBottom: 6 };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <ModalHeader title={isEdit ? "Edit Program Donasi" : "Tambah Program Donasi"} subtitle={isEdit ? "Perbarui informasi program" : "Buat program donasi baru"} onClose={onClose} />
      <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden">
        <form onSubmit={onSubmit}>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={labelStyle}>
                Judul Program <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={onChange} placeholder="Contoh: Bantuan Pangan Korban Bencana" style={inputStyle} required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>Kategori</label>
                <select name="category" value={formData.category} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  {CATEGORIES_FORM.map((c) => (
                    <option key={c} value={c} style={{ background: "#10121a" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={onChange} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="Aktif" style={{ background: "#10121a" }}>
                    Aktif
                  </option>
                  <option value="Selesai" style={{ background: "#10121a" }}>
                    Selesai
                  </option>
                </select>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>
                  Target Dana (Rp) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input type="number" name="target" value={formData.target} onChange={onChange} placeholder="50000000" min="0" style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>
                  Batas Waktu <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input type="date" name="deadline" value={formData.deadline} onChange={onChange} style={{ ...inputStyle, colorScheme: "dark" }} required />
              </div>
            </div>
            <div>
              <label style={labelStyle}>
                Lokasi / Daerah <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="text" name="location" value={formData.location} onChange={onChange} placeholder="Contoh: Jawa Barat" style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>
                Gambar Program <span style={{ color: "#475569" }}>(opsional)</span>
              </label>
              <div
                onClick={() => document.getElementById("img-upload-input").click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file) onChange({ target: { name: "image_file", value: file, type: "file" } });
                }}
                style={{
                  background: "#080a12",
                  border: `1.5px dashed ${formData.image_preview ? "rgba(29,78,216,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 10,
                  cursor: "pointer",
                  overflow: "hidden",
                  minHeight: formData.image_preview ? 0 : 100,
                }}
              >
                {formData.image_preview ? (
                  <div style={{ position: "relative" }}>
                    <img src={formData.image_preview} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange({ target: { name: "image_file", value: null, type: "file" } });
                      }}
                      style={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        background: "rgba(0,0,0,0.6)",
                        border: "none",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "#fff",
                        fontSize: 14,
                      }}
                    >
                      ×
                    </button>
                    <div style={{ position: "absolute", bottom: 8, left: 8, background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#94a3b8" }}>{formData.image_file?.name || "Gambar saat ini"}</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: "24px 16px" }}>
                    <svg width="24" height="24" fill="none" stroke="#334155" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p style={{ color: "#475569", fontSize: 12, textAlign: "center", margin: 0 }}>Klik atau drag & drop gambar</p>
                    <p style={{ color: "#334155", fontSize: 10, margin: 0 }}>JPG, PNG, WEBP — maks. 5 MB</p>
                  </div>
                )}
              </div>
              <input
                id="img-upload-input"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) onChange({ target: { name: "image_file", value: file, type: "file" } });
                  e.target.value = "";
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Deskripsi <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Latar belakang dan tujuan program..."
                rows={4}
                style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
                className="[&::-webkit-scrollbar]:hidden"
                required
              />
            </div>

            <div style={{ display: "flex", gap: 12, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", borderRadius: 9, padding: "11px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
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
                  padding: "11px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: submitting ? "not-allowed" : "pointer",
                  opacity: submitting ? 0.7 : 1,
                }}
              >
                {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Program"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

function DeleteModal({ open, campaign, onConfirm, onClose }) {
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-sm">
      <div style={{ padding: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          {Icon.Trash}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Hapus Program Donasi</p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 22 }}>
          Aksi ini tidak dapat dibatalkan. Program <span style={{ color: "#e2e8f0", fontWeight: 500 }}>"{campaign?.title}"</span> akan dihapus secara permanen.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#64748b", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Hapus
          </button>
        </div>
      </div>
    </Modal>
  );
}

function DetailModal({ open, campaign: c, onClose }) {
  if (!c) return null;
  const p = pct(c.gathered, c.target);
  const isDone = c.status === "Selesai" || p >= 100;
  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <ModalHeader title="Detail Program" subtitle={c.category} onClose={onClose} />
      <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: 1.4, margin: "0 0 8px" }}>{c.title}</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.location}</span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 10px",
                borderRadius: 20,
                background: isDone ? "rgba(100,116,139,0.12)" : "rgba(34,197,94,0.1)",
                color: isDone ? "#64748b" : "#4ade80",
                border: `1px solid ${isDone ? "rgba(100,116,139,0.2)" : "rgba(34,197,94,0.2)"}`,
              }}
            >
              {isDone ? "Selesai" : "Aktif"}
            </span>
          </div>
        </div>

        <div style={{ background: "#080a12", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontSize: 11, color: "#475569" }}>Progress Donasi</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? "#94a3b8" : "#34d399" }}>{p}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 6, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: "100%", width: `${p}%`, background: isDone ? "#475569" : "linear-gradient(90deg,#059669,#34d399)", borderRadius: 6, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, textAlign: "center" }}>
            {[
              { label: "Terkumpul", val: fmtFull(c.gathered) },
              { label: "Target", val: fmtFull(c.target) },
              { label: "Sisa", val: c.target - c.gathered <= 0 ? "—" : fmtFull(c.target - c.gathered) },
            ].map((s) => (
              <div key={s.label}>
                <p style={{ fontSize: 10, color: "#475569", margin: "0 0 4px" }}>{s.label}</p>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", margin: 0 }}>{s.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
          <span style={{ color: "#475569" }}>Tenggat Waktu</span>
          <span style={{ color: "#94a3b8" }}>{c.deadline || "—"}</span>
        </div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#475569", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Deskripsi</p>
          <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>{c.description || "Tidak ada deskripsi."}</p>
        </div>

        <button
          onClick={onClose}
          style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#475569", borderRadius: 9, padding: "11px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}

function Th({ col, label, sortKey, sortDir, onSort }) {
  const active = sortKey === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        padding: "12px 16px",
        textAlign: "left",
        cursor: "pointer",
        color: active ? "#e2e8f0" : "#475569",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        <span style={{ opacity: active ? 1 : 0.3 }}>{Icon.Sort(active ? sortDir : null)}</span>
      </span>
    </th>
  );
}

export default function ProgramDonasi() {
  const [userRole, setUserRole] = useState("user");
  const canManage = userRole === "superadmin" || userRole === "admin";
  const canDelete = userRole === "superadmin" || userRole === "admin";
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { list: notifs, push: notify, remove: removeNotif } = useNotif();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [sortKey, setSortKey] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [formModal, setFormModal] = useState({ open: false, mode: "add", data: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, campaign: null });
  const [detailModal, setDetailModal] = useState({ open: false, campaign: null });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "user");
      }
    } catch (_) {}
    fetchCampaigns();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, filterCat, sortKey, sortDir, perPage]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/campaigns", { headers: { "ngrok-skip-browser-warning": "true" } });
      const data = res.data.data || [];
      setCampaigns(
        data.map((c) => ({
          id: c.id,
          title: c.judul || c.title || "",
          category: c.kategori || "Kemanusiaan",
          location: c.daerah || c.location || "",
          description: c.deskripsi || c.description || "",
          image_url: c.imgSeed || c.image_url || "",
          target: c.target || c.target_amount || 0,
          gathered: c.terkumpul || c.current_amount || 0,
          deadline: c.end_date || c.deadline || c.tanggal_berakhir || c.batas_waktu || "",
          sisaHari: c.sisaHari ?? c.sisa_hari ?? null,
          status: (c.sisaHari ?? c.sisa_hari ?? 1) <= 0 ? "Selesai" : "Aktif",
        })),
      );
    } catch {
      notify("Gagal mengambil data dari server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = campaigns.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) && (filterCat === "Semua" || c.category === filterCat));
    return [...list].sort((a, b) => {
      let va = sortKey === "percent" ? pct(a.gathered, a.target) : a[sortKey];
      let vb = sortKey === "percent" ? pct(b.gathered, b.target) : b[sortKey];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [campaigns, search, filterCat, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const stats = useMemo(
    () => ({
      total: campaigns.length,
      active: campaigns.filter((c) => c.status === "Aktif").length,
      done: campaigns.filter((c) => c.status === "Selesai").length,
      gathered: campaigns.reduce((s, c) => s + c.gathered, 0),
    }),
    [campaigns],
  );

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormModal({ open: true, mode: "add", data: null });
  };

  const openEdit = (c) => {
    setFormData({
      title: c.title,
      category: c.category,
      target: c.target,
      deadline: c.deadline,
      status: c.status,
      location: c.location,
      description: c.description,
      image_file: null,
      image_preview: c.image_url?.startsWith("http") ? c.image_url : "",
    });
    setFormModal({ open: true, mode: "edit", data: c });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (name === "image_file") {
      const file = value;
      if (!file) {
        setFormData((p) => ({ ...p, image_file: null, image_preview: "" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        notify("Ukuran gambar maksimal 5 MB", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => setFormData((p) => ({ ...p, image_file: file, image_preview: ev.target.result }));
      reader.readAsDataURL(file);
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.target || !formData.deadline || !formData.location || !formData.description) {
      notify("Lengkapi semua kolom wajib", "error");
      return;
    }
    setSubmitting(true);

    const fd = new FormData();
    fd.append("category_id", catId(formData.category));
    fd.append("title", formData.title);
    fd.append("location", formData.location);
    fd.append("description", formData.description);
    fd.append("target_amount", Number(formData.target));
    fd.append("end_date", formData.deadline);
    fd.append("is_urgent", formData.status !== "Aktif" ? "true" : "false");
    fd.append("fundraiser", "Admin");

    if (formData.image_file) {
      fd.append("image", formData.image_file);
    }

    try {
      const config = { headers: { "ngrok-skip-browser-warning": "true" } };

      if (formModal.mode === "add") {
        await api.post("/api/campaigns", fd, config);
        notify("Program berhasil dibuat");
      } else {
        await api.put(`/api/campaigns/${formModal.data.id}`, fd, config);
        notify("Program berhasil diperbarui");
      }
      setFormModal({ open: false, mode: "add", data: null });
      fetchCampaigns();
    } catch (err) {
      notify(err.response?.data?.message || "Gagal menyimpan data", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/campaigns/${deleteModal.campaign.id}`, { headers: { "ngrok-skip-browser-warning": "true" } });
      notify("Program berhasil dihapus");
      setDeleteModal({ open: false, campaign: null });
      fetchCampaigns();
    } catch {
      notify("Gagal menghapus data", "error");
    }
  };

  const pageRange = useMemo(() => {
    const delta = 2,
      range = [];
    for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) range.push(i);
    return range;
  }, [page, totalPages]);

  const thProps = { sortKey, sortDir, onSort: handleSort };

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: "#07090e", fontFamily: "'Sora','DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes notifIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.97) translateY(6px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .row-hover:hover td { background:rgba(255,255,255,0.025) !important; }
        .btn-action { display:flex;align-items:center;justify-content:center;gap:5px;border:none;border-radius:7px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:all 0.15s; }
        .btn-action:hover { opacity:0.85;transform:scale(0.97); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
      `}</style>

      <Notifs list={notifs} onRemove={removeNotif} />

      <div className="px-6 pt-6 pb-0 shrink-0">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: "0 0 4px", textTransform: "uppercase" }}>MANAJEMEN DONASI</p>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Program Donasi</h1>
          </div>
          {canManage && (
            <button
              onClick={openAdd}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "#1d4ed8",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                padding: "9px 16px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(29,78,216,0.35)",
              }}
            >
              {Icon.Plus} Tambah Program
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 18 }}>
          {[
            { label: "Total Program", value: stats.total, accent: "#94a3b8" },
            { label: "Aktif", value: stats.active, accent: "#34d399" },
            { label: "Selesai", value: stats.done, accent: "#60a5fa" },
            { label: "Dana Terkumpul", value: fmt(stats.gathered), accent: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "12px 16px" }}>
              <p style={{ fontSize: 10, color: "#475569", margin: "0 0 5px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: s.accent, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#475569" }}>{Icon.Search}</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama program..."
              style={{
                width: "100%",
                boxSizing: "border-box",
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
              }}
            />
          </div>
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            style={{
              background: "#0d1020",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 9,
              padding: "8px 12px",
              fontSize: 11,
              fontWeight: 600,
              color: filterCat !== "Semua" ? "#e2e8f0" : "#475569",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {CATEGORIES_FILTER.map((c) => (
              <option key={c} value={c} style={{ background: "#0d1020" }}>
                {c}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#475569" }}>Tampilkan</span>
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9, padding: "8px 10px", fontSize: 11, fontWeight: 600, color: "#94a3b8", outline: "none", cursor: "pointer" }}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n} style={{ background: "#0d1020" }}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: 11, color: "#475569", marginLeft: "auto" }}>{filtered.length} program ditemukan</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto [&::-webkit-scrollbar]:hidden" style={{ padding: "16px 24px 8px" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200 }}>
            <div style={{ width: 32, height: 32, border: "2px solid #1d4ed8", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite", marginBottom: 12 }} />
            <p style={{ fontSize: 13, color: "#475569" }}>Memuat data...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>Tidak ada program</p>
            <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Coba ubah filter atau tambah program baru.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", width: 32 }}>#</th>
                <Th col="title" label="Program" {...thProps} />
                <Th col="category" label="Kategori" {...thProps} />
                <Th col="location" label="Lokasi" {...thProps} />
                <Th col="percent" label="Progress" {...thProps} />
                <Th col="target" label="Target" {...thProps} />
                <Th col="deadline" label="Tenggat" {...thProps} />
                <Th col="status" label="Status" {...thProps} />
                <th style={{ padding: "12px 16px", textAlign: "right", color: "#475569", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((c, idx) => {
                const p = pct(c.gathered, c.target);
                const isDone = c.status === "Selesai" || p >= 100;
                const num = (page - 1) * perPage + idx + 1;
                const cat = CAT_BADGE[c.category] || { bg: "rgba(100,116,139,0.12)", color: "#94a3b8" };
                return (
                  <tr key={c.id} className="row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "14px 16px", fontSize: 11, color: "#334155" }}>{num}</td>
                    <td style={{ padding: "14px 16px", maxWidth: 240 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.title}>
                        {c.title}
                      </p>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: cat.bg, color: cat.color }}>{c.category}</span>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 11, color: "#64748b", maxWidth: 120 }}>
                      <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={c.location}>
                        {c.location || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px", minWidth: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.06)", borderRadius: 5, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${p}%`, background: isDone ? "#334155" : "linear-gradient(90deg,#1d4ed8,#3b82f6)", borderRadius: 5 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, color: isDone ? "#475569" : "#60a5fa", minWidth: 30 }}>{p}%</span>
                      </div>
                      <p style={{ fontSize: 10, color: "#334155", margin: "4px 0 0" }}>{fmt(c.gathered)}</p>
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>{fmt(c.target)}</td>
                    <td style={{ padding: "14px 16px", fontSize: 11, color: "#64748b" }}>{c.deadline ? c.deadline : c.sisaHari != null ? `${c.sisaHari} hari lagi` : "—"}</td>{" "}
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          padding: "3px 10px",
                          borderRadius: 20,
                          background: isDone ? "rgba(100,116,139,0.1)" : "rgba(34,197,94,0.1)",
                          color: isDone ? "#64748b" : "#4ade80",
                          border: `1px solid ${isDone ? "rgba(100,116,139,0.2)" : "rgba(34,197,94,0.2)"}`,
                        }}
                      >
                        {isDone ? "Selesai" : "Aktif"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                        <button className="btn-action" title="Detail" onClick={() => setDetailModal({ open: true, campaign: c })} style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8" }}>
                          {Icon.Eye}
                        </button>
                        {canManage && (
                          <button className="btn-action" title="Edit" onClick={() => openEdit(c)} style={{ background: "rgba(29,78,216,0.15)", color: "#60a5fa" }}>
                            {Icon.Edit}
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn-action" title="Hapus" onClick={() => setDeleteModal({ open: true, campaign: c })} style={{ background: "rgba(220,38,38,0.12)", color: "#f87171" }}>
                            {Icon.Trash}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
            Halaman <span style={{ color: "#94a3b8" }}>{page}</span> dari <span style={{ color: "#94a3b8" }}>{totalPages}</span>
          </p>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { label: "«", go: 1 },
              { label: "‹", go: Math.max(1, page - 1) },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => setPage(b.go)}
                disabled={page === 1}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: page === 1 ? "#334155" : "#64748b",
                  cursor: page === 1 ? "not-allowed" : "pointer",
                }}
              >
                {b.label}
              </button>
            ))}
            {pageRange.map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                style={{
                  minWidth: 32,
                  padding: "6px 0",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  background: n === page ? "#1d4ed8" : "transparent",
                  border: `1px solid ${n === page ? "#1d4ed8" : "rgba(255,255,255,0.07)"}`,
                  color: n === page ? "#fff" : "#64748b",
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
            {[
              { label: "›", go: Math.min(totalPages, page + 1) },
              { label: "»", go: totalPages },
            ].map((b) => (
              <button
                key={b.label}
                onClick={() => setPage(b.go)}
                disabled={page === totalPages}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: page === totalPages ? "#334155" : "#64748b",
                  cursor: page === totalPages ? "not-allowed" : "pointer",
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <FormModal open={formModal.open} mode={formModal.mode} formData={formData} onChange={handleChange} onSubmit={handleSubmit} onClose={() => setFormModal({ open: false, mode: "add", data: null })} submitting={submitting} />
      <DeleteModal open={deleteModal.open} campaign={deleteModal.campaign} onConfirm={handleDelete} onClose={() => setDeleteModal({ open: false, campaign: null })} />
      <DetailModal open={detailModal.open} campaign={detailModal.campaign} onClose={() => setDetailModal({ open: false, campaign: null })} />
    </div>
  );
}
