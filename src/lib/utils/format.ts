// src/lib/utils/format.ts
export function formatNumber(num: number, options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
  } = {}): string {
    const { decimals = 0, prefix = '', suffix = '' } = options;
    
    const formatted = Number(num).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  
    return `${prefix}${formatted}${suffix}`;
  }
  
  export function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${minutes}m`;
    }
    
    return remainingMinutes === 0 
      ? `${hours}h` 
      : `${hours}h ${remainingMinutes}m`;
  }
  