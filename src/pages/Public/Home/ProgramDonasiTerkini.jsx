import React from "react";
import DonationCard from "../../../../components/common/DonationCard";

export default function ProgramDonasiTerkini() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Program Donasi Terkini</h2>
            <p className="text-gray-500">Program terbaru yang sangat membutuhkan uluran tanganmu segera.</p>
          </div>
          <a href="/donasi" className="hidden md:block text-ramadhan-green font-semibold hover:text-ramadhan-light hover:underline transition-all">
            Lihat Semua &rarr;
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <DonationCard kategori="Bencana" judul="Bantuan Darurat Evakuasi dan Logistik Gempa Bumi" terkumpul="Rp 45.000.000" target="Rp 100.000.000" persen="45%" sisaWaktu="30 Hari" />
          <DonationCard kategori="Sosial" judul="Pembangunan Masjid Al-Ikhlas di Pelosok Desa" terkumpul="Rp 150.000.000" target="Rp 300.000.000" persen="50%" sisaWaktu="60 Hari" />
          <DonationCard kategori="Kesehatan" judul="Bantu Biaya Pengobatan Kanker Adik Budi" terkumpul="Rp 18.000.000" target="Rp 50.000.000" persen="36%" sisaWaktu="12 Hari" />
        </div>
      </div>
    </section>
  );
}
