import { XMarkIcon } from "@heroicons/react/24/solid";
import InputField from "./InputField";
import { useState } from "react";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
};

export default function SignupPopup({ isOpen, onClose, onBackToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const [userAlreadyExists, setUserAlreadyExists] = useState(false); // Simulação de verificação de usuário existente

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordsMatch(false);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações adicionais
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return; //avoid sending the form
    }

    setPasswordsMatch(true);

    //TODO : auth logic
    onClose(); //close if autentication is successful
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
            {/* Botão de voltar */}
            <button
              onClick={onBackToLogin} // ou uma função específica para voltar ao login
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Voltar para login"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-gray-800">Signup</h2>
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

              {/* already logged in msg */}
              {userAlreadyExists && (
                <p className="text-red-600 text-sm mt-1">
                  Email already registered
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

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Repeat the password
              </label>
              <InputField
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                type="password"
                id="confirmPassword"
              />

              {/* Error msg */}
              {!passwordsMatch && (
                <p className="text-red-600 text-sm mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Signup
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
