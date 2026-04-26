import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePins } from '../../hooks/usePins'
import Avatar from '../ui/Avatar'
import StorySheet from '../sheets/StorySheet'
import WaitlistModal from '../sheets/WaitlistModal'
import { useToast } from '../ui/ToastManager'

export default function AllStoriesScreen() {
  const navigate = useNavigate()
  const { pins, loading } = usePins()
  const toast = useToast()

  const [selectedPin, setSelectedPin] = useState(null)
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  // ── CTA drawer — collapses on scroll down, expands on pull-up ──
  const [ctaOpen, setCtaOpen] = useState(true)
  const scrollRef = useRef(null)
  const lastScrollY = useRef(0)

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const delta = el.scrollTop - lastScrollY.current
    lastScrollY.current = el.scrollTop
    if (delta > 12) setCtaOpen(false)   // scrolling down — collapse
    if (delta < -12) setCtaOpen(true)   // scrolling up — expand
  }

  // ── Audio — one track at a time ──────────────────────────────
  const audioRef = useRef(null)
  const [playingId, setPlayingId] = useState(null)

  function handlePlay(e, pin) {
    e.stopPropagation()
    if (!pin.preview_url) return
    if (playingId === pin.id) {
      audioRef.current?.pause()
      setPlayingId(null)
      return
    }
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }
    const audio = new Audio(pin.preview_url)
    audio.volume = 0.6
    audio.addEventListener('ended', () => setPlayingId(null))
    audio.play().then(() => setPlayingId(pin.id)).catch(() => setPlayingId(null))
    audioRef.current = audio
  }

  useEffect(() => () => { audioRef.current?.pause() }, [])

  function openStory(pin) {
    audioRef.current?.pause()
    setPlayingId(null)
    setSelectedPin(pin)
  }

  async function handleInvite() {
    const title = 'Belong.'
    const text = "I've contributed to Chennai's first crowd-sourced music socials — I'd love for you to share a song too at the living song map:"
    const url = 'https://belong-seven.vercel.app/'
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast('Copied to clipboard ♪')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast('Copied to clipboard ♪')
      }
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--bg)' }}>

      {/* ── Header ────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-5 pt-10 pb-4"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={() => navigate('/map')}
          className="flex items-center gap-1.5 text-xs font-medium mb-4"
          style={{ color: 'var(--muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to map
        </button>

        <h1 className="font-extrabold text-2xl leading-none mb-1.5" style={{ color: 'var(--text)' }}>
          Belong<span style={{ color: 'var(--red)' }}>.</span>
        </h1>
        <p className="text-sm leading-snug" style={{ color: 'var(--muted)' }}>
          Chennai's living setlist.
          {pins.length > 0 && (
            <> <span className="font-semibold" style={{ color: 'var(--text)' }}>{pins.length}</span> song{pins.length !== 1 ? 's' : ''} resurrected.</>
          )}
          {' '}Growing until May 2026.
        </p>
      </div>

      {/* ── Pin list ───────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading the setlist…</p>
          </div>
        )}

        {!loading && pins.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-2 h-2 rounded-full mb-4" style={{ background: 'var(--red)' }} />
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No songs yet. Drop the first one on the map.</p>
          </div>
        )}

        {pins.map(pin => {
          const isPlaying = playingId === pin.id
          const hasAudio = !!pin.preview_url

          return (
            <button
              key={pin.id}
              onClick={() => openStory(pin)}
              className="w-full text-left px-5 py-4"
              style={{
                borderBottom: '1px solid var(--border)',
                background: isPlaying ? 'rgba(181,41,0,0.04)' : 'transparent',
                display: 'block',
              }}
            >
              <div className="flex items-start gap-3">

                {/* Album art / avatar */}
                <div className="flex-shrink-0" style={{ width: 56, height: 56 }}>
                  {pin.album_art_url ? (
                    <img
                      src={pin.album_art_url}
                      alt={pin.song_name}
                      className="w-full h-full object-cover"
                      style={{ borderRadius: 10 }}
                    />
                  ) : (
                    <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden' }}>
                      <Avatar handle={pin.handle} size={56} />
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm leading-tight truncate" style={{ color: 'var(--text)' }}>
                        {pin.song_name}
                      </p>
                      {pin.artist && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted)' }}>
                          {pin.artist}
                        </p>
                      )}
                      <p className="text-xs mt-0.5" style={{ color: 'var(--muted)', opacity: 0.6 }}>
                        {pin.handle || 'Anonymous'} · Chennai
                      </p>
                    </div>

                    {/* Play + Story buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                      <button
                        onClick={e => handlePlay(e, pin)}
                        disabled={!hasAudio}
                        style={{
                          width: 32, height: 32, minWidth: 32,
                          borderRadius: '50%',
                          border: `1px solid ${isPlaying ? 'var(--red)' : 'var(--border)'}`,
                          background: isPlaying ? 'rgba(181,41,0,0.12)' : 'transparent',
                          color: isPlaying ? 'var(--red)' : hasAudio ? 'var(--muted)' : 'var(--border)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 0,
                          cursor: hasAudio ? 'pointer' : 'default',
                          fontSize: 11,
                        }}
                        aria-label={isPlaying ? 'Pause' : 'Play preview'}
                      >
                        {isPlaying ? '⏸' : '▶'}
                      </button>

                      <button
                        onClick={e => { e.stopPropagation(); openStory(pin) }}
                        style={{
                          width: 32, height: 32, minWidth: 32,
                          borderRadius: '50%',
                          border: '1px solid var(--border)',
                          background: 'transparent',
                          color: 'var(--muted)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: 0,
                          cursor: 'pointer',
                          fontSize: 13,
                        }}
                        aria-label="Open story"
                      >
                        💬
                      </button>
                    </div>
                  </div>

                  {/* Resonance + memory teaser */}
                  {pin.resonance_count > 0 && (
                    <p className="text-xs mt-1.5" style={{ color: 'var(--muted)', opacity: 0.7 }}>
                      {pin.resonance_count} remembered this
                    </p>
                  )}
                  {pin.memory && (
                    <p
                      className="text-xs italic mt-1 leading-relaxed"
                      style={{
                        color: 'var(--muted)',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      "{pin.memory}"
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}

        <div style={{ height: 16 }} />
      </div>

      {/* ── Collapsible CTA drawer ─────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid var(--border)',
          background: 'color-mix(in srgb, var(--bg) 80%, transparent)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          transition: 'all 0.25s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        {/* Pull tab — always visible, toggles drawer */}
        <button
          onClick={() => setCtaOpen(o => !o)}
          className="w-full flex flex-col items-center pt-2 pb-1"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          aria-label={ctaOpen ? 'Collapse actions' : 'Expand actions'}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'var(--border)',
              transition: 'background 0.2s',
            }}
          />
        </button>

        {/* CTA buttons — slide in/out */}
        <div
          style={{
            overflow: 'hidden',
            maxHeight: ctaOpen ? 200 : 0,
            opacity: ctaOpen ? 1 : 0,
            transition: 'max-height 0.25s cubic-bezier(0.32,0.72,0,1), opacity 0.2s ease',
            paddingBottom: ctaOpen ? 'max(20px, env(safe-area-inset-bottom))' : 0,
          }}
        >
          <div className="flex flex-col gap-2.5 px-5 pt-1 mx-auto" style={{ maxWidth: 420 }}>
            <button
              onClick={() => navigate('/map')}
              className="w-full py-3 rounded-2xl font-bold text-sm"
              style={{ background: 'var(--red)', color: 'var(--text)' }}
            >
              Resurrect a song
            </button>
            <button
              onClick={handleInvite}
              className="w-full py-3 rounded-2xl font-bold text-sm"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
            >
              Invite friends to contribute
            </button>
            <button
              onClick={() => setWaitlistOpen(true)}
              className="w-full py-3 rounded-2xl font-bold text-sm"
              style={{ border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent' }}
            >
              Reserve your spot
            </button>
          </div>
        </div>
      </div>

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
