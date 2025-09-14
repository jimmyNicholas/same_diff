export const localStorageUtils = {
    // Save any data to localStorage
    save: <T>(key: string, data: T): void => {
      if (typeof window === "undefined") return;
      
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error(`Error saving ${key} to localStorage:`, error);
      }
    },
  
    // Load data from localStorage with fallback
    load: <T>(key: string, fallback: T): T => {
      if (typeof window === "undefined") return fallback;
      
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch (error) {
        console.error(`Error loading ${key} from localStorage:`, error);
      }
      
      return fallback;
    },
  
    // Remove data from localStorage
    remove: (key: string): void => {
      if (typeof window === "undefined") return;
      
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing ${key} from localStorage:`, error);
      }
    },
  
    // Check if key exists in localStorage
    exists: (key: string): boolean => {
      if (typeof window === "undefined") return false;
      
      try {
        return localStorage.getItem(key) !== null;
      } catch (error) {
        console.error(`Error checking ${key} in localStorage:`, error);
        return false;
      }
    }
  };