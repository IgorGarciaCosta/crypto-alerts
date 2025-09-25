import Drawer from "./Drawer";
import { UserIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import LoginPopup from "./LoginPopup";
import SignupPopup from "./SignupPopup";

import { useAuth } from "../context/AuthContext";
import { logout } from "../services/firebase";

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const isLogged = !!user;

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

  const avatar = user?.photoURL ?? ""; // string | null | undefined

  /* sempre que o usuário mudar, zeramos o erro */
  useEffect(() => {
    setImgError(false);
  }, [user?.uid]);

  return (
    <>
      <header className="w-full border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="text-lg font-semibold">CriptoTracker</div>

          <div className="flex items-center gap-2">
            {/*  username if loggedin */}
            {isLogged && (
              <span className="mr-2 text-sm text-slate-300 ">
                {user?.displayName ?? user?.email}
              </span>
            )}

            {/* ícone de usuário */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Open user menu"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            >
              {avatar && !imgError ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-6 w-6 rounded-full object-cover"
                  onError={() => setImgError(true)} // ⬅ se falhar, troca p/ ícone
                />
              ) : (
                <UserIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        {/* qualquer conteúdo dentro do painel */}
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <ul className="space-y-2 text-sm">
          {isLogged && (
            <>
              <li>
                <a className="hover:text-slate-200" href="/editusername">
                  Edit username
                </a>
              </li>
              <li>
                <a className="hover:text-slate-200" href="/myalerts">
                  My Alerts
                </a>
              </li>
            </>
          )}

          <li>
            <button
              className={`mt-4 rounded px-3 py-1 font-medium ${
                isLogged
                  ? "bg-red-600  hover:bg-red-900"
                  : "bg-green-600  hover:bg-green-900"
              }`}
              onClick={isLogged ? () => logout() : openlogin}
            >
              {isLogged ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </Drawer>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={closeAll}
        onSignupClicked={openSignup}
      />

      <SignupPopup
        isOpen={isSignupPopupOpen}
        onClose={closeAll}
        onBackToLogin={openlogin}
      />
    </>
  );
}
