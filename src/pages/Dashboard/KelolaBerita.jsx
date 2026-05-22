import React, { useState, useMemo, useEffect } from "react";
import api from "../../api";

const CATEGORIES_FILTER = ["Semua", "Kemanusiaan", "Sosial", "Pendidikan", "Kesehatan", "Bencana Alam", "Infrastruktur", "Ekonomi"];
const CATEGORIES_FORM = ["Kemanusiaan", "Sosial", "Pendidikan", "Kesehatan", "Bencana Alam", "Infrastruktur", "Ekonomi"];
const EMPTY_FORM = { title: "", category: "Kemanusiaan", excerpt: "", content: "", status: "Dipublikasi", image: "" };
const CAT_THEME = {
  Kemanusiaan: { bg: "rgba(251,146,60,0.1)", color: "#fb923c" },
  Sosial: { bg: "rgba(56,189,248,0.1)", color: "#38bdf8" },
  Pendidikan: { bg: "rgba(167,139,250,0.1)", color: "#a78bfa" },
  Kesehatan: { bg: "rgba(244,114,182,0.1)", color: "#f472b6" },
  "Bencana Alam": { bg: "rgba(248,113,113,0.1)", color: "#f87171" },
  Infrastruktur: { bg: "rgba(250,204,21,0.1)", color: "#facc15" },
  Ekonomi: { bg: "rgba(52,211,153,0.1)", color: "#34d399" },
};

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
              minWidth: 280,
              maxWidth: 360,
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

