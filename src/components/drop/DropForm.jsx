import { useState } from 'react'
import { useSpotifySearch } from '../../hooks/useSpotifySearch'

const MEMORY_MAX = 150

export default function DropForm({ onSubmit, onCancel, loading }) {
  const { query, setQuery, results, searching, error, clear } = useSpotifySearch()
  const [selected, setSelected] = useState(null)
  const [memory, setMemory] = useState('')
  const [handle, setHandle] = useState('')

  function pickTrack(track) {
    setSelected(track)
    clear()
  }

  function clearSelection() {
    setSelected(null)
    clear()
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Allow submission even without a Spotify match — use typed query as fallback
    onSubmit({
      songName: selected?.song_name ?? query.trim(),
      artist: selected?.artist ?? '',
      memory,
      handle,
      spotify_track_id: selected?.spotify_track_id ?? null,
      album_art_url: selected?.album_art_url ?? null,
      preview_url: selected?.preview_url ?? null,
    })
  }

  const memLeft = MEMORY_MAX - memory.length
  const showResults = !selected && results.length > 0
  const showEmpty = !selected && !searching && !error && query.length > 1 && results.length === 0

  return (
    <form onSubmit={handleSubmit} className="px-5 pb-8 pt-2 flex flex-col gap-4">
      <p className="text-muted text-xs uppercase tracking-widest">The song</p>

      {/* ── Selected track card ─────────────────────────────── */}
      {selected ? (
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.1)' }}
        >
          {selected.album_art_url ? (
            <img
              src={selected.album_art_url}
              alt={selected.song_name}
              className="w-12 h-12 rounded-lg flex-shrink-0 object-cover"
            />
          ) : (
            <div
              className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-xl"
              style={{ background: '#1A1614', color: '#8A7E78' }}
            >
              ♪
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-cream font-semibold text-sm leading-tight truncate">{selected.song_name}</p>
            <p className="text-muted text-xs truncate mt-0.5">{selected.artist}</p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-muted text-base"
            style={{ background: 'rgba(255,249,239,0.06)' }}
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      ) : (
        /* ── Search input + results ─────────────────────────── */
        <div className="flex flex-col gap-2">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search Spotify for the song…"
              autoComplete="off"
              className="w-full rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none pr-10"
              style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.08)' }}
            />
            {/* Spinner / clear */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {searching ? (
                <div className="w-4 h-4 rounded-full border-2 border-t-cream border-muted animate-spin" />
              ) : query ? (
                <button
                  type="button"
                  onClick={clear}
                  className="text-muted text-lg leading-none"
                  aria-label="Clear search"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>

          {/* Results — rendered inline so the drawer scroll handles overflow naturally */}
          {showResults && (
            <div
              className="rounded-xl overflow-hidden"
              style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.08)' }}
            >
              {results.map((track, i) => (
                <button
                  key={track.spotify_track_id}
                  type="button"
                  onClick={() => pickTrack(track)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-surface"
                  style={{ borderTop: i > 0 ? '1px solid rgba(255,249,239,0.05)' : 'none' }}
                >
                  {track.album_art_url ? (
                    <img
                      src={track.album_art_url}
                      alt=""
                      className="w-10 h-10 rounded-md flex-shrink-0 object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-md flex-shrink-0 flex items-center justify-center text-lg"
                      style={{ background: '#1A1614', color: '#8A7E78' }}
                    >
                      ♪
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm font-medium leading-tight truncate">{track.song_name}</p>
                    <p className="text-muted text-xs truncate mt-0.5">{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showEmpty && (
            <p className="text-xs px-1" style={{ color: '#5C524E' }}>
              No results — you can still submit without a Spotify match.
            </p>
          )}

          {error && (
            <p className="text-xs px-1 leading-relaxed" style={{ color: '#5C524E' }}>
              Search unavailable — you can still type the song name and submit.
            </p>
          )}
        </div>
      )}

      {/* ── Memory ─────────────────────────────────────────── */}
      <div className="relative">
        <textarea
          value={memory}
          onChange={e => { if (e.target.value.length <= MEMORY_MAX) setMemory(e.target.value) }}
          placeholder="It came back to me out of nowhere one day and I realised…"
          rows={4}
          className="w-full rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none resize-none"
          style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.08)' }}
        />
        <span
          className="absolute bottom-3 right-4 text-xs pointer-events-none"
          style={{ color: memLeft < 20 ? '#E05A35' : '#8A7E78' }}
        >
          {memLeft} left to say it
        </span>
      </div>

      {/* ── Handle ─────────────────────────────────────────── */}
      <input
        type="text"
        value={handle}
        onChange={e => setHandle(e.target.value)}
        placeholder="Or stay anonymous. The song speaks for you."
        className="w-full rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none"
        style={{ background: '#2E2825', border: '1px solid rgba(255,249,239,0.08)' }}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl text-cream font-bold text-base mt-1"
        style={{ background: loading ? '#5C524E' : '#B52900' }}
      >
        {loading ? 'Bringing it back…' : 'Bring it back'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full py-3 rounded-2xl text-muted text-sm font-medium"
        style={{ border: '1px solid rgba(255,249,239,0.08)' }}
      >
        Cancel
      </button>
    </form>
  )
}
