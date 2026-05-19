import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Import Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Import Pages
import Home from "./pages/Public/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Berita from "./pages/Public/Berita/Berita";
import Donasi from "./pages/Public/Donasi/Donasi";

function AppContent() {
  const location = useLocation();

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!isAuthPage && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/berita" element={<Berita />} />
        <Route path="/donasi" element={<Donasi />} />
      </Routes>

      {!isAuthPage && <Footer />}
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
