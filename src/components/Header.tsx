import Drawer from "./Drawer";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import LoginPopup from "./LoginPopup";
import SignupPopup from "./SignupPopup";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);

  const IsLogged = false;

  const handleAutentication = () => {
    if (IsLogged) {
      alert("is logged in");
    } else {
      openlogin();
    }
  };

  const openSignup = () => {
    setIsSignupPopupOpen(true);
    setIsLoginPopupOpen(false);
  };

  const openlogin = () => {
    setIsLoginPopupOpen(true);
    setIsSignupPopupOpen(false);
  };

  const closeAll = () => {
    setIsLoginPopupOpen(false);
    setIsSignupPopupOpen(false);
  };

  return (
    <>
      <header className="w-full border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">CriptoTracker</div>
          {/* ícone de usuário */}
          <button
            onClick={() => setOpen(true)}
            aria-label="Open user menu"
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <UserIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        {/* qualquer conteúdo dentro do painel */}
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a className="hover:text-slate-200" href="/profile">
              Edit Data
            </a>
          </li>

          <li>
            <button
              className={`mt-4 rounded px-3 py-1 font-medium ${
                IsLogged
                  ? "bg-red-600  hover:bg-red-900"
                  : "bg-green-600  hover:bg-green-900"
              }`}
              onClick={handleAutentication}
            >
              {IsLogged ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </Drawer>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeAll}
        onSignupClicked={openSignup}
      />

      <SignupPopup isOpen={isSignupPopupOpen} onClose={closeAll} />
    </>
  );
}
