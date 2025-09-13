import { useState } from "react";
import { fetchMarketsBRL } from "../services/coingecko";

export function Home() {
  const [loading, setLoading] = useState(false);

  async function handleGetData() {
    try {
      setLoading(true);
      // Exemplo: bitcoin e ethereum
      const data = await fetchMarketsBRL(["bitcoin", "ethereum"]);
      console.log("CoinGecko data:", data);
      // Neste começo, só logamos. Depois renderizamos na UI.
    } catch (err) {
      console.error("Erro ao buscar CoinGecko:", err);
      alert("Falha ao buscar dados. Veja o console para detalhes.");
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
      <button
        onClick={handleGetData}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded bg-emerald-600 px-4 py-2 font-medium hover:bg-emerald-500 disabled:opacity-60"
      >
        {loading ? "Carregando..." : "Get Data"}
      </button>
    </main>
  );
}
