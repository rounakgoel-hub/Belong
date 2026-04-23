import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'
import { EDITION_ID } from '../../lib/constants'
import DropForm from './DropForm'
import PostSubmission from './PostSubmission'

// step: 'placing' | 'form' | 'done'
export default function DropDrawer({
  step, position, onClose, onSubmitted,
  onOpenWaitlist, totalPins, toast
}) {
  const [loading, setLoading] = useState(false)
  const [newPin, setNewPin] = useState(null)

  async function handleSubmit({ songName, artist, memory, handle }) {
    if (!songName.trim()) { toast('Name the dead song'); return }
    if (!memory.trim()) { toast('Tell us why it deserved better'); return }
    if (!position) { toast('Tap the map to drop your pin first'); return }

    // Duplicate check
    const { data: existing } = await supabase
      .from('pins')
      .select('id, song_name, handle')
      .ilike('song_name', songName.trim())
      .eq('edition_id', EDITION_ID)
      .limit(1)

    if (existing?.length) {
      toast(`Someone else feels this too. Want to add your memory of it?`)
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
      })
      .select()
      .single()

    setLoading(false)
    if (!error && data) {
      setNewPin(data)
      onSubmitted(data)
    }
  }

  if (step === 'placing') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-5 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(26,22,20,0.92)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,249,239,0.08)',
        }}
      >
        <span className="text-sm text-cream font-medium">Tap the map to place your pin.</span>
        <button onClick={onClose} className="text-muted text-sm underline underline-offset-2">cancel</button>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl flex flex-col"
        style={{
          background: '#221E1C',
          border: '1px solid rgba(255,249,239,0.08)',
          borderBottom: 'none',
          maxHeight: '92vh',
          animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.15)' }} />
        </div>
        <div className="px-5 pt-2 pb-1 flex-shrink-0">
          <h2 className="text-cream font-extrabold text-lg">Drop a song the world forgot.</h2>
        </div>
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <DropForm onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
        </div>
      </div>
    )
  }

  if (step === 'done' && newPin) {
    return (
      <div
        className="fixed bottom-0 left-0 right-0 z-40 rounded-t-3xl flex flex-col"
        style={{
          background: '#221E1C',
          border: '1px solid rgba(255,249,239,0.08)',
          borderBottom: 'none',
          maxHeight: '92vh',
          animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.15)' }} />
        </div>
        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
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