const Ic = {
  Search: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Plus: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
    </svg>
  ),
  Edit: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  Trash: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Eye: (
    <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Close: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Upload: (
    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
};

function ModalCenter({ open, onClose, children, maxWidth = "max-w-xl" }) {
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
        className={`relative z-10 w-full ${maxWidth} max-h-[92vh] flex flex-col rounded-2xl overflow-hidden`}
        style={{ background: "#10121a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)", animation: "modalIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalForm({ open, onClose, children, maxWidth = "max-w-xl" }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(3,5,10,0.85)", backdropFilter: "blur(6px)" }} className="modal-form-backdrop">
      <div onClick={onClose} style={{ position: "absolute", inset: 0 }} />
      <div
        className={`relative z-10 w-full ${maxWidth} max-h-[92vh] flex flex-col rounded-2xl overflow-hidden modal-form-inner`}
        style={{ background: "#10121a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.7)", animation: "modalIn 0.18s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHead({ title, sub, onClose }) {
  return (
    <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9", margin: 0 }}>{title}</p>
        {sub && <p style={{ fontSize: 11, color: "#475569", margin: "3px 0 0" }}>{sub}</p>}
      </div>
      <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2, minWidth: 36, minHeight: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {Ic.Close}
      </button>
    </div>
  );
}

function FormModal({ open, mode, formData, onChange, onFileChange, onSubmit, onClose, submitting }) {
  const isEdit = mode === "edit";
  const inSt = { background: "#080a12", border: "1px solid rgba(255,255,255,0.08)", color: "#e2e8f0", borderRadius: 9, padding: "10px 14px", fontSize: 13, width: "100%", outline: "none", boxSizing: "border-box" };
  const lblSt = { fontSize: 10, fontWeight: 600, color: "#475569", letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 7 };

  return (
    <ModalForm open={open} onClose={onClose} maxWidth="max-w-2xl">
      <ModalHead title={isEdit ? "Edit Artikel" : "Tulis Artikel Baru"} sub={isEdit ? "Perbarui konten publikasi" : "Buat artikel atau laporan baru"} onClose={onClose} />
      <div style={{ overflowY: "auto", flex: 1 }} className="[&::-webkit-scrollbar]:hidden">
        <form onSubmit={onSubmit}>
          <div style={{ padding: "22px 22px", display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={lblSt}>Gambar Sampul (Opsional)</label>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {formData.image ? (
                  <img src={formData.image} alt="Preview" style={{ width: 80, height: 50, objectFit: "cover", borderRadius: 6, border: "1px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 80, height: 50, flexShrink: 0, background: "#080a12", borderRadius: 6, border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                    {Ic.Upload}
                  </div>
                )}
                <input type="file" accept="image/*" onChange={onFileChange} style={{ flex: 1, fontSize: 12, color: "#e2e8f0", minWidth: 0 }} />
              </div>
            </div>

            <div>
              <label style={lblSt}>
                Judul Artikel <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={onChange} placeholder="Masukkan judul artikel yang informatif..." style={inSt} required />
            </div>

            <div className="form-cat-status" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={lblSt}>Kategori</label>
                <select name="category" value={formData.category} onChange={onChange} style={{ ...inSt, cursor: "pointer" }}>
                  {CATEGORIES_FORM.map((c) => (
                    <option key={c} value={c} style={{ background: "#10121a" }}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lblSt}>Status Publikasi</label>
                <select name="status" value={formData.status} onChange={onChange} style={{ ...inSt, cursor: "pointer" }}>
                  <option value="Dipublikasi" style={{ background: "#10121a" }}>
                    Publikasi Langsung
                  </option>
                  <option value="Draft" style={{ background: "#10121a" }}>
                    Simpan sebagai Draft
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label style={lblSt}>
                Ringkasan Singkat (Excerpt) <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={onChange}
                placeholder="Tulis ringkasan/singkatan artikel (muncul di halaman depan)..."
                rows={2}
                style={{ ...inSt, resize: "none", lineHeight: 1.5 }}
                className="[&::-webkit-scrollbar]:hidden"
                required
              />
            </div>

            <div>
              <label style={lblSt}>
                Isi Konten Lengkap <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={onChange}
                placeholder="Tuliskan isi detail laporan atau cerita di sini..."
                rows={6}
                style={{ ...inSt, resize: "none", lineHeight: 1.7 }}
                className="[&::-webkit-scrollbar]:hidden"
                required
              />
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <button
                type="button"
                onClick={onClose}
                style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: "#475569", borderRadius: 9, padding: "11px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
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
                {submitting ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tayangkan Artikel"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </ModalForm>
  );
}

function DeleteModal({ open, item, onConfirm, onClose }) {
  return (
    <ModalCenter open={open} onClose={onClose} maxWidth="max-w-sm">
      <div style={{ padding: 24 }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          {Ic.Trash}
        </div>
        <p style={{ textAlign: "center", fontSize: 13, fontWeight: 600, color: "#f1f5f9", marginBottom: 8 }}>Hapus Artikel</p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#475569", lineHeight: 1.6, marginBottom: 22 }}>
          Aksi ini permanen. Artikel <span style={{ color: "#e2e8f0", fontWeight: 500 }}>"{item?.title}"</span> akan dihapus.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.09)", color: "#475569", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Batal
          </button>
          <button onClick={onConfirm} style={{ flex: 1, background: "#dc2626", color: "#fff", border: "none", borderRadius: 9, padding: "10px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Hapus
          </button>
        </div>
      </div>
    </ModalCenter>
  );
}

function DetailModal({ open, item, onClose }) {
  if (!item) return null;
  const cat = CAT_THEME[item.category] || { bg: "rgba(148,163,184,0.1)", color: "#94a3b8" };
  return (
    <ModalCenter open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div style={{ height: 3, background: `linear-gradient(90deg, ${cat.color}, transparent)`, flexShrink: 0 }} />
      <ModalHead title={item.title} sub={`${item.category}  ·  ${item.date}`} onClose={onClose} />
      <div style={{ overflowY: "auto", flex: 1, padding: "22px 22px" }} className="[&::-webkit-scrollbar]:hidden">
        {item.image && <img src={item.image} alt={item.title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, marginBottom: 20, border: "1px solid rgba(255,255,255,0.05)" }} />}

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "12px 14px", background: "#080a12", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: cat.bg, color: cat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
            {(item.author || "A").charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 80 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{item.author || "Admin"}</p>
            <p style={{ fontSize: 10, color: "#334155", margin: "2px 0 0" }}>Diterbitkan {item.date}</p>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)" }}>⏳ {item.read_time} Min</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 6,
                background: item.status === "Dipublikasi" ? "rgba(34,197,94,0.1)" : "rgba(251,146,60,0.1)",
                color: item.status === "Dipublikasi" ? "#4ade80" : "#fb923c",
                border: `1px solid ${item.status === "Dipublikasi" ? "rgba(34,197,94,0.2)" : "rgba(251,146,60,0.2)"}`,
              }}
            >
              {item.status}
            </span>
          </div>
        </div>

        <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: cat.bg, color: cat.color, display: "inline-block", marginBottom: 16 }}>{item.category}</span>

        <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderLeft: `3px solid ${cat.color}`, borderRadius: "0 8px 8px 0", marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontStyle: "italic", color: "#cbd5e1", margin: 0 }}>{item.excerpt}</p>
        </div>

        <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.85, whiteSpace: "pre-wrap", margin: 0 }}>{item.content}</p>

        <button
          onClick={onClose}
          style={{ marginTop: 28, width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#475569", borderRadius: 9, padding: "11px 0", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
        >
          Tutup
        </button>
      </div>
    </ModalCenter>
  );
}

export default function KelolaBerita() {
  const [userRole, setUserRole] = useState("superadmin");
  const canManage = true;
  const canDelete = true;
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { list: notifs, push: notify, remove: removeNotif } = useNotif();

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/articles", { headers: { "ngrok-skip-browser-warning": "true" } });
      const data = res.data.data || res.data || [];
      const mappedData = data.map((n) => ({
        id: n.id || n.ID,
        title: n.title || n.Title,
        category: n.category || n.Category || "Kemanusiaan",
        excerpt: n.excerpt || n.Excerpt || "",
        content: n.content || n.Content || "",
        read_time: n.read_time || n.ReadTime || 3,
        author: n.author || "Admin",
        date: n.date || n.created_at || "Baru saja",
        status: n.status || "Dipublikasi",
        image: n.image || n.Image || "",
      }));
      setNews(mappedData);
    } catch (error) {
      console.error("Gagal load berita:", error);
      notify("Gagal mengambil data dari server", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("Semua");
  const [formModal, setFormModal] = useState({ open: false, mode: "add", item: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [detailModal, setDetailModal] = useState({ open: false, item: null });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(
    () =>
      news.filter((n) => {
        if (!canManage && n.status === "Draft") return false;
        const mSearch = n.title && n.title.toLowerCase().includes(search.toLowerCase());
        const mCat = filterCat === "Semua" || n.category === filterCat;
        return mSearch && mCat;
      }),
    [news, search, filterCat, canManage],
  );

  const published = news.filter((n) => n.status === "Dipublikasi").length;
  const drafts = news.filter((n) => n.status === "Draft").length;

  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setFormModal({ open: true, mode: "add", item: null });
  };

  const openEdit = (item) => {
    setFormData({ title: item.title, category: item.category, excerpt: item.excerpt, content: item.content, status: item.status, image: item.image });
    setFormModal({ open: true, mode: "edit", item });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        setFormData((prev) => ({ ...prev, image: canvas.toDataURL("image/jpeg", 0.7) }));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.excerpt) {
      notify("Judul, Ringkasan, dan Konten wajib diisi", "error");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        read_time: Math.max(1, Math.ceil(formData.content.length / 400)),
        color: "#1a1f3a",
        accent: CAT_THEME[formData.category]?.color || "#fb923c",
        image: formData.image,
      };
      if (formModal.mode === "add") {
        await api.post("/api/articles", payload, { headers: { "ngrok-skip-browser-warning": "true" } });
        notify("Artikel berhasil ditayangkan");
      } else {
        await api.put(`/api/articles/${formModal.item.id}`, payload, { headers: { "ngrok-skip-browser-warning": "true" } });
        notify("Artikel berhasil diperbarui");
      }
      setFormModal({ open: false, mode: "add", item: null });
      fetchNews();
    } catch (error) {
      console.error(error);
      notify("Terjadi kesalahan saat menyimpan artikel", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/articles/${deleteModal.item.id}`, { headers: { "ngrok-skip-browser-warning": "true" } });
      notify("Artikel berhasil dihapus");
      setDeleteModal({ open: false, item: null });
      fetchNews();
    } catch (error) {
      notify("Gagal menghapus artikel", "error");
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#07090e", fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes notifIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes sheetIn { from { opacity:0; transform:translateY(100%); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .news-row:hover { background: rgba(255,255,255,0.025) !important; }
        .news-row { transition: background 0.15s; }
        .act-btn { display:flex; align-items:center; justify-content:center; gap:5px; border:none; border-radius:7px; padding:5px 10px; font-size:11px; font-weight:600; cursor:pointer; transition:all 0.15s; }
        .act-btn:hover { opacity:0.8; transform:scale(0.97); }

        @media (max-width: 640px) {
          /* Notifikasi — full width, tidak terpotong */
          .notif-container { top: 12px !important; right: 12px !important; left: 12px !important; }
          .notif-container > div { min-width: unset !important; max-width: 100% !important; width: 100%; box-sizing: border-box; }

          /* Padding halaman */
          .page-pad { padding: 0 14px !important; }
          .list-pad { padding: 10px 14px 32px !important; }

          /* Header */
          .hdr { height: auto !important; min-height: 56px !important; padding: 12px 0 !important; }
          .hdr h1 { font-size: 15px !important; }

          /* Stats — tetap 3 kolom tapi lebih compact */
          .stats-grid { gap: 8px !important; padding-top: 12px !important; }
          .stats-grid > div { padding: 10px 10px !important; }
          .stats-grid .s-lbl { font-size: 9px !important; }
          .stats-grid .s-val { font-size: 18px !important; }

          /* Search+filter — search full width, filter row di bawah */
          .sfrow { flex-direction: column !important; gap: 8px !important; padding: 12px 0 !important; }
          .sfrow .s-wrap { width: 100% !important; }
          .sfrow .f-wrap { display: flex !important; align-items: center !important; gap: 8px !important; width: 100% !important; }
          .sfrow .f-wrap select { flex: 1 !important; }

          /* Tombol aksi artikel — susun vertikal */
          .act-group { flex-direction: column !important; padding: 10px 10px 10px 4px !important; gap: 5px !important; }
          .act-btn { padding: 7px 8px !important; }

          /* Meta baris artikel — date pindah ke bawah */
          .news-meta { flex-wrap: wrap !important; }
          .news-meta .n-date { width: 100% !important; margin-left: 0 !important; margin-top: 1px !important; }

          /* Form modal — bottom sheet di mobile */
          .modal-form-backdrop { align-items: flex-end !important; padding: 0 !important; }
          .modal-form-inner {
            border-radius: 18px 18px 0 0 !important;
            max-height: 92vh !important;
            animation: sheetIn 0.22s cubic-bezier(0.16,1,0.3,1) !important;
          }

          /* Form: kategori & status stack */
          .form-cat-status { grid-template-columns: 1fr !important; }

          /* Tap target lebih besar */
          .act-btn { min-width: 32px; min-height: 32px; }
          * { -webkit-tap-highlight-color: transparent; }
        }
      `}</style>

      <Notifs list={notifs} onRemove={removeNotif} />

      <div className="page-pad" style={{ padding: "0 24px", flexShrink: 0 }}>
        <div className="hdr" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: 0 }}>PUSAT INFORMASI</p>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>Kabar & Berita</h1>
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
                boxShadow: "0 0 20px rgba(29,78,216,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {Ic.Plus} Tulis Artikel
            </button>
          )}
        </div>

        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "18px 0 0" }}>
          {[
            { label: "Total Artikel", value: news.length, accent: "#94a3b8" },
            { label: "Dipublikasi", value: published, accent: "#4ade80" },
            { label: "Draft", value: drafts, accent: "#fb923c" },
          ].map((s, i) => (
            <div key={i} style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "13px 16px", animation: `fadeUp 0.3s ease ${i * 60}ms both` }}>
              <p className="s-lbl" style={{ fontSize: 10, color: "#334155", margin: "0 0 5px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {s.label}
              </p>
              <p className="s-val" style={{ fontSize: 20, fontWeight: 700, color: s.accent, margin: 0 }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="sfrow" style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="s-wrap" style={{ position: "relative", flex: 1 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "#334155" }}>{Ic.Search}</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul artikel..."
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
              }}
            />
          </div>
          <div className="f-wrap" style={{ display: "contents" }}>
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
                color: filterCat !== "Semua" ? "#e2e8f0" : "#334155",
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
            <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap" }}>{filtered.length} artikel</span>
          </div>
        </div>
      </div>

      <div className="list-pad [&::-webkit-scrollbar]:hidden" style={{ flex: 1, overflowY: "auto", padding: "12px 24px 24px" }}>
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200 }}>
            <p style={{ color: "#475569", fontSize: 13 }}>Memuat data dari server...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, border: "1px solid rgba(255,255,255,0.05)", borderRadius: 14, background: "rgba(255,255,255,0.01)" }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 6px" }}>Tidak ada artikel</p>
            <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Coba ubah filter atau buat artikel baru.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filtered.map((item, idx) => {
              const cat = CAT_THEME[item.category] || { bg: "rgba(148,163,184,0.1)", color: "#94a3b8" };
              const isPub = item.status === "Dipublikasi";
              return (
                <div
                  key={item.id}
                  className="news-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "3px 1fr auto",
                    alignItems: "center",
                    gap: 0,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.04)",
                    marginBottom: 4,
                    animation: `fadeUp 0.3s ease ${idx * 40}ms both`,
                  }}
                >
                  <div style={{ alignSelf: "stretch", background: isPub ? cat.color : "#334155", opacity: isPub ? 0.7 : 0.4 }} />
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
                    <div className="news-meta" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 5, background: cat.bg, color: cat.color, letterSpacing: "0.04em", textTransform: "uppercase" }}>{item.category}</span>
                      {canManage && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: 5,
                            background: isPub ? "rgba(34,197,94,0.08)" : "rgba(251,146,60,0.08)",
                            color: isPub ? "#4ade80" : "#fb923c",
                            border: `1px solid ${isPub ? "rgba(34,197,94,0.15)" : "rgba(251,146,60,0.15)"}`,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {item.status}
                        </span>
                      )}
                      <span className="n-date" style={{ fontSize: 10, color: "#334155", marginLeft: "auto" }}>
                        {item.date} · {item.author}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    <p style={{ fontSize: 11, color: "#475569", margin: 0, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.excerpt || item.content}</p>
                  </div>
                  <div className="act-group" style={{ padding: "0 16px 0 8px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <button className="act-btn" title="Baca" onClick={() => setDetailModal({ open: true, item })} style={{ background: "rgba(255,255,255,0.05)", color: "#64748b" }}>
                      {Ic.Eye}
                    </button>
                    {canManage && (
                      <button className="act-btn" title="Edit" onClick={() => openEdit(item)} style={{ background: "rgba(29,78,216,0.14)", color: "#60a5fa" }}>
                        {Ic.Edit}
                      </button>
                    )}
                    {canDelete && (
                      <button className="act-btn" title="Hapus" onClick={() => setDeleteModal({ open: true, item })} style={{ background: "rgba(220,38,38,0.12)", color: "#f87171" }}>
                        {Ic.Trash}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FormModal
        open={formModal.open}
        mode={formModal.mode}
        formData={formData}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onClose={() => setFormModal({ open: false, mode: "add", item: null })}
        submitting={submitting}
      />
      <DeleteModal open={deleteModal.open} item={deleteModal.item} onConfirm={handleDelete} onClose={() => setDeleteModal({ open: false, item: null })} />
      <DetailModal open={detailModal.open} item={detailModal.item} onClose={() => setDetailModal({ open: false, item: null })} />
    </div>
  );
}
