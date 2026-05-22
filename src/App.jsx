import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Sidebar from "./components/layout/Sidebar";
import Home from "./pages/Public/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Berita from "./pages/Public/Berita/Berita";
import Donasi from "./pages/Public/Donasi/Donasi";
import Statistik from "./pages/Dashboard/Statistik";
import KelolaRole from "./pages/Dashboard/KelolaRole";
import ProgramDonasi from "./pages/Dashboard/ProgramDonasi";
import KelolaBerita from "./pages/Dashboard/KelolaBerita";
import Transaksi from "./pages/Dashboard/Transaksi";
import Profile from "./pages/Dashboard/Profile";
import BeritaDetail from "./pages/Public/Berita/BeritaDetail";
import DonasiDetail from "./pages/Public/Donasi/DonasiDetail";
import ProsesDonasi from "./pages/Public/Donasi/ProsesDonasi";

function AppContent() {
  const location = useLocation();

  const isNoLayoutPage = location.pathname === "/login" || location.pathname === "/register" || location.pathname.startsWith("/dashboard");

  const isDashboardArea = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!isNoLayoutPage && <Navbar />}

      {isDashboardArea ? (
        <div className="min-h-screen flex bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30">
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            <Routes>
              <Route path="/dashboard" element={<Statistik />} />
              <Route path="/dashboard/users" element={<KelolaRole />} />
              <Route path="/dashboard/campaigns" element={<ProgramDonasi />} />
              <Route path="/dashboard/news" element={<KelolaBerita />} />
              <Route path="/dashboard/transactions" element={<Transaksi />} />
              <Route path="/dashboard/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/berita" element={<Berita />} />
          <Route path="/berita/:id" element={<BeritaDetail />} />
          <Route path="/donasi" element={<Donasi />} />
          <Route path="/donasi/:id" element={<DonasiDetail />} />
          <Route path="/donasi/:id/bayar" element={<ProsesDonasi />} />
        </Routes>
      )}

      {!isNoLayoutPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
