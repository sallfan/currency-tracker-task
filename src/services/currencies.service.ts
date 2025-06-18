const BASE_URL = 'https://openexchangerates.org/api/'
const APP_ID = import.meta.env.VITE_APP_OPEN_EXCHANGE_APP_ID

interface LatestRatesResponse {
  base: string
  rates: Record<string, number>
}

export async function getLatestRates(): Promise<LatestRatesResponse> {
  try {
    const response = await fetch(`${BASE_URL}latest.json?app_id=${APP_ID}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch rates:', error)
    throw error
  }
}

export async function getHistoricalRates(date: string): Promise<LatestRatesResponse> {
  const response = await fetch(`${BASE_URL}historical/${date}.json?app_id=${APP_ID}`)
  if (!response.ok) throw new Error('Failed to fetch historical rates')
  return await response.json()
}

export async function getCurrencies(): Promise<Record<string, string>> {
  const response = await fetch(`${BASE_URL}currencies.json`)
  if (!response.ok) throw new Error('Failed to fetch currencies list')
  return await response.json()
}
