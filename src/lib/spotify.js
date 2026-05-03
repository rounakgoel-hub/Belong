// All searches go through /api/search (Vercel serverless / Vite proxy).
// This avoids iOS WebKit blocking direct cross-origin requests to apple.com domains.

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
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
  if (!res.ok) throw new Error(`search ${res.status}`)
  const json = await res.json()
  return mapResults(json)
}
