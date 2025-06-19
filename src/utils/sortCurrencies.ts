import type { Currency } from '@/stores/currencyStore.ts'

export type SortOrder = 'name-asc' | 'name-desc' | 'rate-asc' | 'rate-desc'

export const sortOptions: { title: string; value: SortOrder }[] = [
  { title: 'Name (A → Z)', value: 'name-asc' },
  { title: 'Name (Z → A)', value: 'name-desc' },
  { title: 'Rate (Low → High)', value: 'rate-asc' },
  { title: 'Rate (High → Low)', value: 'rate-desc' },
]

export function sortCurrencies(currencies: Currency[], sortBy: SortOrder): Currency[] {
  return [...currencies].sort((a, b) => {
    switch (sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      case 'rate-asc':
        return a.rate - b.rate
      case 'rate-desc':
        return b.rate - a.rate
      default:
        return 0
    }
  })
}
