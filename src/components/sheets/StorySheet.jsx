import { useState, useEffect, useRef } from 'react'
import BottomSheet from './BottomSheet'
import Avatar from '../ui/Avatar'
import { useResonance } from '../../hooks/useResonance'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'

const COMMENT_MAX = 200
const MEMORY_MAX = 150

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 3.5l10 5.5-10 5.5V3.5z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="4" y="3" width="3.5" height="12" rx="1" fill="currentColor" />
      <rect x="10.5" y="3" width="3.5" height="12" rx="1" fill="currentColor" />
    </svg>
  )
}

export default function StorySheet({ pin, open, onClose, toast }) {
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [commentHandle, setCommentHandle] = useState('')
  const [posting, setPosting] = useState(false)

  const [mode, setMode] = useState('view')
  const [editSong, setEditSong] = useState('')
  const [editArtist, setEditArtist] = useState('')
  const [editMemory, setEditMemory] = useState('')
  const [editHandle, setEditHandle] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentBody, setEditingCommentBody] = useState('')
  const [savingComment, setSavingComment] = useState(false)

  // ── Album art skeleton ──────────────────────────────────────
  // Reset whenever the pin changes so the skeleton shows for each new song.
  const [artLoaded, setArtLoaded] = useState(false)
  useEffect(() => { setArtLoaded(false) }, [pin?.id])

  // ── Audio ────────────────────────────────────────────────────
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  // Clean up when the sheet closes or switches pin.
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
        audioRef.current = null
        setPlaying(false)
      }
    }
  }, [pin?.id, open])

  // Autoplay — fires after the slide-up animation completes so the sheet is
  // already visible before any audio work begins.
  useEffect(() => {
    if (!open || !pin?.preview_url) return
    const t = setTimeout(() => {
      if (audioRef.current) return  // already playing from a previous trigger
      const audio = new Audio(pin.preview_url)
      audio.volume = 0.5
      audio.addEventListener('ended', () => setPlaying(false))
      audioRef.current = audio
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }, 300)
    return () => clearTimeout(t)
  }, [pin?.id, open])

  function togglePlay() {
    if (!pin?.preview_url) return
    if (audioRef.current) {
      if (playing) {
        audioRef.current.pause()
        setPlaying(false)
      } else {
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
      }
    } else {
      // First tap — create the Audio object lazily
      const audio = new Audio(pin.preview_url)
      audio.volume = 0.5
      audio.addEventListener('ended', () => setPlaying(false))
      audioRef.current = audio
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  // ── Comments + edit state — fetched after sheet is open ────
  const { count, resonated, toggle } = useResonance(pin, toast)
  const isOwn = pin?.anon_id === getAnonId()

  useEffect(() => {
    if (!pin || !open) return
    setComments([])
    setMode('view')
    setEditingCommentId(null)
    setEditingCommentBody('')
    setBody('')

    supabase
      .from('comments')
      .select('*')
      .eq('pin_id', pin.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setComments(data) })
  }, [pin?.id, open])

  function startEdit() {
    setEditSong(pin.song_name || '')
    setEditArtist(pin.artist || '')
    setEditMemory(pin.memory || '')
    setEditHandle(pin.handle || '')
    setMode('edit')
  }

  async function saveEdit() {
    if (!editSong.trim()) { toast('Name the dead song'); return }
    if (!editMemory.trim()) { toast('Tell us why it deserved better'); return }
    setSaving(true)
    const { error } = await supabase
      .from('pins')
      .update({ song_name: editSong.trim(), artist: editArtist.trim(), memory: editMemory.trim(), handle: editHandle.trim() || null })
      .eq('id', pin.id).eq('anon_id', getAnonId())
    setSaving(false)
    if (!error) { toast('Your pin has been updated.'); setMode('view') }
  }

  async function confirmDelete() {
    setDeleting(true)
    await supabase.from('comments').delete().eq('pin_id', pin.id)
    await supabase.from('resonances').delete().eq('pin_id', pin.id)
    await supabase.from('pins').delete().eq('id', pin.id).eq('anon_id', getAnonId())
    setDeleting(false)
    onClose()
    toast('Your song has been removed from the map.')
  }

  function startEditComment(c) { setEditingCommentId(c.id); setEditingCommentBody(c.body) }

  async function saveComment(id) {
    if (!editingCommentBody.trim()) return
    setSavingComment(true)
    const { error } = await supabase.from('comments')
      .update({ body: editingCommentBody.trim() })
      .eq('id', id).eq('anon_id', getAnonId())
    setSavingComment(false)
    if (!error) {
      setComments(prev => prev.map(c => c.id === id ? { ...c, body: editingCommentBody.trim() } : c))
      setEditingCommentId(null)
    }
  }

  async function deleteComment(id) {
    await supabase.from('comments').delete().eq('id', id).eq('anon_id', getAnonId())
    setComments(prev => prev.filter(c => c.id !== id))
    toast('Memory removed.')
  }

  async function postComment() {
    if (!body.trim()) return
    setPosting(true)
    const { data, error } = await supabase.from('comments')
      .insert({ pin_id: pin.id, anon_id: getAnonId(), body: body.trim(), handle: commentHandle.trim() || null })
      .select().single()
    setPosting(false)
    if (!error && data) { setComments(prev => [...prev, data]); setBody('') }
  }

  if (!pin) return null

  const inputStyle = {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  // ── Edit mode ────────────────────────────────────────────────
  if (mode === 'edit') {
    const memLeft = MEMORY_MAX - editMemory.length
    return (
      <BottomSheet open={open} onClose={() => setMode('view')} maxHeight="92vh">
        <div className="px-5 pb-8 pt-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-extrabold text-lg" style={{ color: 'var(--text)' }}>Edit your pin</h2>
            <button onClick={() => setMode('view')} className="text-sm" style={{ color: 'var(--muted)' }}>cancel</button>
          </div>
          <div className="flex flex-col gap-3">
            <input value={editSong} onChange={e => setEditSong(e.target.value)} placeholder="Song name"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle} />
            <input value={editArtist} onChange={e => setEditArtist(e.target.value)} placeholder="Artist"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle} />
            <div className="relative">
              <textarea value={editMemory}
                onChange={e => { if (e.target.value.length <= MEMORY_MAX) setEditMemory(e.target.value) }}
                placeholder="Your memory…" rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none"
                style={inputStyle} />
              <span className="absolute bottom-3 right-4 text-xs pointer-events-none"
                style={{ color: memLeft < 20 ? 'var(--red-l)' : 'var(--muted)' }}>
                {memLeft} left
              </span>
            </div>
            <input value={editHandle} onChange={e => setEditHandle(e.target.value)} placeholder="Name / handle (optional)"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none"
              style={inputStyle} />
          </div>
          <button onClick={saveEdit} disabled={saving}
            className="w-full py-4 rounded-2xl font-bold text-sm mt-5"
            style={{ background: saving ? 'var(--muted)' : 'var(--red)', color: 'var(--text)' }}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          <button onClick={() => setMode('confirmDelete')}
            className="w-full py-3 rounded-2xl text-sm mt-2"
            style={{ color: 'var(--red-l)', border: '1px solid rgba(224,90,53,0.25)' }}>
            Remove this pin
          </button>
        </div>
      </BottomSheet>
    )
  }

  // ── Confirm delete ───────────────────────────────────────────
  if (mode === 'confirmDelete') {
    return (
      <BottomSheet open={open} onClose={() => setMode('view')} maxHeight="50vh">
        <div className="px-5 pb-10 pt-4 text-center">
          <p className="font-extrabold text-lg mb-2" style={{ color: 'var(--text)' }}>Remove this pin?</p>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--muted)' }}>
            "{pin.song_name}" will be removed from the map. This can't be undone.
          </p>
          <button onClick={confirmDelete} disabled={deleting}
            className="w-full py-4 rounded-2xl font-bold text-sm mb-3"
            style={{ background: 'var(--red)', color: 'var(--text)' }}>
            {deleting ? 'Removing…' : 'Yes, remove it'}
          </button>
          <button onClick={() => setMode('view')}
            className="w-full py-3 rounded-2xl text-sm"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
            Keep it on the map
          </button>
        </div>
      </BottomSheet>
    )
  }

  // ── View mode ────────────────────────────────────────────────
  // Renders immediately with whatever pin data is in memory.
  // Album art loads asynchronously behind the skeleton.
  // Audio is never created until the user taps play.
  const hasArt = !!pin.album_art_url
  const hasAudio = !!pin.preview_url

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="92vh">

      {/* ── Album art banner with skeleton ───────────────────── */}
      <div className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: hasArt ? 220 : 0 }}>
        {hasArt && (
          <>
            {/* Skeleton — pulsing surface placeholder, fades out once art loads */}
            {!artLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ background: 'var(--surface2)' }}
              />
            )}

            <img
              src={pin.album_art_url}
              alt={pin.song_name}
              className="w-full h-full object-cover"
              style={{ opacity: artLoaded ? 1 : 0, transition: 'opacity 0.25s ease' }}
              onLoad={() => setArtLoaded(true)}
            />

            {/* Gradient — over art, always rendered so text is readable during load */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.82) 100%)' }}
            />

            {/* Song name + artist — render immediately, no waiting for image */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pr-16">
              <p className="font-extrabold text-lg leading-tight" style={{ color: '#FFF9EF' }}>{pin.song_name}</p>
              {pin.artist && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,249,239,0.7)' }}>{pin.artist}</p>}
            </div>

            {/* Play button */}
            {hasAudio && (
              <button
                onClick={togglePlay}
                className="absolute bottom-3 right-4 w-11 h-11 rounded-full flex items-center justify-center"
                style={{
                  background: playing ? 'rgba(181,41,0,0.85)' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFF9EF',
                }}
                aria-label={playing ? 'Pause preview' : 'Play preview'}
              >
                {playing ? <PauseIcon /> : <PlayIcon />}
              </button>
            )}
          </>
        )}
      </div>

      {/* ── Sheet body — all text data renders immediately ───── */}
      <div className="px-5 pb-8" style={{ paddingTop: hasArt ? 12 : 8 }}>

        {/* Contributor row */}
        <div className="flex items-center justify-between mb-4">
          {hasArt ? (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>Chennai · The Recall Room</p>
          ) : (
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar handle={pin.handle} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-base leading-tight truncate" style={{ color: 'var(--text)' }}>{pin.song_name}</p>
                {pin.artist && <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>{pin.artist}</p>}
                <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Chennai · The Recall Room</p>
              </div>

              {/* Play button for pins without art */}
              {hasAudio && (
                <button
                  onClick={togglePlay}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: playing ? 'rgba(181,41,0,0.12)' : 'var(--surface2)',
                    border: `1px solid ${playing ? 'var(--red)' : 'var(--border)'}`,
                    color: playing ? 'var(--red)' : 'var(--muted)',
                  }}
                  aria-label={playing ? 'Pause preview' : 'Play preview'}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
              )}
            </div>
          )}
          {isOwn && (
            <button
              onClick={startEdit}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ml-3"
              style={{ background: 'var(--surface2)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              Edit
            </button>
          )}
        </div>

        {/* Memory */}
        {pin.memory && (
          <div className="pl-4 mb-5 text-sm italic leading-relaxed"
            style={{ color: 'var(--muted)', borderLeft: '2px solid var(--red)' }}>
            "{pin.memory}"
          </div>
        )}

        {/* Resonance */}
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-6 transition-all"
          style={{
            background: resonated ? 'rgba(181,41,0,0.12)' : 'var(--surface2)',
            border: `1px solid ${resonated ? 'var(--red)' : 'var(--border)'}`,
            color: resonated ? 'var(--red-l)' : 'var(--muted)',
          }}
        >
          <span>〰</span>
          <span>I know this feeling</span>
          <span className="ml-1 opacity-60">· {count} felt this</span>
        </button>

        {/* Comments header */}
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
          More memories of this song
        </p>

        {comments.length === 0 && (
          <p className="text-sm italic mb-4" style={{ color: 'var(--muted)' }}>No memories yet. Be the first.</p>
        )}

        <div className="flex flex-col gap-4 mb-5">
          {comments.map(c => {
            const isMyComment = c.anon_id === getAnonId()
            const isEditing = editingCommentId === c.id
            return (
              <div key={c.id} className="flex gap-3">
                <Avatar handle={c.handle} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>{c.handle || 'Anonymous'}</p>
                    {isMyComment && !isEditing && (
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => startEditComment(c)} className="text-xs" style={{ color: 'var(--muted)' }}>Edit</button>
                        <button onClick={() => deleteComment(c.id)} className="text-xs" style={{ color: 'var(--red-l)' }}>Remove</button>
                      </div>
                    )}
                  </div>
                  {isEditing ? (
                    <div>
                      <textarea value={editingCommentBody}
                        onChange={e => { if (e.target.value.length <= COMMENT_MAX) setEditingCommentBody(e.target.value) }}
                        rows={3} autoFocus
                        className="w-full rounded-xl px-3 py-2 text-sm outline-none resize-none mb-2"
                        style={{ ...inputStyle, border: '1px solid rgba(181,41,0,0.4)' }} />
                      <div className="flex gap-2">
                        <button onClick={() => saveComment(c.id)} disabled={savingComment}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ background: 'var(--red)', color: 'var(--text)' }}>
                          {savingComment ? 'Saving…' : 'Save'}
                        </button>
                        <button onClick={() => setEditingCommentId(null)}
                          className="px-3 py-1.5 rounded-lg text-xs"
                          style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{c.body}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Comment input */}
        <div>
          <textarea value={body}
            onChange={e => { if (e.target.value.length <= COMMENT_MAX) setBody(e.target.value) }}
            placeholder="This song for me was…" rows={3}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-2"
            style={inputStyle} />
          <input type="text" value={commentHandle} onChange={e => setCommentHandle(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-3"
            style={inputStyle} />
          <button onClick={postComment} disabled={posting || !body.trim()}
            className="w-full py-3 rounded-xl text-sm font-bold"
            style={{
              background: body.trim() ? 'var(--red)' : 'var(--surface2)',
              color: body.trim() ? 'var(--text)' : 'var(--muted)',
              opacity: posting ? 0.6 : 1,
            }}>
            {posting ? 'Leaving it here…' : 'Leave it here'}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
