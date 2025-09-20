import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import InputField from "./InputField";

import { login, loginWithGoogle } from "../services/firebase";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSignupClicked?: () => void;
};

export default function LoginPopup({
  isOpen,
  onClose,
  onSignupClicked,
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userNotRegistered, setUserNotRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //TODO: autentication logic

    try {
      await login(email, password);
      onClose(); //close if autentication is successful
    } catch (e) {
      setUserNotRegistered(true);
      console.log(e);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay escuro */}
      <div
        className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center p-4"
        //onClick={onClose}
      >
        {/* Popup */}
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cabeçalho */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Login</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <InputField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                id="email"
              />
              {/* user not resgisted  in msg */}
              {userNotRegistered && (
                <p className="text-red-600 text-sm mt-1">
                  Email not registered
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <InputField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                type="password"
                id="password"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Login
              </button>
            </div>

            {/* Botão do Google */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await loginWithGoogle();
                  onClose(); //close if autentication is successful
                } catch (e) {
                  console.log(e);
                }
              }}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {/* Ícone do Google */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </button>
          </form>

          {/* Rodapé */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Dont have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={onSignupClicked}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
