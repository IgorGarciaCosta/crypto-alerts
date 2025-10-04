import { useRef, useState } from "react";
import { fetchMarketsBRL, type MarketCoin } from "../services/coingecko";
import { parseCoinIds } from "../utils/coinIds";
import { ChartBarIcon } from "@heroicons/react/24/solid";

import { ArrowRightCircleIcon } from "@heroicons/react/24/solid";
import NotificationPopup from "../components/NotificationPopup";

import { formatBRL, formatPercent } from "../utils/format";

export function Home() {
  // Controlled input for comma-separated ids
  const [input, setInput] = useState<string>("bitcoin, ethereum");
  // Data and UI state
  const [data, setData] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //state to control popup visibility
  const [popupCOin, setPopupCoin] = useState<MarketCoin | null>(null);

  function openPopup(coin: MarketCoin) {
    setPopupCoin(coin);
  }

  const [showMore, setShowMore] = useState<boolean>(false);

  // Keep a ref to the current AbortController to cancel previous requests
  const abortRef = useRef<AbortController | null>(null);

  /**
   * Validate and fetch data from CoinGecko using user-provided ids.
   * - Parses the input string into valid ids.
   * - Validates count (avoid overly large requests).
   * - Cancels any in-flight request before starting a new one.
   */
  async function handleGetData(e?: React.FormEvent) {
    //only calls prevent default when e exists.Avoid
    //reloading screenwhen the form is sent
    e?.preventDefault();

    // Reset error befone new search
    setError(null);

    // Parse and validate ids
    const ids = parseCoinIds(input);
    if (ids.length === 0) {
      setError("Digite pelo menos 1 id de moeda (ex.: bitcoin, ethereum).");
      setData([]); //MOSTRAR PRO USUARIO
      return;
    }

    // Soft limit to avoid huge queries and rate limiting issues
    const MAX_IDS = 50;
    if (ids.length > MAX_IDS) {
      setError(
        `Você inseriu ${ids.length} ids. O máximo recomendado é ${MAX_IDS}.`
      );
      setData([]);
      return;
    }

    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    /*  creates a new abort controller so this execution
    can be aorted if necessary */
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true); //updates UI state to show loading symbol

    try {
      const res = await fetchMarketsBRL(ids, { signal: controller.signal });
      setData(res);
      //console.log("CoinGecko data:", res); for debugging
    } catch (err: unknown) {
      // If aborted, we simply ignore and keep UI stable
      if (
        err &&
        typeof err === "object" &&
        "name" in err &&
        (err as { name?: string }).name === "AbortError"
      )
        return;
      console.error("Erro ao buscar CoinGecko:", err);
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Falha ao buscar dados"
      );
      setData([]);
    } finally {
      // Only clear loading if this is still the latest controller
      if (abortRef.current === controller) {
        setLoading(false);
        abortRef.current = null;
      }
    }
  }

  // Helper to display the parsed ids under the input (feedback to user)
  const parsedIds = parseCoinIds(input);

  const pctClass = (v: number | null | undefined) =>
    v == null
      ? "text-slate-400"
      : v >= 0
      ? "text-emerald-400"
      : "text-rose-400";

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <img
        src="/CTlogoMain.png"
        alt="Logo CriptoTracker"
        className="h-15 w-45 mb-5"
      />

      {/* Search and action area */}
      <form onSubmit={handleGetData} className="mb-6 space-y-3">
        <label className="block text-sm text-slate-300">
          Tipe the currency names separated by commas (ex.: bitcoin, ethereum,
          solana)
        </label>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="bitcoin, ethereum, solana"
            className="flex-1 rounded border border-slate-700 bg-slate-900 px-3 py-2 outline-none focus:border-slate-500"
          />
          <button
            type="submit"
            //makes the button inactive if its loading, number of ids is 0 or more than 50
            disabled={
              loading || parsedIds.length === 0 || parsedIds.length > 50
            }
            className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-60"
            onClick={() =>
              !loading && console.log("Fetching for ids:", parsedIds)
            }
          >
            {loading ? "Carregando..." : "Get Data"}
          </button>
        </div>

        {/* Validation and feedback */}
        <div className="text-xs text-slate-400">
          Identified IDs:{" "}
          {parsedIds.length > 0 ? parsedIds.join(", ") : "nenhum"}
        </div>

        {error && <div className="text-sm text-rose-400">{error}</div>}
      </form>

      {/* Result table */}
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-medium">Results</h2>

          {/* Right-side round toggle button with tooltip */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-pressed={showMore} //communicates toggle state
              aria-label={showMore ? "Hide extra columns" : "Show more results"}
              title="Show more results" // Native tooltip on hover
              className={[
                "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                "ring-1 ring-slate-700",
                data.length === 0
                  ? "bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed" // estilo desabilitado
                  : showMore
                  ? "bg-emerald-600 text-white hover:bg-emerald-500"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700",
              ].join(" ")}
            >
              {/* "Report" icon (bar chart) */}
              <ChartBarIcon className="h-3 w-3" />
            </button>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="p-4 text-slate-400">
            No data -- Type the ids and click "Get Data"
          </div>
        ) : (
          <table className="w-full text-sm">
            {/* table header */}
            <thead className="text-slate-400 bg-slate-900/40">
              <tr className="text-left">
                <th className="p-3">Currency</th>
                <th>Price</th>
                <th>24h</th>
                {showMore && (
                  <>
                    {" "}
                    <th>1h</th> <th>7d</th>
                  </>
                )}
                <th>Updated</th>
                <th /> {/* coluna para o botão seta */}
              </tr>
            </thead>

            {/* table rows */}
            <tbody>
              {/* interate over the data and populate table */}
              {data.map((c) => {
                const change24h =
                  c.price_change_percentage_24h_in_currency ??
                  c.price_change_percentage_24h;
                const change1h = c.price_change_percentage_1h_in_currency;
                const change7d = c.price_change_percentage_7d_in_currency;

                return (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={c.image} alt={c.name} className="w-6 h-6" />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-slate-400">
                            {/*  make the currency abbreaviation under the name all upper case */}
                            {c.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {/* current currency price */}
                      {formatBRL(c.current_price)}
                    </td>
                    <td
                      className={
                        change24h != null && change24h >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {formatPercent(change24h)}
                    </td>

                    {showMore && (
                      <>
                        <td className={pctClass(change1h)}>
                          {formatPercent(change1h)}
                        </td>
                        <td className={pctClass(change7d)}>
                          {formatPercent(change7d)}
                        </td>
                      </>
                    )}

                    <td className="text-slate-400">
                      {c.last_updated
                        ? new Date(c.last_updated).toLocaleTimeString("pt-BR", {
                            hour12: false,
                          })
                        : "-"}
                    </td>
                    <td className="pr-3">
                      {/* botão para abrir popup */}
                      <button
                        onClick={() => openPopup(c)}
                        aria-label="Create alert"
                        className="h-7 w-7 rounded-full bg-slate-800 text-slate-300 ring-1 ring-slate-700 transition-colors hover:bg-slate-700 hover:text-white"
                      >
                        <ArrowRightCircleIcon className="h-4 w-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {popupCOin && (
        <NotificationPopup
          coin={popupCOin}
          onClose={() => setPopupCoin(null)}
          onConfirm={(opts) =>
            console.log("Alert created >>", { coin: popupCOin.id, ...opts })
          }
        />
      )}
    </main>
  );
}
