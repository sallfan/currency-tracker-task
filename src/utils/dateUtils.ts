export function isToday(timestamp: number): boolean {
  const savedDate = new Date(timestamp)
  const now = new Date()
  return (
    savedDate.getFullYear() === now.getFullYear() &&
    savedDate.getMonth() === now.getMonth() &&
    savedDate.getDate() === now.getDate()
  )
}

export function getLastDates(byDays: number): string[] {
  const dates: string[] = []
  const today = new Date()
  for (let i = byDays--; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}
