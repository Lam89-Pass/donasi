import React from "react";

export default function DonationCard({ kategori, judul, terkumpul, target, persen, sisaWaktu }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-gray-300 to-gray-200 group-hover:scale-105 transition-transform duration-500"></div>
        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-ramadhan-green text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">{kategori}</span>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-4 text-gray-900 line-clamp-2 group-hover:text-ramadhan-green transition-colors">{judul}</h3>

        <div className="mt-auto">
          <div className="flex justify-between text-sm mb-2 font-medium text-gray-600">
            <span>Terkumpul</span>
            <span>Target</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 mb-3">
            <span className="text-ramadhan-green">{terkumpul}</span>
            <span>{target}</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
            <div className="bg-ramadhan-green h-2.5 rounded-full relative" style={{ width: persen }}>
              <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {sisaWaktu}
            </div>
            <button className="bg-green-50 text-ramadhan-green font-bold px-4 py-2 rounded-lg hover:bg-ramadhan-green hover:text-white transition-colors text-sm">Donasi</button>
          </div>
        </div>
      </div>
    </div>
  );
}
