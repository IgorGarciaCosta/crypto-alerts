import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import type { MarketCoin } from "../services/coingecko";

type Props = {
  coin: MarketCoin; // moeda que o usuário clicou
  onClose: () => void; // fecha o popup
  onConfirm?: (opts: {
    direction: "above" | "below";
    currency: "BRL" | "USD";
  }) => void;
};

export default function NotificationPopup({ coin, onClose, onConfirm }: Props) {
  // controls internos do formulário
  const [direction, setDirection] = useState<"above" | "below">("below");
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm?.({ direction, currency });
    onClose();
  }

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      {/* Card */}
      <div className="relative w-[90%] max-w-md rounded-lg bg-slate-900 p-6 text-slate-100 shadow-lg ring-1 ring-slate-700">
        {/* close button (X) */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        {/* mensagem principal */}
        <p className="mb-4 leading-relaxed">
          Send me a notification as soon as{" "}
          <span className="font-semibold">{coin.name}</span> goes&nbsp;
          {/* dropdown direction */}
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as "above" | "below")}
            className="rounded bg-slate-800 px-2 py-1 text-sm ring-1 ring-slate-700 focus:outline-none"
          >
            <option value="above">above</option>
            <option value="below">below</option>
          </select>
          &nbsp;the price of&nbsp;
          <span className="font-semibold">
            {currency === "BRL"
              ? coin.current_price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              : (coin.current_price / 5).toLocaleString("en-US", {
                  // conversão grossa BRL→USD só para UI demo
                  style: "currency",
                  currency: "USD",
                })}
          </span>{" "}
          in&nbsp;
          {/* dropdown currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as "BRL" | "USD")}
            className="rounded bg-slate-800 px-2 py-1 text-sm ring-1 ring-slate-700 focus:outline-none"
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
          .
        </p>

        {/* botão Set Alert */}
        <form onSubmit={handleSubmit} className="text-center">
          <button
            type="submit"
            className="mt-2 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500"
          >
            Set Alert
          </button>
        </form>
      </div>
    </div>
  );
}
