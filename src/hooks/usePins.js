// Thin delegate — all pin state and the single realtime channel live in AppContext.
// Components call usePins() as before; no duplicate subscriptions or split state.
import { useAppContext } from '../context/AppContext'

export function usePins() {
  const { pins, pinsLoading } = useAppContext()
  return { pins, loading: pinsLoading }
}
