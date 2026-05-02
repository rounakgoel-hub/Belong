// Music search via iTunes Search API — free, no auth, CORS-enabled.
// Spotify Client Credentials now require the app owner to hold Premium,
// so we use iTunes as the search backend. Preview URLs and album art
// come from Apple's CDN; track IDs are iTunes IDs stored in spotify_track_id.
// (Spotify playlist integration in Phase 2 will match by title+artist.)

const ITUNES_BASE = 'https://itunes.apple.com/search'

export async function searchTracks(query, signal) {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    term: query,
    media: 'music',
    entity: 'song',
    limit: '6',
    country: 'in',       // prioritise Indian catalogue
    lang: 'en_us',
  })

  const res = await fetch(`${ITUNES_BASE}?${params}`, { signal })

  if (!res.ok) {
    throw new Error(`iTunes search failed — ${res.status}`)
  }

  const json = await res.json()

  return (json.results ?? []).map(track => ({
    song_name: track.trackName,
    artist: track.artistName,
    // iTunes trackId is a number — store as string to fit the text column
    spotify_track_id: String(track.trackId),
    // Replace 100x100 thumbnail with 300x300 for better quality
    album_art_url: track.artworkUrl100
      ? track.artworkUrl100.replace('100x100bb', '300x300bb')
      : null,
    preview_url: track.previewUrl ?? null,
  }))
}
