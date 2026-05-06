import { useState } from 'react'
import BottomSheet from './BottomSheet'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'
import { EDITION_ID } from '../../lib/constants'

function isValidContact(val) {
  const phone = /^[6-9]\d{9}$/.test(val.replace(/\s/g, ''))
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  return phone || email
}

export default function WaitlistModal({ open, onClose, toast }) {
  const [contact, setContact] = useState('')
  const [city, setCity] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    const val = contact.trim()

    if (!val || !isValidContact(val)) {
      toast?.('Enter a valid phone number or email')
      return
    }

    setLoading(true)

    // Duplicate check — one entry per anon_id per edition
    const { count } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('anon_id', getAnonId())
      .eq('edition_id', EDITION_ID)

    if (count > 0) {
      toast?.("You're already on the list ♪")
      setLoading(false)
      setDone(true)
      return
    }

    await supabase.from('waitlist').insert({
      edition_id: EDITION_ID,
      contact: val,
      city: city.trim() || null,
      anon_id: getAnonId(),
      created_at: new Date().toISOString(),
    })

    setLoading(false)
    setDone(true)
  }

  function handleClose() {
    onClose()
    // Reset after sheet closes so re-opening is fresh
    setTimeout(() => { setContact(''); setCity(''); setDone(false) }, 400)
  }

  return (
    <BottomSheet open={open} onClose={handleClose} maxHeight="70vh">
      <div className="px-5 pb-10 pt-4">
        {done ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem' }}>
              You're on the list.
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.65 }}>
              When The Recall Room opens —<br />you'll hear from us first.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 text-sm underline underline-offset-4"
              style={{ color: 'var(--muted)' }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              Save your spot
            </p>
            <h2 className="font-extrabold text-xl mb-2" style={{ color: 'var(--text)' }}>
              Be in the room when the songs play live
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Leave your number or email — when The Recall Room opens bookings, you'll hear from us first.
            </p>

            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="Phone / WhatsApp or email"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-3"
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <input
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
              type="text"
              placeholder="Your city (optional)"
              value={city}
              onChange={e => setCity(e.target.value)}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck={false}
              name="waitlist-city-x4p"
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                marginTop: '-0.3rem',
              }}
            />

            <button
              onClick={submit}
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all"
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
