import React from "react";
import Navbar from "./components/layout/Navbar";
import Home from "./pages/Public/Home/Home";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <div className="font-sans antialiased text-gray-900 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
