export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  last_updated?: string;
};

export async function fetchMarketsBRL(ids: string[]): Promise<MarketCoin[]> {
  const url = new URL("https://api.coingecko.com/api/v3/coins/markets");
  url.searchParams.set("vs_currency", "brl");
  if (ids.length) url.searchParams.set("ids", ids.join(","));
  url.searchParams.set("price_change_percentage", "1h,24h,7d");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(Math.max(ids.length, 2))); // só pra garantir retorno
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");

  const res = await fetch(url.toString(), { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CoinGecko error: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}