import { useState } from "react";
import { fetchMarketsBRL, type MarketCoin } from "../services/coingecko";
import { formatBRL, formatPercent } from "../utils/format";

export function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MarketCoin[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleGetData() {
    try {
      setError(null);
      setLoading(true);
      const res = await fetchMarketsBRL(["bitcoin", "ethereum", "ripple"]);
      setData(res);
      console.log("CoinGecko data:", data);
      // Neste começo, só logamos. Depois renderizamos na UI.
    } catch (err) {
      console.error("Erro ao buscar CoinGecko:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Falha ao buscar dados";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">CriptoTracker</h1>
      <p className="text-slate-300 mb-6">
        Clique no botão abaixo para buscar dados do CoinGecko e ver o resultado
        no console.
      </p>
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={handleGetData}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Carregando..." : "Get Data"}
        </button>
        {error && <span className="text-rose-400 text-sm">{error}</span>}
      </div>
      <div className="rounded-lg border border-slate-800 overflow-hidden">
        <div className="p-3 border-b border-slate-800">
          <h2 className="font-medium">Resultado</h2>
        </div>

        {data.length === 0 ? (
          <div className="p-4 text-slate-400">
            Sem dados ainda — clique em “Get Data”.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-slate-400 bg-slate-900/40">
              <tr className="text-left">
                <th className="p-3">Moeda</th>
                <th>Preço</th>
                <th>24h</th>
                <th>Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => {
                const change24h =
                  c.price_change_percentage_24h_in_currency ??
                  c.price_change_percentage_24h;

                return (
                  <tr key={c.id} className="border-t border-slate-800">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img src={c.image} alt={c.name} className="w-6 h-6" />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-slate-400">
                            {c.symbol.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{formatBRL(c.current_price)}</td>
                    <td
                      className={
                        change24h != null && change24h >= 0
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }
                    >
                      {formatPercent(change24h)}
                    </td>
                    <td className="text-slate-400">
                      {c.last_updated
                        ? new Date(c.last_updated).toLocaleTimeString("pt-BR", {
                            hour12: false,
                          })
                        : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
