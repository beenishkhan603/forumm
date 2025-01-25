import { useEffect, useState } from 'react'

type SetValueInput<T> = T | ((arg0: T) => T)
type UseLocalStorageReturn<T> = [T, (arg0: SetValueInput<T>) => void]

export default function useLocalStorage<T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value: SetValueInput<T>) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        } catch {
          window.localStorage.setItem(key, valueToStore as string)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
