export function addMonths(date: Date, months: number) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)

  if (d.getDate() !== date.getDate()) {
    d.setDate(0)
  }

  return d
}
