import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'
import { EDITION_ID } from '../../lib/constants'

export default function WaitlistModal({ open, onClose, toast }) {
  const [contact, setContact] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!contact.trim()) return
    setLoading(true)
    await supabase.from('waitlist').insert({
      edition_id: EDITION_ID,
      contact: contact.trim(),
      anon_id: getAnonId(),
    })
    setLoading(false)
    setDone(true)
  }

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="70vh">
      <div className="px-5 pb-10 pt-4">
        {done ? (
          <div className="text-center py-8">
            <p className="text-2xl font-extrabold text-cream mb-3">You're in.</p>
            <p className="text-muted text-sm leading-relaxed">
              When the dead songs play live, we'll find you a seat.
            </p>
            <button
              onClick={onClose}
              className="mt-8 text-muted text-sm underline underline-offset-4"
            >
              Back to the map
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-cream font-extrabold text-xl mb-2">Save your spot</h2>
            <p className="text-muted text-sm leading-relaxed mb-1">
              Be in the room when the dead songs play.
            </p>
            <p className="text-muted text-sm leading-relaxed mb-6">
              No ticket yet. Just tell us you want to be there — we'll find you a seat when the time comes.
            </p>

            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Phone or email"
              className="w-full bg-surface2 rounded-xl px-4 py-3 text-cream text-sm placeholder:text-muted outline-none mb-4"
              style={{ border: '1px solid var(--border)' }}
            />

            <button
              onClick={submit}
              disabled={loading || !contact.trim()}
              className="w-full py-4 rounded-2xl font-bold text-cream text-base transition-all"
              style={{
                background: contact.trim() ? 'var(--gold)' : 'var(--surface2)',
                color: contact.trim() ? 'var(--bg)' : 'var(--muted)',
              }}
            >
              {loading ? 'Holding…' : 'Hold my spot →'}
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}
