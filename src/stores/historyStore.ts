import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { v4 as uuid } from 'uuid'

interface ConversionRecord {
  id: string
  fromCurrency: string
  toCurrency: string
  amount: number
  result: number
  timestamp: number
}

export const useHistoryStore = defineStore('history', () => {
  const STORAGE_KEY = 'conversionHistory'

  const conversionHistory = ref<ConversionRecord[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'),
  )

  watch(
    conversionHistory,
    (updatedHistory) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory))
    },
    { deep: true },
  )

  /**
   * Добавляет новую запись о конвертации в историю.
   * @param record Детали конвертации (без id и timestamp, они будут добавлены автоматически).
   */
  function addConversion(record: Omit<ConversionRecord, 'id' | 'timestamp'>) {
    const newRecord: ConversionRecord = {
      id: uuid(),
      timestamp: Date.now(),
      ...record,
    }
    conversionHistory.value.push(newRecord)
  }

  /**
   * Очищает всю историю конвертаций.
   */
  function clearHistory() {
    conversionHistory.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    conversionHistory,
    addConversion,
    clearHistory,
  }
})
