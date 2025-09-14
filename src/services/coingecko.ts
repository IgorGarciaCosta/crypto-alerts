import currencyCodes from "currency-codes";

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h?: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  last_updated?: string;
};

//LOGICA PARA CAPTAR LISTA DE MOEDAS FIDUCIARUIAS SUPORTADAS PELA API

export async function getFiatVsCurrencies(): Promise<string[]> {
  // 1. Lista oficial de moedas fiduciárias ISO-4217
  const fiatSet = new Set(currencyCodes.codes().map(c => c.toLowerCase()));

  // 2. Lista de moedas suportadas pelo CoinGecko
  const vsCurrencies: string[] = await fetch(
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies"
  ).then(r => r.json());

  // 3. Mantém só as que são fiduciárias
  return vsCurrencies.filter(c => fiatSet.has(c));
}
//LOGICA PARA CAPTAR LISTA DE MOEDAS FIDUCIARUIAS SUPORTADAS PELA API - end



/**
 * Exporta diretamente um campo com as moedas fiduciárias suportadas.
 * Isso evita ter que chamar a função manualmente em cada lugar.
 */
export const fiatCurrencies:Promise<string[]> = getFiatVsCurrencies();


/**
 * Fetch market data in BRL for a list of CoinGecko ids.
 * - Uses a single request via ids=... to minimize roundtrips.
 * - Accepts AbortSignal to cancel in-flight requests.
 */

export async function fetchMarketsBRL(
  ids: string[],
  options?: { signal?: AbortSignal }
): Promise<MarketCoin[]> {
  if(!ids||ids.length===0){
    return[];
  }



  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "usd");
  if (ids.length) url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("price_change_percentage", "1h,24h,7d");
  url.searchParams.set("order", "market_cap_desc");
  // per_page is not strictly required when using ids, but keeping consistent
  // helps avoid pagination edge cases when mixing modes.
  url.searchParams.set("per_page", String(Math.max(ids.length, 2)));
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");

  const res = await fetch(url.toString(), { method: "GET", signal: options?.signal, });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoinGecko error: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
