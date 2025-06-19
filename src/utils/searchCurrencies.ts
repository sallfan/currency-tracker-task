import type { Currency } from '@/stores/currencyStore.ts'

export default function searchCurrencies(currencies: Currency[], keyword: string): Currency[] {
  if (!keyword) return currencies
  keyword = keyword.toLowerCase()
  return currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(keyword) ||
      currency.name.toLowerCase().includes(keyword),
  )
}
