import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../../api";

const categories = ["Semua", "Kemanusiaan", "Sosial", "Pendidikan", "Kesehatan", "Bencana Alam", "Infrastruktur", "Ekonomi"];

const sortOptions = [
  { label: "Terbaru", value: "newest" },
  { label: "Terlama", value: "oldest" },
  { label: "Baca Tercepat", value: "shortest" },
];

const ITEMS_PER_PAGE = 6;

export default function Berita() {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const [activeCategory, setActiveCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setErrorMsg(null);

        const response = await api.get("/api/articles", {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const data = response.data.data || response.data || [];

        const mappedData = data
          .filter((n) => n.status !== "Draft")
          .map((n) => {
            const rawDate = new Date(n.date || n.created_at || Date.now());
            const formattedDate = rawDate.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return {
              id: n.id || n.ID,
              title: n.title || n.Title,
              excerpt: n.excerpt || n.Excerpt || n.content?.substring(0, 120) + "...",
              category: n.category || n.Category || "Kemanusiaan",
              date: formattedDate,
              timestamp: rawDate.getTime(),
              readTime: n.read_time || n.ReadTime || 3,
              image: n.image || n.Image || `https://picsum.photos/seed/${n.id || "berita"}/800/600`,
            };
          });

        setNewsData(mappedData);
      } catch (error) {
        console.error("Gagal load berita:", error);
        setErrorMsg("Gagal memuat berita dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory, search, sort]);

  const filtered = useMemo(() => {
    let data = newsData;
    if (activeCategory !== "Semua") data = data.filter((n) => n.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((n) => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q));
    }
    data = [...data].sort((a, b) => {
      if (sort === "newest") return b.timestamp - a.timestamp;
      if (sort === "oldest") return a.timestamp - b.timestamp;
      if (sort === "shortest") return a.readTime - b.readTime;
      return 0;
    });
    return data;
  }, [newsData, activeCategory, search, sort]);

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);
  const totalPages = Math.ceil(rest.length / ITEMS_PER_PAGE);
  const paginated = rest.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const goPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-20 font-sans relative overflow-x-hidden">
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='%2316a34a' stroke-width='0.75' stroke-opacity='0.06'/%3E%3Ccircle cx='30' cy='30' r='8' fill='none' stroke='%2316a34a' stroke-width='0.75' stroke-opacity='0.06'/%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%2316a34a' stroke-width='0.5' stroke-opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "60px",
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-10 text-center lg:text-left">
          <p className="text-xs font-bold tracking-[0.15em] uppercase text-ramadhan-green mb-2">Ruang Redaksi</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-4">
            Kisah, Kabar & <span className="text-transparent bg-clip-text bg-gradient-to-r from-ramadhan-green to-emerald-500">Inspirasi</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-2xl mx-auto lg:mx-0">Laporan lapangan, kisah nyata penerima manfaat, dan catatan transparansi donasi dari tim relawan RuangDonasi.</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-wrap justify-center lg:justify-start gap-2 w-full lg:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeCategory === cat ? "bg-ramadhan-green border-ramadhan-green text-white shadow-md" : "bg-transparent border-gray-200 text-gray-500 hover:border-ramadhan-green hover:text-ramadhan-green"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" strokeWidth="2.5"></circle>
                <path d="M21 21l-4.35-4.35" strokeWidth="2.5" strokeLinecap="round"></path>
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari artikel..."
                className="w-full bg-gray-50 border border-gray-200 focus:border-ramadhan-green focus:ring-2 focus:ring-emerald-50 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-all"
              />
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 border border-gray-200 focus:border-ramadhan-green rounded-xl py-2.5 px-4 text-sm font-bold text-gray-700 outline-none cursor-pointer appearance-none pr-10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
              }}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            <div className="w-10 h-10 border-4 border-green-200 border-t-ramadhan-green rounded-full animate-spin mb-4" style={{ animation: "spin 1s linear infinite" }}></div>
            <p className="text-gray-500 font-bold">Memuat berita...</p>
          </div>
        )}

        {errorMsg && !isLoading && (
          <div className="text-center py-20 bg-red-50 rounded-[2rem] border border-red-100 shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-2">Gagal Memuat!</h3>
            <p className="text-red-500">{errorMsg}</p>
          </div>
        )}

        {!isLoading && !errorMsg && featured && page === 1 && (
          <Link to={`/berita/${featured.id}`} className="block mb-12 group">
            <div className="bg-white rounded-[2rem] p-3 sm:p-4 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center hover:shadow-lg transition-shadow duration-300">
              <div className="w-full h-[300px] sm:h-[400px] rounded-3xl overflow-hidden relative bg-gray-100">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">{featured.category}</span>
                  <span className="text-white/80 text-xs font-medium flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {featured.readTime} mnt
                  </span>
                </div>
              </div>

              <div className="p-4 sm:pr-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-1 bg-ramadhan-green rounded-full"></span>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Artikel Utama</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-snug mb-4 group-hover:text-ramadhan-green transition-colors">{featured.title}</h2>
                <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <span className="text-sm font-bold text-gray-400">{featured.date}</span>
                  <span className="text-sm font-bold text-ramadhan-green flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                    Baca Selengkapnya
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {!isLoading && !errorMsg && filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-400 mb-2">Tidak ada artikel ditemukan.</h3>
            <p className="text-gray-500">Coba ubah kata kunci atau kategori pencarian di atas.</p>
          </div>
        )}

        {!isLoading && !errorMsg && paginated.length > 0 && (
          <>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{page === 1 ? "Artikel Lainnya" : `Halaman ${page}`}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginated.map((news) => (
                <Link key={news.id} to={`/berita/${news.id}`} className="bg-white rounded-[2rem] p-3 shadow-sm border border-gray-100 flex flex-col group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="w-full h-48 sm:h-56 rounded-3xl overflow-hidden relative mb-4 bg-gray-100">
                    <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">{news.category}</span>
                      <span className="text-white/90 text-[10px] font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        {news.readTime} mnt
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 px-2 pb-2">
                    <span className="text-[11px] font-bold text-gray-400 mb-2">{news.date}</span>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-ramadhan-green transition-colors line-clamp-2">{news.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3 flex-1">{news.excerpt}</p>
                    <div className="flex items-center text-xs font-bold text-ramadhan-green mt-auto border-t border-gray-50 pt-4 group-hover:translate-x-1 transition-transform">
                      Baca Artikel
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-gray-200">
                <button
                  onClick={() => goPage(page - 1)}
                  disabled={page === 1}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${page === 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 border border-gray-200 hover:border-ramadhan-green hover:text-ramadhan-green shadow-sm"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => goPage(p)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all shadow-sm ${page === p ? "bg-ramadhan-green text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-ramadhan-green hover:text-ramadhan-green"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => goPage(page + 1)}
                  disabled={page === totalPages}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${page === totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-white text-gray-600 border border-gray-200 hover:border-ramadhan-green hover:text-ramadhan-green shadow-sm"}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
