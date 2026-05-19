import React from "react";

export default function BeritaTerkini() {
  return (
    <section className="bg-gray-50 py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Berita Terkini</h2>
          <p className="text-gray-500">Ikuti perkembangan penyaluran donasi dan kegiatan kami.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group cursor-pointer bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="h-48 bg-gray-200 rounded-xl mb-4 overflow-hidden">
                <div className="w-full h-full bg-ramadhan-light/20 group-hover:scale-105 transition-transform duration-500"></div>
              </div>
              <p className="text-ramadhan-green font-semibold text-sm mb-2">19 Mei 2026</p>
              <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-ramadhan-green transition-colors line-clamp-2">Penyaluran Dana Bantuan Tahap 1 Sukses Dilaksanakan</h3>
              <p className="text-gray-600 text-sm line-clamp-2">Alhamdulillah, berkat bantuan para donatur, kami telah menyalurkan bantuan berupa bahan pokok dan obat-obatan...</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
