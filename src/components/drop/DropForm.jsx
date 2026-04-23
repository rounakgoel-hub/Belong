import { useState } from 'react'

const MEMORY_MAX = 150

export default function DropForm({ onSubmit, onCancel, loading }) {
  const [songName, setSongName] = useState('')
  const [artist, setArtist] = useState('')
  const [memory, setMemory] = useState('')
  const [handle, setHandle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ songName, artist, memory, handle })
  }

  const memLeft = MEMORY_MAX - memory.length

  return (
    <form onSubmit={handleSubmit} className="px-5 pb-8 pt-2 flex flex-col gap-4">
      <p className="text-muted text-xs uppercase tracking-widest mb-1">The song</p>

      <input
        type="text"
        value={songName}
        onChange={e => setSongName(e.target.value)}
        placeholder="Song name"
        className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none"
        style={{ border: '1px solid rgba(255,249,239,0.08)' }}
      />
      <input
        type="text"
        value={artist}
        onChange={e => setArtist(e.target.value)}
        placeholder="Artist"
        className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none"
        style={{ border: '1px solid rgba(255,249,239,0.08)' }}
      />

      <div className="relative">
        <textarea
          value={memory}
          onChange={e => { if (e.target.value.length <= MEMORY_MAX) setMemory(e.target.value) }}
          placeholder="It came back to me out of nowhere one day and I realised…"
          rows={4}
          className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none resize-none"
          style={{ border: '1px solid rgba(255,249,239,0.08)' }}
        />
        <span
          className="absolute bottom-3 right-4 text-xs pointer-events-none"
          style={{ color: memLeft < 20 ? '#E05A35' : '#8A7E78' }}
        >
          {memLeft} left to say it
        </span>
      </div>

      <input
        type="text"
        value={handle}
        onChange={e => setHandle(e.target.value)}
        placeholder="Or stay anonymous. The song speaks for you."
        className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none"
        style={{ border: '1px solid rgba(255,249,239,0.08)' }}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl text-cream font-bold text-base mt-1 transition-opacity"
        style={{ background: loading ? '#8A7E78' : '#B52900' }}
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
