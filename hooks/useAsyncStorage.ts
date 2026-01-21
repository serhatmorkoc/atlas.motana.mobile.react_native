import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook for AsyncStorage with automatic sync
 */
export function useAsyncStorage<T>(key: string, initialValue?: T) {
  const [value, setValue] = useState<T | null>(initialValue || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key} from AsyncStorage:`, error);
    } finally {
      setLoading(false);
    }
  };

  const updateValue = async (newValue: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(newValue));
      setValue(newValue);
    } catch (error) {
      console.error(`Error saving ${key} to AsyncStorage:`, error);
    }
  };

  const removeValue = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(null);
    } catch (error) {
      console.error(`Error removing ${key} from AsyncStorage:`, error);
    }
  };

  return {
    value,
    loading,
    setValue: updateValue,
    removeValue,
    refresh: loadValue,
  };
}

