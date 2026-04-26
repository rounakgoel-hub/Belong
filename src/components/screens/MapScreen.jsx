import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../map/MapView'
import DropDrawer from '../drop/DropDrawer'
import StorySheet from '../sheets/StorySheet'
import WaitlistModal from '../sheets/WaitlistModal'
import CountdownStrip from '../ui/CountdownStrip'
import { usePins } from '../../hooks/usePins'
import { useAppContext } from '../../context/AppContext'
import { getAnonId } from '../../lib/anonId'
import { useToast } from '../ui/ToastManager'

export default function MapScreen() {
  const navigate = useNavigate()
  const { pins, loading } = usePins()
  const { theme, toggleTheme } = useAppContext()
  const toast = useToast()
  const myAnonId = getAnonId()

  const [dropStep, setDropStep] = useState(null) // null | 'placing' | 'form' | 'done'
  const [placingPos, setPlacingPos] = useState(null)
  const [selectedPin, setSelectedPin] = useState(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)
  const [footerCollapsed, setFooterCollapsed] = useState(false)
  const [newPinId, setNewPinId] = useState(null)

  // Return visitor: highlight own pin
  useEffect(() => {
    if (!loading && pins.length > 0) {
      const mine = pins.find(p => p.anon_id === myAnonId)
      if (mine) toast('Your song is still on the map.')
    }
  }, [loading])

  function openDrop() {
    setDropStep('placing')
    setPlacingPos(null)
    setFooterCollapsed(true)
  }

  function handleMapClick(latlng) {
    if (dropStep === 'placing') {
      setPlacingPos(latlng)
      setDropStep('form')
    }
  }

  function handleSubmitted(pin) {
    setNewPinId(pin.id)
    setDropStep('done')
  }

  function closeDrop() {
    setDropStep(null)
    setPlacingPos(null)
    setFooterCollapsed(false)
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 relative"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', zIndex: 1100 }}
      >
        <div>
          <span className="font-extrabold text-lg leading-none" style={{ color: 'var(--text)' }}>
            Belong<span style={{ color: 'var(--red)' }}>.</span>
          </span>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Edition 1 · May 2026 · Dead Song Resurrection · Chennai</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/stories')}
            className="text-right"
          >
            <p className="font-bold text-sm" style={{ color: 'var(--text)' }}>{pins.length} dead songs back</p>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>tap to read every story</p>
          </button>
          <button
            onClick={toggleTheme}
            style={{
              width: 32,
              height: 32,
              minWidth: 32,
              borderRadius: '50%',
              background: 'var(--surface2)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
              flexShrink: 0,
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <CountdownStrip />

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          pins={pins}
          onPinClick={pin => { if (!dropStep) setSelectedPin(pin) }}
          placingMode={dropStep === 'placing'}
          placingPosition={placingPos}
          onMapClick={handleMapClick}
        />

        {/* FAB */}
        {!dropStep && (
          <button
            onClick={openDrop}
            aria-label="Resurrect a song"
            style={{
              position: 'absolute',
              bottom: footerCollapsed ? 60 : 156,
              right: 20,
              zIndex: 1000,
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'var(--red)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(181,41,0,0.5)',
              transition: 'bottom 0.2s ease',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3v16M3 11h16" stroke="var(--text)" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {/* Empty state */}
        {!loading && pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-3"
                style={{ background: 'var(--red)', animation: 'pulse 2s ease-in-out infinite' }}
              />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>The stage is empty. Start the resurrection.</p>
            </div>
          </div>
        )}

        {/* Floating footer card */}
        {!dropStep && (
          <div
            className="absolute bottom-0 left-0 right-0 px-4"
            style={{ zIndex: 900, paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div
              className="rounded-2xl mx-auto overflow-hidden"
              style={{
                background: 'var(--surface)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border)',
                maxWidth: 420,
              }}
            >
              {footerCollapsed ? (
                <button
                  className="w-full px-5 py-3 text-left"
                  onClick={() => setFooterCollapsed(false)}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Drop a song the world forgot.</p>
                </button>
              ) : (
                <div className="px-5 py-4">
                  <p className="font-bold text-base mb-0.5" style={{ color: 'var(--text)' }}>Drop a song the world forgot.</p>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
                    The ones worth sharing end up on a stage — performed live, together.
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--red-l)' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: 'var(--red)' }} />
                      Live · Chennai · May 2026
                    </div>
                  </div>
                  <button
                    onClick={openDrop}
                    className="w-full py-3 rounded-xl font-bold text-sm"
                    style={{ background: 'var(--red)', color: 'var(--text)' }}
                  >
                    Resurrect a song
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drop drawer */}
      <DropDrawer
        step={dropStep}
        position={placingPos}
        onClose={closeDrop}
        onSubmitted={handleSubmitted}
        onOpenWaitlist={() => setWaitlistOpen(true)}
        totalPins={pins.length}
        toast={toast}
      />

      {/* Story sheet */}
      <StorySheet
        pin={selectedPin}
        open={!!selectedPin}
        onClose={() => setSelectedPin(null)}
        toast={toast}
      />

      {/* Waitlist */}
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        toast={toast}
      />
    </div>
  )
}
