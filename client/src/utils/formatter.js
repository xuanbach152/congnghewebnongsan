export function formatter(amount, locale = 'vi-VN', currency = 'VND') {
  const roundedAmount = Number(amount.toFixed(2)); 
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(roundedAmount);
}

export function formatDateTimeVN(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Ho_Chi_Minh',
  }).format(date);
}