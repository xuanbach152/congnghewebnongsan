export function formatter(amount, locale = 'vi-VN', currency = 'VND') {
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 20 
  }).format(amount);
}
