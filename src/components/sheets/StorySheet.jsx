import { useState, useEffect } from 'react'
import BottomSheet from './BottomSheet'
import Avatar from '../ui/Avatar'
import { useResonance } from '../../hooks/useResonance'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'

const COMMENT_MAX = 200

export default function StorySheet({ pin, open, onClose, toast }) {
  const [comments, setComments] = useState([])
  const [body, setBody] = useState('')
  const [handle, setHandle] = useState('')
  const [posting, setPosting] = useState(false)
  const { count, resonated, toggle } = useResonance(pin, toast)

  useEffect(() => {
    if (!pin || !open) return
    supabase
      .from('comments')
      .select('*')
      .eq('pin_id', pin.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => { if (data) setComments(data) })
  }, [pin?.id, open])

  async function postComment() {
    if (!body.trim()) return
    setPosting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert({ pin_id: pin.id, anon_id: getAnonId(), body: body.trim(), handle: handle.trim() || null })
      .select()
      .single()
    setPosting(false)
    if (!error && data) { setComments(prev => [...prev, data]); setBody('') }
  }

  if (!pin) return null

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="88vh">
      <div className="px-5 pb-8 pt-2">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar handle={pin.handle} size={44} />
          <div>
            <p className="text-cream font-semibold text-sm">{pin.handle || 'Anonymous'}</p>
            <p className="text-muted text-xs">Chennai · Dead Song Resurrection Project</p>
          </div>
        </div>

        {/* Song */}
        <h2 className="text-cream font-extrabold text-2xl leading-tight mb-1">{pin.song_name}</h2>
        {pin.artist && <p className="text-muted text-sm mb-4">{pin.artist}</p>}

        {/* Memory */}
        {pin.memory && (
          <div
            className="pl-4 mb-5 text-sm italic leading-relaxed"
            style={{ color: '#C4B8B2', borderLeft: '2px solid #B52900' }}
          >
            "{pin.memory}"
          </div>
        )}

        {/* Resonance */}
        <button
          onClick={toggle}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium mb-6 transition-all"
          style={{
            background: resonated ? 'rgba(181,41,0,0.15)' : 'rgba(255,249,239,0.05)',
            border: `1px solid ${resonated ? '#B52900' : 'rgba(255,249,239,0.1)'}`,
            color: resonated ? '#E05A35' : '#8A7E78',
          }}
        >
          <span>〰</span>
          <span>I remembered this</span>
          <span className="ml-1 opacity-60">· {count} remembered this</span>
        </button>

        {/* Comments */}
        <p className="text-muted text-xs uppercase tracking-widest mb-3">Memories of this song</p>

        {comments.length === 0 && (
          <p className="text-muted text-sm italic mb-4">No memories yet. Be the first.</p>
        )}

        <div className="flex flex-col gap-3 mb-5">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <Avatar handle={c.handle} size={28} />
              <div className="flex-1">
                <p className="text-xs text-muted mb-0.5">{c.handle || 'Anonymous'}</p>
                <p className="text-sm text-cream leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div className="relative">
          <textarea
            value={body}
            onChange={e => { if (e.target.value.length <= COMMENT_MAX) setBody(e.target.value) }}
            placeholder="This song for me was…"
            rows={3}
            className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none resize-none mb-2"
            style={{ border: '1px solid rgba(255,249,239,0.08)' }}
          />
          <input
            type="text"
            value={handle}
            onChange={e => setHandle(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none mb-3"
            style={{ border: '1px solid rgba(255,249,239,0.08)' }}
          />
          <button
            onClick={postComment}
            disabled={posting || !body.trim()}
            className="w-full py-3 rounded-xl text-cream text-sm font-bold transition-opacity"
            style={{ background: body.trim() ? '#B52900' : '#2E2825', opacity: posting ? 0.6 : 1 }}
          >
            {posting ? 'Leaving it here…' : 'Leave it here'}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
