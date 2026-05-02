import { useState, useEffect, useRef } from 'react'
import { searchTracks } from '../lib/spotify'

export function useSpotifySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)
  const timer = useRef(null)
  const abortRef = useRef(null)

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
    abortRef.current?.abort()

    let mounted = true

    timer.current = setTimeout(async () => {
      abortRef.current = new AbortController()
      try {
        const tracks = await searchTracks(query, abortRef.current.signal)
        if (mounted) setResults(tracks)
      } catch (err) {
        if (err.name === 'AbortError') return
        console.error('[Spotify search]', err.message)
        if (mounted) { setError(err.message); setResults([]) }
      } finally {
        if (mounted) setSearching(false)
      }
    }, 400)

    return () => {
      mounted = false
      clearTimeout(timer.current)
      abortRef.current?.abort()
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
