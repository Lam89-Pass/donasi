import React, { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_URL || "https://ruangdonasiapi-production.up.railway.app";

async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

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
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none", maxWidth: "calc(100vw - 40px)" }}>
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
              minWidth: 240,
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

const EyeOpen = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeOff = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
    />
  </svg>
);

const ROLE_CONFIG = {
  superadmin: { label: "Super Admin", color: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "rgba(251,146,60,0.2)" },
  admin: { label: "Admin", color: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "rgba(96,165,250,0.2)" },
  user: { label: "User", color: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "rgba(74,222,128,0.2)" },
};

const inSt = {
  background: "#080a12",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#e2e8f0",
  borderRadius: 9,
  padding: "11px 14px",
  fontSize: 13,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const inStDisabled = {
  ...inSt,
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.04)",
  color: "#334155",
  cursor: "not-allowed",
};

export default function Profile() {
  const { list: notifs, push: notify, remove: removeNotif } = useNotif();
  const [loading, setLoading] = useState(true);
  const [isGoogle, setIsGoogle] = useState(false);
  const [userRole, setUserRole] = useState("user");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });
  const [savingPass, setSavingPass] = useState(false);
  const role = ROLE_CONFIG[userRole] || ROLE_CONFIG.user;

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch("/api/users/profile");
        const d = res.data;
        setProfile({
          name: d.name || "",
          email: d.email || "",
          phone: d.phone || "",
        });
        setUserRole(d.role || "user");
        setIsGoogle(d.is_google || false);
      } catch (err) {
        notify(err.message || "Gagal memuat profil", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const strength = (() => {
    const v = passwords.newPass;
    if (!v) return null;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    if (s <= 1) return { label: "Lemah", color: "#ef4444", width: "25%" };
    if (s === 2) return { label: "Cukup", color: "#fb923c", width: "50%" };
    if (s === 3) return { label: "Kuat", color: "#facc15", width: "75%" };
    return { label: "Sangat Kuat", color: "#4ade80", width: "100%" };
  })();

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) {
      notify("Nama tidak boleh kosong", "error");
      return;
    }
    if (!isGoogle && !profile.email.trim()) {
      notify("Email tidak boleh kosong", "error");
      return;
    }

    setSavingProfile(true);
    try {
      const body = {
        name: profile.name.trim(),
        phone: profile.phone.trim(),
      };
      if (!isGoogle) body.email = profile.email.trim();

      const res = await apiFetch("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });

      if (res.data) {
        setProfile((p) => ({
          name: res.data.name || p.name,
          email: res.data.email || p.email,
          phone: res.data.phone !== undefined ? res.data.phone || "" : p.phone,
        }));
      }
      notify("Data profil berhasil diperbarui");
    } catch (err) {
      notify(err.message || "Gagal menyimpan profil", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!passwords.current) {
      notify("Masukkan kata sandi saat ini", "error");
      return;
    }
    if (passwords.newPass.length < 8) {
      notify("Kata sandi baru minimal 8 karakter", "error");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      notify("Konfirmasi kata sandi tidak cocok", "error");
      return;
    }

    setSavingPass(true);
    try {
      await apiFetch("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          old_password: passwords.current,
          new_password: passwords.newPass,
          confirm_new_password: passwords.confirm,
        }),
      });
      setPasswords({ current: "", newPass: "", confirm: "" });
      notify("Kata sandi berhasil diperbarui");
    } catch (err) {
      notify(err.message || "Gagal memperbarui kata sandi", "error");
    } finally {
      setSavingPass(false);
    }
  };

  const togglePw = (key) => setShowPw((p) => ({ ...p, [key]: !p[key] }));

  if (loading) {
    return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#07090e", color: "#334155", fontSize: 14, fontFamily: "'Sora',system-ui,sans-serif" }}>Memuat profil...</div>;
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", background: "#07090e", fontFamily: "'Sora','DM Sans',system-ui,sans-serif", overflowY: "auto" }} className="[&::-webkit-scrollbar]:hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        @keyframes notifIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(8px);  } to { opacity:1; transform:translateY(0);  } }
        .save-btn:hover:not(:disabled) { opacity:0.85; transform:scale(0.98); }
        .save-btn { transition: all 0.15s; }
        .section-grid {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 32px;
          margin-bottom: 28px;
          animation: fadeUp 0.3s ease both;
        }
        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .pw-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        @media (max-width: 600px) {
          .section-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            margin-bottom: 20px !important;
          }
          .field-row {
            grid-template-columns: 1fr !important;
          }
          .pw-row {
            grid-template-columns: 1fr !important;
          }
          .page-header {
            padding: 0 16px !important;
          }
          .page-body {
            padding: 20px 16px 48px !important;
          }
          .section-desc {
            display: none !important;
          }
          .section-label {
            padding-top: 0 !important;
          }
        }
      `}</style>

      <Notifs list={notifs} onRemove={removeNotif} />

      <div className="page-header" style={{ padding: "0 24px", flexShrink: 0 }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#2563eb", letterSpacing: "0.1em", margin: 0, textTransform: "uppercase" }}>Akun Saya</p>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>Pengaturan Profil</h1>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: 7,
              background: role.bg,
              color: role.color,
              border: `1px solid ${role.border}`,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            {role.label}
          </span>
        </div>
      </div>

      <div className="page-body" style={{ flex: 1, padding: "28px 24px 48px", display: "flex", flexDirection: "column", gap: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "16px 20px",
            background: "#0d1020",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14,
            marginBottom: 28,
            animation: "fadeUp 0.3s ease both",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${role.color}33, ${role.color}11)`,
              border: `2px solid ${role.color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: role.color,
              flexShrink: 0,
              letterSpacing: "-1px",
            }}
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name || "—"}</p>
            <p style={{ fontSize: 12, color: "#334155", margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.email || "—"}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 5, background: role.bg, color: role.color, border: `1px solid ${role.border}` }}>{role.label}</span>
              {isGoogle && <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 5, background: "rgba(234,67,53,0.1)", color: "#ea4335", border: "1px solid rgba(234,67,53,0.25)" }}>Google Account</span>}
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: 28 }} />

        <form onSubmit={handleSaveProfile}>
          <div className="section-grid" style={{ animationDelay: "0.05s" }}>
            <div className="section-label" style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#2563eb", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Identitas</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px", lineHeight: 1.3 }}>Data Pribadi</p>
              <p className="section-desc" style={{ fontSize: 11, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                Informasi dasar akun Anda. Nama akan ditampilkan kepada pengguna lain.
                {isGoogle && (
                  <>
                    <br />
                    <span style={{ color: "#ea4335" }}>Email tidak dapat diubah karena menggunakan akun Google.</span>
                  </>
                )}
              </p>
            </div>
            <div style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="field-row">
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Nama Lengkap <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    required
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nama lengkap Anda"
                    style={inSt}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(29,78,216,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>Nomor HP / WA</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    style={inSt}
                    onFocus={(e) => (e.target.style.borderColor = "rgba(29,78,216,0.5)")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Alamat Email {!isGoogle && <span style={{ color: "#ef4444" }}>*</span>}
                  {isGoogle && <span style={{ color: "#ea4335", marginLeft: 6, textTransform: "none", fontWeight: 500 }}>(tidak dapat diubah)</span>}
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled={isGoogle}
                  required={!isGoogle}
                  onChange={(e) => !isGoogle && setProfile((p) => ({ ...p, email: e.target.value }))}
                  placeholder="email@domain.com"
                  style={isGoogle ? inStDisabled : inSt}
                  onFocus={(e) => {
                    if (!isGoogle) e.target.style.borderColor = "rgba(29,78,216,0.5)";
                  }}
                  onBlur={(e) => {
                    if (!isGoogle) e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="save-btn"
                  style={{
                    background: savingProfile ? "#1e3a5f" : "#1d4ed8",
                    color: "#fff",
                    border: "none",
                    borderRadius: 9,
                    padding: "10px 22px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: savingProfile ? "not-allowed" : "pointer",
                    opacity: savingProfile ? 0.7 : 1,
                    boxShadow: "0 0 20px rgba(29,78,216,0.25)",
                  }}
                >
                  {savingProfile ? "Menyimpan..." : "Simpan Data Pribadi"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: 28 }} />

        {isGoogle ? (
          <div className="section-grid" style={{ animationDelay: "0.1s" }}>
            <div className="section-label" style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Keamanan</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px", lineHeight: 1.3 }}>Ubah Kata Sandi</p>
            </div>
            <div style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>🔒</span>
              <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6 }}>Akun Anda terhubung dengan Google. Kata sandi dikelola oleh Google dan tidak dapat diubah di sini.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSavePassword}>
            <div className="section-grid" style={{ animationDelay: "0.1s" }}>
              <div className="section-label" style={{ paddingTop: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#dc2626", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Keamanan</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px", lineHeight: 1.3 }}>Ubah Kata Sandi</p>
                <p className="section-desc" style={{ fontSize: 11, color: "#334155", lineHeight: 1.7, margin: 0 }}>
                  Gunakan kombinasi huruf besar, angka, dan simbol untuk kata sandi yang kuat.
                </p>
              </div>
              <div style={{ background: "#0d1020", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Kata Sandi Saat Ini <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw.current ? "text" : "password"}
                      value={passwords.current}
                      onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                      placeholder="••••••••"
                      style={{ ...inSt, paddingRight: 40 }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(220,38,38,0.4)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                    />
                    <button
                      type="button"
                      onClick={() => togglePw("current")}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#334155", display: "flex" }}
                    >
                      {showPw.current ? <EyeOff /> : <EyeOpen />}
                    </button>
                  </div>
                </div>

                <div className="pw-row">
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Kata Sandi Baru <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw.newPass ? "text" : "password"}
                        value={passwords.newPass}
                        onChange={(e) => setPasswords((p) => ({ ...p, newPass: e.target.value }))}
                        placeholder="Min. 8 karakter"
                        style={{ ...inSt, paddingRight: 40 }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(220,38,38,0.4)")}
                        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
                      />
                      <button
                        type="button"
                        onClick={() => togglePw("newPass")}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#334155", display: "flex" }}
                      >
                        {showPw.newPass ? <EyeOff /> : <EyeOpen />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      Konfirmasi <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw.confirm ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                        placeholder="Ulangi kata sandi"
                        style={{
                          ...inSt,
                          paddingRight: 40,
                          borderColor: passwords.confirm && passwords.confirm !== passwords.newPass ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "rgba(220,38,38,0.4)")}
                        onBlur={(e) => {
                          e.target.style.borderColor = passwords.confirm && passwords.confirm !== passwords.newPass ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.08)";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => togglePw("confirm")}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#334155", display: "flex" }}
                      >
                        {showPw.confirm ? <EyeOff /> : <EyeOpen />}
                      </button>
                    </div>
                    {passwords.confirm && passwords.confirm !== passwords.newPass && <p style={{ fontSize: 10, color: "#ef4444", margin: 0 }}>Kata sandi tidak cocok</p>}
                  </div>
                </div>

                {strength && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 4, transition: "width 0.3s ease" }} />
                    </div>
                    <p style={{ fontSize: 10, color: strength.color, margin: 0, fontWeight: 600 }}>Kekuatan: {strength.label}</p>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <button
                    type="submit"
                    disabled={savingPass}
                    className="save-btn"
                    style={{
                      background: savingPass ? "#3f1515" : "#dc2626",
                      color: "#fff",
                      border: "none",
                      borderRadius: 9,
                      padding: "10px 22px",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: savingPass ? "not-allowed" : "pointer",
                      opacity: savingPass ? 0.7 : 1,
                      boxShadow: "0 0 20px rgba(220,38,38,0.2)",
                    }}
                  >
                    {savingPass ? "Memperbarui..." : "Perbarui Kata Sandi"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
