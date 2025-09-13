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
  url.searchParams.set("vs_currency", "brl");
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
