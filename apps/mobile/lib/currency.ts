export type CurrencyCode = "USD" | "EUR" | "GBP" | "INR" | "JPY" | "AUD" | "CAD" | "LKR";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen" },
  { code: "AUD", symbol: "$", label: "Australian Dollar" },
  { code: "CAD", symbol: "$", label: "Canadian Dollar" },
  { code: "LKR", symbol: "Rs", label: "Sri Lankan Rupee" },
];

const SYMBOL_BY_CODE = new Map(CURRENCIES.map((c) => [c.code, c.symbol]));

export function formatCurrency(
  amount: number,
  currencyCode: string,
  opts?: { decimals?: number }
): string {
  const symbol = SYMBOL_BY_CODE.get(currencyCode as CurrencyCode) ?? "$";
  const decimals = opts?.decimals ?? 2;
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbol}${formatted}`;
}
