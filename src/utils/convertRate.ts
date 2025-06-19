import type { Currency } from '@/stores/currencyStore'

export function convertRate(
  amount: number,
  fromCurrency: Currency | undefined,
  toCurrency: Currency | undefined,
): number | null {
  if (amount > 0 && fromCurrency?.rate && toCurrency?.rate) {
    return (amount / fromCurrency.rate) * toCurrency.rate
  }
  return null
}
