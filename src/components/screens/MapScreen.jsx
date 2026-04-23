import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import MapView from '../map/MapView'
import DropDrawer from '../drop/DropDrawer'
import StorySheet from '../sheets/StorySheet'
import WaitlistModal from '../sheets/WaitlistModal'
import CountdownStrip from '../ui/CountdownStrip'
import { usePins } from '../../hooks/usePins'
import { getAnonId } from '../../lib/anonId'
import { useToast } from '../ui/ToastManager'

export default function MapScreen() {
  const navigate = useNavigate()
  const { pins, loading } = usePins()
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
    <div className="fixed inset-0 flex flex-col" style={{ background: '#1A1614' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 z-20 relative"
        style={{ background: '#1A1614', borderBottom: '1px solid rgba(255,249,239,0.06)' }}
      >
        <div>
          <span className="text-cream font-extrabold text-lg leading-none">
            Belong<span style={{ color: '#B52900' }}>.</span>
          </span>
          <p className="text-muted text-xs mt-0.5">Edition 1 · May 2026 · Dead Song Resurrection · Chennai</p>
        </div>
        <button
          onClick={() => navigate('/stories')}
          className="text-right"
        >
          <p className="text-cream font-bold text-sm">{pins.length} dead songs back</p>
          <p className="text-muted text-xs">tap to read every story</p>
        </button>
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
            className="absolute bottom-6 right-5 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
            style={{ background: '#B52900' }}
            aria-label="Resurrect a song"
          >
            <span className="text-cream text-3xl font-light leading-none">+</span>
          </button>
        )}

        {/* Empty state */}
        {!loading && pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-center">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-3"
                style={{ background: '#B52900', animation: 'pulse 2s ease-in-out infinite' }}
              />
              <p className="text-muted text-sm">The stage is empty. Start the resurrection.</p>
            </div>
          </div>
        )}

        {/* Floating footer card */}
        {!dropStep && (
          <div
            className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-safe"
            style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
          >
            <div
              className="rounded-2xl mx-auto overflow-hidden"
              style={{
                background: 'rgba(26,22,20,0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,249,239,0.08)',
                maxWidth: 420,
              }}
            >
              {footerCollapsed ? (
                <button
                  className="w-full px-5 py-3 text-left"
                  onClick={() => setFooterCollapsed(false)}
                >
                  <p className="text-cream text-sm font-medium">Drop a song the world forgot.</p>
                </button>
              ) : (
                <div className="px-5 py-4">
                  <p className="text-cream font-bold text-base mb-0.5">Drop a song the world forgot.</p>
                  <p className="text-muted text-xs leading-relaxed mb-3">
                    The ones worth sharing end up on a stage — performed live, together.
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#E05A35' }}>
                      <span className="w-2 h-2 rounded-full" style={{ background: '#B52900' }} />
                      Live · Chennai · May 2026
                    </div>
                  </div>
                  <button
                    onClick={openDrop}
                    className="w-full py-3 rounded-xl font-bold text-cream text-sm"
                    style={{ background: '#B52900' }}
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
