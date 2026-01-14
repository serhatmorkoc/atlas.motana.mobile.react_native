/**
 * Validation utility functions
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Turkish format)
 */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, '');
  return /^[0-9]{10,11}$/.test(cleaned);
}

/**
 * Validate password (min 8 characters)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate Turkish ID number (TC Kimlik No)
 */
export function isValidTurkishId(id: string): boolean {
  if (id.length !== 11) return false;
  if (!/^\d+$/.test(id)) return false;
  
  const digits = id.split('').map(Number);
  const sum1 = digits.slice(0, 10).reduce((sum, digit, index) => {
    return sum + (index % 2 === 0 ? digit : 0);
  }, 0);
  const sum2 = digits.slice(0, 10).reduce((sum, digit, index) => {
    return sum + (index % 2 === 1 ? digit : 0);
  }, 0);
  
  const check1 = (sum1 * 7 - sum2) % 10;
  const check2 = (sum1 + sum2 + check1) % 10;
  
  return check1 === digits[9] && check2 === digits[10];
}

