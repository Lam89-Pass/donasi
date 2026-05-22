import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../api";

function ShareMenu({ url, title, onClose }) {
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    {
      label: "WhatsApp",
      color: "#25D366",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.089.537 4.049 1.473 5.759L0 24l6.404-1.448C8.08 23.468 10.007 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.613-.497-5.148-1.369l-.368-.219-3.804.861.876-3.708-.241-.382C2.529 15.686 2 13.898 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      ),
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`, "_blank"),
    },
    {
      label: "Twitter / X",
      color: "#000",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.261 5.635L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank"),
    },
    {
      label: "Facebook",
      color: "#1877F2",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank"),
    },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={onClose}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}></div>
      <div onClick={(e) => e.stopPropagation()} style={{ position: "relative", background: "#fff", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 16, color: "#111" }}>Bagikan Artikel</span>
          <button onClick={onClose} style={{ background: "#f4f4f4", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem", color: "#555", lineHeight: 1.5, marginBottom: "1.5rem" }}>"{title.length > 60 ? title.slice(0, 60) + "…" : title}"</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
          {shareOptions.map((opt) => (
            <button
              key={opt.label}
              onClick={opt.action}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderRadius: "0.875rem",
                border: "1.5px solid #eee",
                background: "#fff",
                cursor: "pointer",
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                color: "#222",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f8f8f8";
                e.currentTarget.style.borderColor = "#ddd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.borderColor = "#eee";
              }}
            >
              <span style={{ color: opt.color }}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
        <button
          onClick={copyLink}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "0.875rem",
            border: "1.5px solid",
            borderColor: copied ? "#22c55e" : "#e0ddd6",
            background: copied ? "#f0fdf4" : "#f8f7f4",
            cursor: "pointer",
            fontFamily: "'Poppins', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: copied ? "#15803d" : "#444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            transition: "all 0.2s",
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Tautan Tersalin
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              </svg>
              Salin Tautan
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const CAT_THEME = {
  Kemanusiaan: { color: "#1a1f3a", accent: "#fb923c" },
  Sosial: { color: "#1a1f3a", accent: "#38bdf8" },
  Pendidikan: { color: "#1a1f3a", accent: "#a78bfa" },
  Kesehatan: { color: "#1a1f3a", accent: "#f472b6" },
  "Bencana Alam": { color: "#1a1f3a", accent: "#f87171" },
  Infrastruktur: { color: "#1a1f3a", accent: "#facc15" },
  Ekonomi: { color: "#1a1f3a", accent: "#34d399" },
};

export default function BeritaDetail() {
  const { id } = useParams();
  const [showShare, setShowShare] = useState(false);
  const [article, setArticle] = useState(null);
  const [otherNews, setOtherNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const response = await api.get("/api/articles", {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const allData = response.data.data || response.data || [];
        const foundItem = allData.find((n) => String(n.id || n.ID) === String(id));

        if (!foundItem) {
          setErrorMsg("Artikel yang kamu cari tidak tersedia atau telah dihapus.");
        } else {
          const rawDate = new Date(foundItem.date || foundItem.created_at || Date.now());
          const catName = foundItem.category || foundItem.Category || "Kemanusiaan";

          setArticle({
            id: foundItem.id || foundItem.ID,
            title: foundItem.title || foundItem.Title,
            category: catName,
            author: foundItem.author || "Admin",
            date: rawDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
            readTime: foundItem.read_time || foundItem.ReadTime || 3,
            color: CAT_THEME[catName]?.color || "#111",
            accent: CAT_THEME[catName]?.accent || "#888",
            image: foundItem.image || foundItem.Image || `https://picsum.photos/seed/${id}/1200/600`,
            content: foundItem.content || foundItem.Content || "Tidak ada konten.",
          });

          const filteredOthers = allData
            .filter((n) => String(n.id || n.ID) !== String(id) && n.status !== "Draft")
            .slice(0, 3)
            .map((n) => {
              const rDate = new Date(n.date || n.created_at || Date.now());
              return {
                id: n.id || n.ID,
                title: n.title || n.Title,
                category: n.category || n.Category || "Kemanusiaan",
                date: rDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
                image: n.image || n.Image || `https://picsum.photos/seed/${n.id || "berita"}/800/600`,
              };
            });

          setOtherNews(filteredOthers);
        }
      } catch (error) {
        console.error("Gagal load artikel:", error);
        setErrorMsg("Terjadi kesalahan saat memuat artikel dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-32 pb-20 font-sans">
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        <div className="w-10 h-10 border-4 border-green-200 border-t-ramadhan-green rounded-full mb-4" style={{ animation: "spin 1s linear infinite" }}></div>
        <p className="text-gray-500 font-bold">Memuat artikel...</p>
      </div>
    );
  }

  if (errorMsg || !article) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-32 pb-20 font-sans text-center px-4">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Waduh!</h1>
          <p className="text-red-500 mb-8">{errorMsg}</p>
          <Link to="/berita" className="inline-block px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">
            Kembali ke Daftar Berita
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content.trim().split("\n\n");
  const articleUrl = typeof window !== "undefined" ? window.location.href : `https://ruangdonasi.org/berita/${id}`;

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#ffffff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <Link to="/berita" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-ramadhan-green transition-colors mb-8 font-medium text-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Daftar Berita
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md" style={{ color: article.accent, backgroundColor: `${article.accent}15` }}>
              {article.category}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-sm" style={{ background: article.color, color: article.accent }}>
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm m-0">{article.author}</p>
                  <p className="text-xs text-gray-500 font-medium m-0">
                    {article.date} · {article.readTime} menit baca
                  </p>
                </div>
              </div>

              <button onClick={() => setShowShare(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-bold transition-colors border border-gray-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Bagikan
              </button>
            </div>

            <div className="w-full h-[300px] sm:h-[450px] rounded-3xl overflow-hidden shadow-sm border border-gray-100 mb-8 bg-gray-100">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="text-gray-600 space-y-6">
              {paragraphs.map((para, i) => (
                <p key={i} className={`leading-relaxed whitespace-pre-wrap ${i === 0 ? "text-lg font-medium text-gray-800" : "text-base"}`}>
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-ramadhan-green rounded-full inline-block"></span>
                Berita Lainnya
              </h3>

              <div className="space-y-6">
                {otherNews.length > 0 ? (
                  otherNews.map((news) => (
                    <Link key={news.id} to={`/berita/${news.id}`} className="group flex gap-4 items-start">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm bg-gray-200">
                        <img src={news.image} alt={news.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-ramadhan-green uppercase tracking-wider block mb-1">{news.category}</span>
                        <h4 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-ramadhan-green transition-colors line-clamp-2 mb-2">{news.title}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{news.date}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center">Belum ada berita lainnya.</p>
                )}
              </div>

              <Link to="/berita" className="mt-8 w-full block text-center py-3 bg-white border border-gray-200 hover:border-ramadhan-green text-gray-700 hover:text-ramadhan-green rounded-xl text-sm font-bold transition-all">
                Lihat Semua Berita
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showShare && <ShareMenu url={articleUrl} title={article.title} onClose={() => setShowShare(false)} />}
    </div>
  );
}
