import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getLastDates, isToday } from '@/utils/dateUtils.ts'
import { getHistoricalRates } from '@/services/currencyService'

export interface HistoricalRate {
  date: string
  rate: number
}

interface CachedRates {
  timestamp: number
  rates: Record<string, number>
}

export const useHistoricalRatesStore = defineStore('historicalRates', () => {
  const currencyCode = ref<string>()
  const historicalRates = ref<HistoricalRate[]>([])
  const isLoading = ref<boolean>(false)
  const isFailed = ref<boolean>(false)

  const STORAGE_KEY = 'historicalRatesCache'

  function loadFromStorage(code: string): CachedRates | null {
    const cache = localStorage.getItem(STORAGE_KEY)
    if (!cache) return null
    const parsed: Record<string, CachedRates> = JSON.parse(cache)
    return parsed[code] ?? null
  }

  function saveToStorage(code: string, data: CachedRates) {
    const cache = localStorage.getItem(STORAGE_KEY)
    if (!cache) return null
    const parsed: Record<string, CachedRates> = JSON.parse(cache)
    parsed[code] = data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed))
  }

  async function fetchHistoricalRates() {
    if (!currencyCode.value) return

    try {
      isLoading.value = true
      const dates = getLastDates(7)

      const cached = loadFromStorage(currencyCode.value)
      if (cached && isToday(cached.timestamp)) {
        historicalRates.value = dates.map((date) => ({
          date,
          rate: cached.rates[date] ?? NaN,
        }))
        isLoading.value = false
        return
      }

      const ratesByDate: Record<string, number> = {}
      const result: HistoricalRate[] = []

      for (const date of dates) {
        const data = await getHistoricalRates(date)
        ratesByDate[date] = data.rates[currencyCode.value] ?? NaN

        result.push({ date, rate: ratesByDate[date] })
      }

      historicalRates.value = result
      isLoading.value = false

      saveToStorage(currencyCode.value, {
        timestamp: Date.now(),
        rates: ratesByDate,
      })
    } catch (error) {
      console.error(error)
      isFailed.value = true
    }
  }

  watch(currencyCode, () => {
    if (currencyCode.value) {
      fetchHistoricalRates()
    } else {
      historicalRates.value = []
    }
  })

  return {
    currencyCode,
    historicalRates,
    isLoading,
    isFailed,
    fetchHistoricalRates,
  }
})
