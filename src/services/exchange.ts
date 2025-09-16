export type Rates = Record<string, number>

/* Cache simples por “base” (USD, BRL, EUR…) */
const CACHE: Record<
  string,
  { at: number; rates: Rates }
> = {};

const TTL = 1000 * 60 * 60; // 1 h

/**
 * Retorna as cotações em relação a “base”.
 * Ex.: base="USD" → rates.BRL = 5.39
 */
export async function getRates(base: string): Promise<Rates> {
  const key = base.toUpperCase();
  const hit = CACHE[key];
  if (hit && Date.now() - hit.at < TTL) return hit.rates;

  const url = `https://open.er-api.com/v6/latest/${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("fx API error");
  const json = await res.json();
  if (json.result !== "success") throw new Error("fx API bad result");

  const rates: Rates = json.rates;
  CACHE[key] = { at: Date.now(), rates };
  return rates;
}

/**
 * Retorna apenas a cotação específica desejada.
 * Ex.: base="USD", to="BRL"  →  5.39
 */
export async function getRate(base: string, to: string): Promise<number> {
  const rates = await getRates(base);
  const rate = rates[to.toUpperCase()];
  if (!rate) throw new Error(`Rate ${base}->${to} not found`);
  return rate;
}