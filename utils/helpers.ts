/**
 * General helper functions
 */

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if value is empty
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Parse delivery time range to number
 */
export function parseDeliveryTime(timeRange: string): number {
  const match = timeRange.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Optimize Supabase storage image URL with transformation parameters
 */
export function optimizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  
  // Check if it's a Supabase storage URL (check for both render/image and object/public paths)
  const isSupabaseStorage = url.includes('supabase.co/storage/v1/');
  
  if (isSupabaseStorage) {
    // Check if optimization parameters already exist
    if (url.includes('width=') && url.includes('height=') && url.includes('quality=')) {
      // Already optimized, return as is
      return url;
    }
    
    // Remove existing query parameters if any to avoid duplicates
    const urlWithoutParams = url.split('?')[0];
    
    // Add transformation parameters (without timestamp to avoid constant re-renders)
    return `${urlWithoutParams}?width=400&height=300&quality=80&resize=cover`;
  }
  
  // Return original URL if it's not a Supabase storage URL
  return url;
}
