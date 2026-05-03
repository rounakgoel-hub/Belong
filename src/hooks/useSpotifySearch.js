import { useState, useEffect, useRef } from 'react'
import { searchTracks } from '../lib/spotify'

export function useSpotifySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setSearching(false)
      setError(null)
      return
    }

    setError(null)
    setSearching(true)
    clearTimeout(timer.current)

    let mounted = true

    timer.current = setTimeout(async () => {
      try {
        const tracks = await searchTracks(query)
        if (mounted) setResults(tracks)
      } catch (err) {
        console.error('[search]', err.message)
        if (mounted) { setError(err.message); setResults([]) }
      } finally {
        if (mounted) setSearching(false)
      }
    }, 400)

    return () => {
      mounted = false
      clearTimeout(timer.current)
    }
  }, [query])

  function clear() {
    setQuery('')
    setResults([])
    setSearching(false)
    setError(null)
  }

  return { query, setQuery, results, searching, error, clear }
}
