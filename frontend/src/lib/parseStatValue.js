// Splits an admin-entered stat string like "25,000+" or "4.8★" into a
// numeric part (for count-up animations) and a trailing suffix to render as-is.
export function parseStatValue(raw) {
  const str = String(raw ?? "").replace(/,/g, "");
  const match = str.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, suffix: str, decimal: false };
  return { num: parseFloat(match[1]), suffix: match[2], decimal: match[1].includes(".") };
}
