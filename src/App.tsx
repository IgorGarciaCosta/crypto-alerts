/* import { useState } from "react";
 */ /* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */

import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import MyAlerts from "./pages/MyAlerts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myalerts" element={<MyAlerts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
