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

    timer.current = setTimeout(async () => {
      try {
        const tracks = await searchTracks(query)
        setResults(tracks)
      } catch (err) {
        console.error('[Spotify search]', err.message)
        setError(err.message)
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(timer.current)
  }, [query])

  function clear() {
    setQuery('')
    setResults([])
    setSearching(false)
    setError(null)
  }

  return { query, setQuery, results, searching, error, clear }
}
