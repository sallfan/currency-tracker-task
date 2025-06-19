const APP_ID = import.meta.env.VITE_APP_OPEN_EXCHANGE_APP_ID
const API_URL = import.meta.env.VITE_API_BASE_URL

export type GetCurrenciesResponse = Record<string, string>

export interface GetRatesResponse {
  base: string
  rates: Record<string, number>
}

export async function getCurrencies(): Promise<GetCurrenciesResponse> {
  const response = await fetch(`${API_URL}currencies.json`)
  return await response.json()
}

export async function getLatestRates(): Promise<GetRatesResponse> {
  const response = await fetch(`${API_URL}latest.json?app_id=${APP_ID}`)
  return await response.json()
}

export async function getHistoricalRates(date: string): Promise<GetRatesResponse> {
  const response = await fetch(`${API_URL}historical/${date}.json?app_id=${APP_ID}`)
  return await response.json()
}
