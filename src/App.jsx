import React from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Public/Home/HeroSection";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="font-sans antialiased text-gray-900 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pb-16 md:pb-0 pt-16 md:pt-0">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
