import { useAppContext } from '../context/AppContext'

export function useInterest(toast) {
  const { interestCount: count, interested, registerInterest } = useAppContext()
  function register(message) { return registerInterest(toast, message) }
  return { count, interested, register }
}
