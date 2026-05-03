// Search proxied through /api/search (Vercel serverless) to fix iOS ATS/CORS.
// Falls back to direct iTunes if the proxy is unreachable (e.g. local dev without Vite proxy).

const ITUNES_DIRECT = 'https://itunes.apple.com/search'

function mapResults(json) {
  return (json.results ?? []).map(track => ({
    song_name:        track.trackName,
    artist:           track.artistName,
    spotify_track_id: String(track.trackId),
    album_art_url:    track.artworkUrl100
      ? track.artworkUrl100.replace('100x100bb', '300x300bb')
      : null,
    preview_url: track.previewUrl ?? null,
  }))
}

export async function searchTracks(query) {
  if (!query.trim()) return []

  // Try proxy first (same-origin — fixes iOS ATS/CORS)
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`proxy ${res.status}`)
    const json = await res.json()
    return mapResults(json)
  } catch (err) {
    // Proxy unavailable — fall back to direct iTunes
    const params = new URLSearchParams({
      term: query, media: 'music', entity: 'song',
      limit: '8', country: 'in', lang: 'en_us',
    })
    const res = await fetch(`${ITUNES_DIRECT}?${params}`)
    if (!res.ok) throw new Error(`iTunes search failed — ${res.status}`)
    const json = await res.json()
    return mapResults(json)
  }
}
