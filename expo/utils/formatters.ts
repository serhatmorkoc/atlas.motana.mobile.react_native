/**
 * Utility functions for formatting data
 */

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: string = '₺'): string {
  return `${currency}${amount.toFixed(2)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(
  date: Date | string,
  locale: string = 'tr-TR',
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return dateObj.toLocaleDateString(locale, options || defaultOptions);
}

/**
 * Format distance (km to readable format)
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Format delivery time range
 */
export function formatDeliveryTime(timeRange: string): string {
  return `${timeRange} min`;
}

/**
 * Remove currency symbol and parse to number
 */
export function parsePrice(priceString: string): number {
  return parseFloat(priceString.replace(/[^\d.,]/g, '').replace(',', '.'));
}

/**
 * Format phone number
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }
  return phone;
}

