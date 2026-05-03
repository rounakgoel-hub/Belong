import { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'
import { EDITION_ID } from '../../lib/constants'
import { useDragToDismiss } from '../../hooks/useDragToDismiss'
import DropForm from './DropForm'
import PostSubmission from './PostSubmission'

function maskLocation(lat, lng) {
  const r = 0.005 * Math.random()
  const angle = Math.random() * 2 * Math.PI
  return {
    lat: lat + r * Math.cos(angle),
    lng: lng + r * Math.sin(angle),
  }
}

// step: 'placing' | 'form' | 'done'
export default function DropDrawer({
  step, position, locationGranted, onClose, onSubmitted,
  onOpenWaitlist, onNearestPinClick, totalPins, toast, onLocationReady
}) {
  // pendingPin is set immediately from form data — no waiting for Supabase.
  // Once the insert returns, it's upgraded to the real row (adds id, created_at, etc).
  const [pendingPin, setPendingPin] = useState(null)
  const [locationPanned, setLocationPanned] = useState(false)
  const scrollRef = useRef(null)
  const { sheetHandlers, sheetStyle } = useDragToDismiss(handleClose, scrollRef)
  // Prevents a late-resolving GPS callback from firing after the user already moved on.
  const locationActiveRef = useRef(false)

  // Reset local state when the drawer is fully closed.
  useEffect(() => {
    if (!step) { setPendingPin(null); setLocationPanned(false) }
  }, [step])

  // Silently request geolocation as soon as placing step opens.
  useEffect(() => {
    if (step !== 'placing') {
      locationActiveRef.current = false
      return
    }
    if (locationActiveRef.current) return
    locationActiveRef.current = true

    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!locationActiveRef.current) return
        setLocationPanned(true)
        onLocationReady?.({ lat: coords.latitude, lng: coords.longitude })
      },
      () => {} // denied or unavailable — user falls back to manual tap, no message shown
    )
  }, [step, onLocationReady])

  function handleClose() {
    setPendingPin(null)
    onClose()
  }

  async function handleSubmit({ songName, artist, memory, handle, spotify_track_id, album_art_url, preview_url }) {
    if (!songName.trim()) { toast('Name the dead song'); return }
    if (!memory.trim()) { toast('Tell us why it deserved better'); return }
    if (!position) { toast('Tap the map to drop your pin first'); return }

    // ① Build display pin from local form data — album art and preview_url are
    //    already in memory from the Spotify search; no re-fetch needed.
    const localPin = {
      song_name:    songName.trim(),
      artist:       artist.trim(),
      memory:       memory.trim(),
      handle:       handle.trim() || null,
      album_art_url: album_art_url ?? null,
      preview_url:  preview_url ?? null,
      resonance_count: 0,
    }

    // ② Show post-submission screen immediately — don't wait for Supabase.
    setPendingPin(localPin)

    // ③ Duplicate-song check — fire without awaiting so it never blocks the UI.
    supabase
      .from('pins')
      .select('id')
      .ilike('song_name', songName.trim())
      .eq('edition_id', EDITION_ID)
      .limit(1)
      .then(({ data: existing }) => {
        if (existing?.length) toast('Someone else feels this too. Want to add your memory of it?')
      })

    // ④ Mask raw coords before insert — never store exact location.
    const { lat, lng } = maskLocation(position.lat, position.lng)

    // ⑤ Insert runs concurrently while PostSubmission is already visible.
    const { data, error } = await supabase
      .from('pins')
      .insert({
        edition_id:       EDITION_ID,
        lat,
        lng,
        song_name:        songName.trim(),
        artist:           artist.trim(),
        memory:           memory.trim(),
        handle:           handle.trim() || null,
        anon_id:          getAnonId(),
        spotify_track_id: spotify_track_id ?? null,
        album_art_url:    album_art_url ?? null,
        preview_url:      preview_url ?? null,
      })
      .select()
      .single()

    if (error) {
      toast("Couldn't save your song — check your connection.")
      return
    }

    // ⑥ Upgrade to real row (now has id, created_at) and add marker to the map.
    setPendingPin(data)
    onSubmitted(data)
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
          padding: '14px 20px 16px',
          background: 'color-mix(in srgb, var(--bg) 95%, transparent)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {locationPanned ? (
          <>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--text)' }}>
              We've panned the map to your approximate location. Drop your pin to around where you are in Chennai right now.
            </p>
            <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
              Your location data is never stored — we shift it slightly to keep you anonymous.
            </p>
          </>
        ) : (
          <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text)' }}>
            Tap the map to place your pin
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs" style={{ color: 'var(--muted)' }}>Tap anywhere on the map to place it.</span>
          <button onClick={handleClose} className="text-xs underline underline-offset-2" style={{ color: 'var(--muted)' }}>cancel</button>
        </div>
      </div>
    )
  }

  const panelStyle = {
    ...baseStyle,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    borderRadius: '24px 24px 0 0',
    maxHeight: '92vh',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
    ...sheetStyle,
  }

  const handle = (
    <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
      <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.2)' }} />
    </div>
  )

  // Post-submission — shown as soon as pendingPin is set, before insert returns.
  if (pendingPin) {
    return (
      <div style={panelStyle} {...sheetHandlers}>
        {handle}
        <div ref={scrollRef} className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <PostSubmission
            pin={pendingPin}
            isFirst={totalPins <= 1}
            onWaitlist={onOpenWaitlist}
            onBack={handleClose}
            toast={toast}
            position={position}
            locationGranted={locationGranted}
            onNearestPinClick={onNearestPinClick}
          />
        </div>
      </div>
    )
  }

  if (step === 'form') {
    return (
      <div style={panelStyle} {...sheetHandlers}>
        {handle}
        <div className="px-5 pt-1 pb-1 flex-shrink-0">
          <h2 className="text-cream font-extrabold text-lg">Drop your song</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Tap the map to mark your spot, then tell us the song.</p>
        </div>
        <div ref={scrollRef} className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          <DropForm onSubmit={handleSubmit} onCancel={handleClose} />
        </div>
      </div>
    )
  }

  return null
}
