//convert and validate input text into an array

/**
 * Parse a comma-separated string into a sanitized list of CoinGecko ids.
 * - Trims whitespace
 * - Lowercases
 * - Removes duplicates
 * - Keeps only [a-z0-9-]
 */

export function parseCoinIds(raw: string): string[] {
  if (!raw) return [];

  // Split by comma, trim each entry, normalize to lowercase
  const parts = raw
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);

  // Sanitize: allow only a-z, 0-9 and hyphen
  const sanitized = parts.map((p) => p.replace(/[^a-z0-9-]/g, "")).filter(Boolean);

  // Deduplicate while preserving order
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const id of sanitized) {
    if (!seen.has(id)) {
      seen.add(id);
      unique.push(id);
    }
  }

  return unique;
}