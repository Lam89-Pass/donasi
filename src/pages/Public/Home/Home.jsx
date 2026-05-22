import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../../assets/banner.png";
import api from "../../../api";

function formatRupiah(num) {
  return `Rp ${Number(num).toLocaleString("id-ID")}`;
}

function formatCompactRupiah(num) {
  if (num >= 1000000000) return `Rp ${(num / 1000000000).toFixed(1).replace(".", ",")} M`;
  if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1).replace(".", ",")} Jt`;
  if (num >= 1000) return `Rp ${(num / 1000).toFixed(0)} Rb`;
  return `Rp ${num}`;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://ruangdonasiapi-production.up.railway.app";

function DonationCard({ id, kategori, lokasi, judul, terkumpul, target, persen, sisaWaktu, gambar, berakhir }) {
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/donasi/${id}`)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {gambar ? <img src={gambar} alt={judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />}
        <div className="absolute top-3 left-3">
          <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">{kategori}</span>
        </div>
        <div className="absolute top-3 right-3">
          {berakhir ? (
            <span className="bg-[#e53935] text-white text-xs font-bold px-3 py-1 rounded-full">Berakhir</span>
          ) : (
            <span className="bg-white text-gray-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">{sisaWaktu} lagi</span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        {lokasi && <p className="text-xs text-gray-400 font-medium mb-1">{lokasi}</p>}
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-4 line-clamp-2 group-hover:text-[#1a7a4a] transition-colors">{judul}</h3>
        <div className="mt-auto">
          <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
            <div className="h-1.5 rounded-full bg-[#1a7a4a] transition-all duration-700" style={{ width: persen }} />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#1a7a4a] font-bold text-base">{terkumpul}</p>
              <p className="text-gray-400 text-xs mt-0.5">dari {target}</p>
            </div>
            <p className="text-gray-500 text-sm font-semibold">{persen}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/donasi/${id}/bayar`);
          }}
          className="mt-5 w-full bg-[#1a7a4a] hover:bg-[#155f3a] text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm"
        >
          Donasi Sekarang
        </button>
      </div>
    </div>
  );
}

function NewsCard({ id, judul, tanggal, kategori, gambar, featured }) {
  const navigate = useNavigate();

  if (featured) {
    return (
      <div onClick={() => navigate(`/berita/${id}`)} className="md:col-span-1 relative rounded-2xl overflow-hidden cursor-pointer group h-[340px]">
        <div className="absolute inset-0 bg-gray-800">
          {gambar ? (
            <img src={gambar} alt={judul} className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a7a4a] to-[#0d3d25]" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <span className="inline-block bg-[#1a7a4a] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">{kategori}</span>
          <h3 className="text-xl font-bold text-white leading-snug group-hover:text-gray-200 transition-colors line-clamp-3">{judul}</h3>
          <p className="text-gray-300 text-sm mt-2">{tanggal}</p>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => navigate(`/berita/${id}`)} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex flex-col h-[340px]">
      <div className="h-40 bg-gray-100 overflow-hidden shrink-0">
        {gambar ? <img src={gambar} alt={judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[#1a7a4a] text-xs font-bold uppercase tracking-wide mb-2">{kategori}</span>
        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#1a7a4a] transition-colors line-clamp-3">{judul}</h3>
        <p className="text-gray-400 text-xs mt-auto pt-3">{tanggal}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [donasiData, setDonasiData] = useState([]);
  const [beritaData, setBeritaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    penerima: 0,
    penghimpunan: 0,
    tersalurkan: 0,
    donatur: 0,
  });
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(0);
  const categories = ["Semua", "Ekonomi", "Pendidikan", "Sosial", "Bencana", "Kesehatan"];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        const headers = { "ngrok-skip-browser-warning": "true" };
        const [resDonasi, resBerita] = await Promise.all([api.get("/api/campaigns", { headers }), api.get("/api/articles", { headers })]);

        const rawDonasi = resDonasi.data.data || [];

        let totalTerkumpul = 0;
        let totalDonatur = 0;
        let danaTersalurkan = 0;
        let expiredCampaignCount = 0;
        let expiredDonorsCount = 0;

        const mappedDonasi = rawDonasi.map((item) => {
          const terkumpul = item.terkumpul || item.current_amount || 0;
          const donatur = item.donatur || item.donatorCount || item.DonatorCount || 0;
          const isExpired = item.sisaHari <= 0;

          totalTerkumpul += terkumpul;
          totalDonatur += donatur;

          if (isExpired) {
            danaTersalurkan += terkumpul;
            expiredCampaignCount += 1;
            expiredDonorsCount += donatur;
          }

          const percent = item.target > 0 ? Math.min(100, Math.round((terkumpul / item.target) * 100)) : 0;
          const hasImage = item.imgSeed && item.imgSeed.trim() !== "";
          const imgSrc = hasImage ? (item.imgSeed.startsWith("http") ? item.imgSeed : `${BASE_URL}/${item.imgSeed.replace(/^\/+/, "")}`) : null;

          return {
            id: item.id,
            kategori: item.kategori || "Umum",
            lokasi: item.daerah || "Belum diatur",
            judul: item.judul,
            terkumpul: formatRupiah(terkumpul),
            target: formatRupiah(item.target),
            persen: `${percent}%`,
            sisaHariRaw: item.sisaHari,
            sisaWaktu: isExpired ? "Berakhir" : `${item.sisaHari} Hari`,
            berakhir: isExpired,
            gambar: imgSrc,
          };
        });

        const penerimaManfaat = expiredDonorsCount + expiredCampaignCount;

        setPlatformStats({
          penerima: penerimaManfaat,
          penghimpunan: totalTerkumpul,
          tersalurkan: danaTersalurkan,
          donatur: totalDonatur,
        });

        setDonasiData(mappedDonasi);

        const rawBerita = resBerita.data.data || resBerita.data || [];
        const publishedBerita = rawBerita
          .filter((n) => n.status !== "Draft")
          .sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at))
          .slice(0, 3)
          .map((n, index) => {
            const rawDate = new Date(n.date || n.created_at || Date.now());
            const formattedDate = rawDate.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
            return {
              id: n.id || n.ID,
              featured: index === 0,
              kategori: n.category || n.Category || "Informasi",
              judul: n.title || n.Title,
              tanggal: formattedDate,
              gambar: n.image || n.Image || `https://picsum.photos/seed/${n.id || "berita"}/800/600`,
            };
          });
        setBeritaData(publishedBerita);
      } catch (error) {
        console.error("Gagal load data Homepage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const filteredDonations = activeCategory === "Semua" ? donasiData : donasiData.filter((d) => d.kategori === activeCategory);
  const perPage = 3;
  const totalPages = Math.ceil(filteredDonations.length / perPage);
  const displayed = filteredDonations.slice(currentPage * perPage, (currentPage + 1) * perPage);
  const urgentDonations = donasiData.filter((d) => d.sisaHariRaw > 0 && d.sisaHariRaw <= 30).slice(0, 3);

  const statsData = [
    {
      label: "Penerima Manfaat",
      value: platformStats.penerima > 0 ? `${platformStats.penerima}+` : "0",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Penghimpunan",
      value: formatCompactRupiah(platformStats.penghimpunan),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Dana Tersalurkan",
      value: formatCompactRupiah(platformStats.tersalurkan),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Total Donatur",
      value: platformStats.donatur > 0 ? `${platformStats.donatur}+` : "0",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7f5] font-sans pb-20">
      <section className="relative w-full md:h-[85vh] md:min-h-[480px]">
        <img src={bannerImg} alt="Banner Donasi" className="w-full h-auto block md:h-full md:object-cover md:object-top" />
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-6 -mt-6 md:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-md grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center py-3 px-1.5 md:py-7 md:px-4 text-center">
              <div className="w-6 h-6 md:w-12 md:h-12 rounded-full bg-[#eaf5ef] flex items-center justify-center mb-1.5 md:mb-3 text-[#1a7a4a] [&>svg]:w-3 [&>svg]:h-3 md:[&>svg]:w-6 md:[&>svg]:h-6">{stat.icon}</div>
              <p className="text-sm md:text-2xl font-black text-gray-900 leading-tight">{isLoading ? <span className="animate-pulse bg-gray-200 h-4 w-12 md:h-6 md:w-20 rounded inline-block"></span> : stat.value}</p>
              <p className="text-gray-500 text-[10px] md:text-sm mt-0.5 md:mt-1 font-medium leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <p className="text-[#1a7a4a] text-sm font-bold uppercase tracking-widest mb-1">Program Kami</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Program Donasi Aktif</h2>
          </div>
          <button onClick={() => navigate("/donasi")} className="text-[#1a7a4a] font-semibold text-sm hover:underline flex items-center gap-1">
            Lihat Semua
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(0);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === cat ? "bg-[#1a7a4a] text-white border-[#1a7a4a] shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a7a4a] hover:text-[#1a7a4a]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 py-10">Memuat program donasi...</p>
        ) : displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayed.map((item, idx) => (
              <DonationCard key={idx} {...item} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10 bg-white rounded-xl">Belum ada program untuk kategori ini.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button key={idx} onClick={() => setCurrentPage(idx)} className={`h-2 rounded-full transition-all duration-300 ${currentPage === idx ? "bg-[#1a7a4a] w-6" : "bg-gray-300 w-2 hover:bg-gray-400"}`} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate("/donasi")}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#1a7a4a] hover:text-white text-gray-800 border border-gray-200 font-semibold px-8 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm group"
          >
            Lihat Semua Kategori
            <svg className="w-4 h-4 text-[#1a7a4a] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {urgentDonations.length > 0 && (
        <section className="bg-white border-y border-gray-100 mt-16 py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
              <div>
                <p className="text-[#1a7a4a] text-sm font-bold uppercase tracking-widest mb-1">Butuh Bantuan Segera</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">Program Mendesak</h2>
                <p className="text-gray-500 text-sm mt-1">Program yang tenggat waktunya kurang dari 30 hari.</p>
              </div>
              <button onClick={() => navigate("/donasi")} className="text-[#1a7a4a] font-semibold text-sm hover:underline flex items-center gap-1">
                Lihat Semua
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {urgentDonations.map((item, idx) => (
                <DonationCard key={idx} {...item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="bg-[#1a7a4a] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }}
          />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Bersama Kita Bisa Memberi Dampak Nyata</h2>
            <p className="text-green-100 text-sm">Setiap rupiah yang kamu donasikan akan tersalurkan langsung kepada yang membutuhkan.</p>
          </div>
          <div className="flex gap-3 relative z-10 shrink-0">
            <button onClick={() => navigate("/donasi")} className="bg-white text-[#1a7a4a] font-bold px-7 py-3.5 rounded-xl hover:bg-gray-50 transition-colors text-sm shadow-md">
              Donasi Sekarang
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 mt-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#1a7a4a] text-sm font-bold uppercase tracking-widest mb-1">Artikel & Laporan</p>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Berita Terkini</h2>
          </div>
          <button onClick={() => navigate("/berita")} className="text-[#1a7a4a] font-semibold text-sm hover:underline flex items-center gap-1">
            Lihat Semua
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-500 py-10">Memuat berita terkini...</p>
        ) : beritaData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {beritaData.map((news, idx) => (
              <NewsCard key={idx} {...news} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10 bg-white rounded-xl">Belum ada artikel dipublikasikan.</p>
        )}
      </section>
    </div>
  );
}
