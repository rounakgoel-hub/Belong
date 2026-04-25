import { useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'
import { EDITION_ID } from '../../lib/constants'
import { useDragToDismiss } from '../../hooks/useDragToDismiss'
import DropForm from './DropForm'
import PostSubmission from './PostSubmission'

// step: 'placing' | 'form' | 'done'
export default function DropDrawer({
  step, position, onClose, onSubmitted,
  onOpenWaitlist, totalPins, toast
}) {
  const [loading, setLoading] = useState(false)
  const [newPin, setNewPin] = useState(null)
  const scrollRef = useRef(null)
  const { sheetHandlers, sheetStyle } = useDragToDismiss(onClose, scrollRef)

  async function handleSubmit({ songName, artist, memory, handle, spotify_track_id, album_art_url, preview_url }) {
    if (!songName.trim()) { toast('Name the dead song'); return }
    if (!memory.trim()) { toast('Tell us why it deserved better'); return }
    if (!position) { toast('Tap the map to drop your pin first'); return }

    const { data: existing } = await supabase
      .from('pins')
      .select('id')
      .ilike('song_name', songName.trim())
      .eq('edition_id', EDITION_ID)
      .limit(1)

    if (existing?.length) {
      toast('Someone else feels this too. Want to add your memory of it?')
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('pins')
      .insert({
        edition_id: EDITION_ID,
        lat: position.lat,
        lng: position.lng,
        song_name: songName.trim(),
        artist: artist.trim(),
        memory: memory.trim(),
        handle: handle.trim() || null,
        anon_id: getAnonId(),
        spotify_track_id: spotify_track_id ?? null,
        album_art_url: album_art_url ?? null,
        preview_url: preview_url ?? null,
      })
      .select()
      .single()

    setLoading(false)
    if (!error && data) {
      setNewPin(data)
      onSubmitted(data)
    }
  }

  const baseStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  }

  if (step === 'placing') {
    return (
      <div
        style={{
          ...baseStyle,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(26,22,20,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,249,239,0.08)',
        }}
      >
        <span className="text-sm text-cream font-medium">Tap the map to place your pin.</span>
        <button onClick={onClose} className="text-muted text-sm underline underline-offset-2">cancel</button>
      </div>
    )
  }

  const panelStyle = {
    ...baseStyle,
    background: '#221E1C',
    border: '1px solid rgba(255,249,239,0.08)',
    borderBottom: 'none',
    borderRadius: '24px 24px 0 0',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
    ...sheetStyle,
  }

  if (step === 'form') {
    return (
      <div style={panelStyle} {...sheetHandlers}>
        {/* Handle — visual only */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.2)' }} />
        </div>
        <div className="px-5 pt-1 pb-1 flex-shrink-0">
          <h2 className="text-cream font-extrabold text-lg">Drop a song the world forgot.</h2>
        </div>
        <div ref={scrollRef} className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <DropForm onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
        </div>
      </div>
    )
  }

  if (step === 'done' && newPin) {
    return (
      <div style={panelStyle} {...sheetHandlers}>
        {/* Handle — visual only */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.2)' }} />
        </div>
        <div ref={scrollRef} className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <PostSubmission
            pin={newPin}
            isFirst={totalPins <= 1}
            onWaitlist={onOpenWaitlist}
            onBack={onClose}
          />
        </div>
      </div>
    )
  }

  return null
}
