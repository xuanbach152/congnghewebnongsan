export function formatter(amount, locale = 'vi-VN', currency = 'VND') {
  const roundedAmount = Number(amount.toFixed(2)); 
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(roundedAmount);
}
