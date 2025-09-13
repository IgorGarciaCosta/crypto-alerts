/* import { useState } from "react";
 */ /* import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg"; */

import { Header } from "./components/Header";
import { Home } from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />
      <Home />
    </div>
  );
}

export default App;
