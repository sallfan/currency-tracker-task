import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrencies, getLatestRates } from '@/services/currencies.service.ts'

interface Currency {
  code: string
  name: string
}

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref<Currency[]>([])
  const rates = ref<Record<string, number>>({})

  async function fetchCurrencies() {
    if (!currencies.value.length) {
      const data = await getCurrencies()
      currencies.value = Object.entries(data).map(([code, name]) => ({ code, name }))
    }
  }

  async function fetchRates() {
    const data = await getLatestRates()
    rates.value = data.rates
  }

  async function updateAll() {
    await Promise.all([fetchCurrencies(), fetchRates()])
  }

  return {
    currencies,
    rates,
    fetchCurrencies,
    fetchRates,
    updateAll,
  }
})
