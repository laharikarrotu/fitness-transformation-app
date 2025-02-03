// src/lib/utils/storage.ts
export function setLocalStorage<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }
  
  export function getLocalStorage<T>(key: string, defaultValue: T): T {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
      }
    }
    return defaultValue;
  }
  