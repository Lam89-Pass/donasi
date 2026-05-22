import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Apa itu RuangDonasi?",
    a: "Platform penggalangan dana yang menghubungkan donatur dengan program sosial terverifikasi. Setiap program melewati kurasi ketat untuk memastikan legitimasi dan transparansi penggunaan dana.",
  },
  {
    q: "Siapa yang bisa membuat program donasi?",
    a: "Individu, komunitas, yayasan, maupun lembaga sosial. Setiap pengajuan wajib melalui verifikasi identitas, validasi dokumen, dan penilaian kelayakan sebelum tayang.",
  },
  {
    q: "Berapa nominal minimum donasi?",
    a: "Tidak ada batas minimum. Setiap kontribusi, sekecil apapun, memiliki dampak nyata bagi penerimanya.",
  },
  {
    q: "Apakah seluruh donasi saya tersalurkan?",
    a: "Dana disalurkan penuh setelah dikurangi biaya operasional 5% untuk keberlanjutan platform. Rincian ini selalu ditampilkan secara transparan sebelum Anda menyelesaikan transaksi.",
  },
  {
    q: "Bisakah saya berdonasi secara anonim?",
    a: "Bisa. Pilih opsi sembunyikan nama pada halaman konfirmasi. Data Anda tetap tersimpan untuk keperluan audit, namun tidak ditampilkan secara publik.",
  },
  {
    q: "Seberapa aman data pribadi saya?",
    a: "Seluruh data dienkripsi dengan standar TLS 1.3. Kami tidak pernah menjual atau membagikan data pengguna kepada pihak ketiga untuk kepentingan komersial.",
  },
  {
    q: "Metode pembayaran apa yang tersedia?",
    a: "Transfer bank, dompet digital (GoPay, OVO, DANA, ShopeePay), kartu kredit/debit, dan QRIS. Konfirmasi bersifat real-time untuk dompet digital.",
  },
  {
    q: "Apa yang terjadi jika ditemukan penipuan?",
    a: "Program akan dibekukan dalam 1x24 jam setelah laporan masuk. Jika terbukti, seluruh dana dikembalikan penuh kepada donatur yang terlibat.",
  },
  {
    q: "Apakah ada bukti donasi resmi?",
    a: "Ya. Bukti donasi digital dikirim ke email Anda setiap transaksi berhasil. Dokumen ini dapat digunakan untuk keperluan pelaporan pribadi maupun pajak.",
  },
];

function Item({ item, isOpen, onToggle }) {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-colors duration-150 ${isOpen ? "" : "hover:bg-gray-50/50"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-8 py-5 text-left">
        <span className={`text-[15px] font-semibold leading-snug transition-colors duration-150 ${isOpen ? "text-[#1a7a4a]" : "text-gray-800"}`}>{item.q}</span>
        <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
          <svg className={`w-4 h-4 transition-colors duration-150 ${isOpen ? "text-[#1a7a4a]" : "text-gray-300"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-gray-500 leading-relaxed pr-10">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 pt-36 pb-32">
        <div className="mb-16">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#1a7a4a] mb-5">FAQ</p>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-5">
            Pertanyaan yang
            <br />
            sering diajukan.
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm">
            Jika tidak menemukan jawaban yang Anda cari, hubungi kami di{" "}
            <a href="mailto:bantuan@ruangdonasi.id" className="text-[#1a7a4a] font-semibold hover:underline underline-offset-2 transition-all">
              bantuan@ruangdonasi.id
            </a>
          </p>
        </div>

        <div>
          {faqs.map((item, i) => (
            <Item key={i} item={item} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Masih ada pertanyaan?</p>
            <p className="text-sm text-gray-400">Tim kami aktif setiap hari kerja.</p>
          </div>
          <Link to="/donasi" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a7a4a] text-white text-sm font-bold hover:bg-[#15623b] transition-colors duration-200 flex-shrink-0">
            Mulai Berdonasi
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
