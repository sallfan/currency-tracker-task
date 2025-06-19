import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrencies, getLatestRates } from '@/services/currencyService.ts'

export interface Currency {
  code: string
  name: string
  rate: number
}

export const useCurrencyStore = defineStore('currency', () => {
  const ratesBase = ref<string>();
  const currencies = ref<Currency[]>([]);
  const isLoading = ref<boolean>(false);
  const isFailed = ref<boolean>(false);

  async function fetchCurrencies() {
      try {
        isLoading.value = true

        const [ratesData, namesData] = await Promise.all([getLatestRates(), getCurrencies()])

        ratesBase.value = ratesData.base

        const rates = ratesData.rates
        currencies.value = Object.entries(namesData)
          .filter(([code, name]) => {
            const rate = rates[code]
            return rate != null && rate !== 0 && name != null && name !== ''
          })
          .map(([code, name]) => ({
            code,
            name,
            rate: rates[code],
          }))

        isLoading.value = false
      } catch (error) {
        console.error(error)
        isFailed.value = true
      }
    }

  return {
    currencies,
    ratesBase,
    isLoading,
    isFailed,
    fetchCurrencies,
  }
})
