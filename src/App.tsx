/* import { useState } from "react";
 */ /* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */

import { Header } from "./components/Header";
import EditUsername from "./pages/EditUsername";
import { Home } from "./pages/Home";
import MyAlerts from "./pages/MyAlerts";
import Footer from "./components/Footer";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myalerts" element={<MyAlerts />} />
          <Route path="/editusername" element={<EditUsername />} />
        </Routes>

        <Footer></Footer>
      </Router>
    </div>
  );
}

export default App;
