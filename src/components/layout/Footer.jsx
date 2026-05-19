import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-extrabold text-2xl text-white tracking-tight mb-4 block">
            Donasi<span className="text-ramadhan-light">In</span>
          </span>
          <p className="text-gray-400 font-light leading-relaxed">Platform donasi terpercaya untuk menyalurkan kebaikan Anda kepada mereka yang membutuhkan secara transparan dan aman.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Navigasi</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-ramadhan-light transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ramadhan-light transition-colors">
                Program Donasi
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ramadhan-light transition-colors">
                Berita Terkini
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-ramadhan-light transition-colors">
                Tentang Kami
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Kontak Kami</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Email: support@donasiin.com</li>
            <li>Telepon: 0812-3456-7890</li>
            <li>Alamat: Jl. Setiabudhi, Bandung</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">&copy; 2026 DonasiIn. All rights reserved.</div>
    </footer>
  );
}
