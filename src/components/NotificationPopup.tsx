import { useEffect, useState, type SetStateAction } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import type { MarketCoin } from "../services/coingecko";

import { fiatCurrencies } from "../services/coingecko";

import { getRate } from "../services/exchange";

type Props = {
  coin: MarketCoin; // moeda que o usuário clicou
  onClose: () => void; // fecha o popup
  onConfirm?: (opts: {
    direction: "above" | "below";
    currency: string;
    targetPrice: number;
  }) => void;
};

export default function NotificationPopup({ coin, onClose, onConfirm }: Props) {
  // controls internos do formulário
  const [direction, setDirection] = useState<"above" | "below">("below");
  const [currency, setCurrency] = useState<string>("usd"); // começa em usd

  /* lista vinda do CoinGecko ------------------------------ */
  const [fiatList, setfiatList] = useState<string[]>([]);
  useEffect(() => {
    //resolve a promise exportada de uma vez
    fiatCurrencies
      .then(setfiatList)
      .catch((err) => console.error("Error fetching fiat currencies:", err));
  }, []);

  /* editable price (string -> permite vírgula / ponto) */
  const [targetPrice, setTargetPrice] = useState<string>(
    coin.current_price.toFixed(2)
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onConfirm?.({
      direction,
      currency,
      targetPrice: parseFloat(targetPrice.replace(",", ".")), // converte string ➜ number
    });
    onClose();
  }

  //currency exchange function
  async function handleCurrencyCHange(newCur: string) {
    if (newCur === currency) return;

    try {
      const rate = await getRate(currency, newCur);
      //console.log("Rate: ", rate);
      const oldValue = parseFloat(targetPrice.replace(",", ".")) || 0;
      const newValue = oldValue * rate;
      setTargetPrice(newValue.toFixed(2));
      setCurrency(newCur);
    } catch (err) {
      console.error("Error fetching exchange rate:", err);
    }
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
          <input
            type="text"
            value={targetPrice}
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setTargetPrice(e.target.value)
            }
            className="w-28 rounded bg-slate-800 px-2 py-1 text-sm ring-1
            ring-slate-700 focus:outline-none"
          />
          in&nbsp;
          {/* dropdown currency */}
          <select
            value={currency}
            onChange={(e) => {
              //console.log("Currency selecionada:", e.target.value);
              handleCurrencyCHange(e.target.value.toLowerCase());
            }}
            className="rounded bg-slate-800 px-2 py-1 text-sm ring-1 ring-slate-700 focus:outline-none"
          >
            {/* fallback enquanto carrega a lista */}
            {fiatList.length === 0 && (
              <option value={currency}>{currency.toUpperCase()}</option>
            )}
            {fiatList.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
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
