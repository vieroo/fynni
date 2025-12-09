export function getBillingPeriod(closingDay: number, refDate = new Date()) {
  const year = refDate.getFullYear()
  const month = refDate.getMonth()

  const closing = new Date(year, month, closingDay)

  let start
  let end

  // Se o fechamento ainda nao conteceu esse mes -> ciclo atual comecou mes passado
  if (refDate <= closing) {
    start = new Date(year, month - 1, closingDay + 1)
    end = new Date(year, month, closingDay)
  } else {
    // ja passou do fechamento -> ciclo atual comecou esse mes
    start = new Date(year, month, closingDay + 1)
    end = new Date(year, month + 1, closingDay)
  }

  return { start, end }
}
