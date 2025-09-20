import { useNavigate } from "react-router-dom";

type Props = {
  path: string;
};

export default function ReturnButton({ path }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <button
          onClick={() => navigate("/" + path)}
          className="fixed top-20 left-4 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full shadow-lg z-50"
          aria-label="Voltar"
        >
          {/* Ícone de seta */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
