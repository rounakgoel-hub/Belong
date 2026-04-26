import { useState } from 'react'
import { useSpotifySearch } from '../../hooks/useSpotifySearch'

const MEMORY_MAX = 150

const inputStyle = {
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
}

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
      <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--muted)' }}>The song</p>

      {/* ── Selected track card ─────────────────────────────── */}
      {selected ? (
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
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
              style={{ background: 'var(--bg)', color: 'var(--muted)' }}
            >
              ♪
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'var(--text)' }}>{selected.song_name}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>{selected.artist}</p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-base"
            style={{ background: 'var(--surface)', color: 'var(--muted)' }}
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
              className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-10"
              style={inputStyle}
            />
            {/* Spinner / clear */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {searching ? (
                <div className="w-4 h-4 rounded-full border-2 animate-spin" style={{ borderTopColor: 'var(--text)', borderColor: 'var(--border)' }} />
              ) : query ? (
                <button
                  type="button"
                  onClick={clear}
                  className="text-lg leading-none"
                  style={{ color: 'var(--muted)' }}
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
              style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              {results.map((track, i) => (
                <button
                  key={track.spotify_track_id}
                  type="button"
                  onClick={() => pickTrack(track)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-surface"
                  style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}
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
                      style={{ background: 'var(--bg)', color: 'var(--muted)' }}
                    >
                      ♪
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate" style={{ color: 'var(--text)' }}>{track.song_name}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: 'var(--muted)' }}>{track.artist}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {showEmpty && (
            <p className="text-xs px-1" style={{ color: 'var(--muted)' }}>
              No results — you can still submit without a Spotify match.
            </p>
          )}

          {error && (
            <p className="text-xs px-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
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
          className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
          style={inputStyle}
        />
        <span
          className="absolute bottom-3 right-4 text-xs pointer-events-none"
          style={{ color: memLeft < 20 ? 'var(--red-l)' : 'var(--muted)' }}
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
        className="w-full rounded-xl px-4 py-3 text-sm outline-none"
        style={inputStyle}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl font-bold text-base mt-1"
        style={{
          background: loading ? 'var(--surface2)' : 'var(--red)',
          color: loading ? 'var(--muted)' : 'var(--text)',
        }}
      >
        {loading ? 'Bringing it back…' : 'Bring it back'}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="w-full py-3 rounded-2xl text-sm font-medium"
        style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
      >
        Cancel
      </button>
    </form>
  )
}
