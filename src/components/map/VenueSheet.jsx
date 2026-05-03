import { useState, useEffect } from 'react'
import BottomSheet from '../sheets/BottomSheet'

const PHOTO_URL = 'https://jcpvdmusnlmbdveghfni.supabase.co/storage/v1/object/public/Venue/MadrasTaproomLogo2.png'
const VENUE_VIDEO_SRC = 'https://player.vimeo.com/video/1187958249?portrait=0&title=0&byline=0&badge=0'
const DIRECTIONS_URL = 'https://maps.app.goo.gl/hnUJNNjsjcGquZfj7'
const SHOW_DATE = new Date('2026-05-30T00:00:00+05:30')

function getTimeLeft() {
  const diff = Math.max(0, SHOW_DATE - Date.now())
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function pad(n) { return String(n).padStart(2, '0') }

export default function VenueSheet({ open, onClose, onOpenWaitlist }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [open])

  return (
    <BottomSheet open={open} onClose={onClose} maxHeight="92vh">

      {/* ── Hero photo — top section ─────────────────────────── */}
      <div style={{ position: 'relative', width: '100%', height: '52vw', minHeight: 200, maxHeight: 280, flexShrink: 0, overflow: 'hidden' }}>
        <img
          src={PHOTO_URL}
          alt="The Madras Taproom"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
        />
        {/* Gradient sweeping up from bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(26,22,20,0.95) 0%, transparent 60%)',
        }} />

        {/* Venue name + date — bottom left over photo */}
        <div style={{ position: 'absolute', bottom: 18, left: 20, right: 20 }}>
          <p style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#FFF9EF',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            The Madras Taproom
          </p>
          <p style={{
            fontSize: '0.7rem',
            color: 'var(--red-l)',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}>
            CHENNAI · MAY 30TH, 2026
          </p>
        </div>
      </div>

      {/* ── Countdown + copy ────────────────────────────────── */}
      <div style={{ padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Live countdown ───────────────────────────────── */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '0.6rem',
            color: 'var(--muted)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            Until the songs play live
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
            {[
              { value: pad(timeLeft.days),    label: 'DAYS' },
              { value: pad(timeLeft.hours),   label: 'HOURS' },
              { value: pad(timeLeft.minutes), label: 'MINUTES' },
              { value: pad(timeLeft.seconds), label: 'SECONDS' },
            ].map(({ value, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <span style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--text)',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {value}
                </span>
                <span style={{
                  fontSize: '0.5rem',
                  letterSpacing: '0.15em',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bold copy ───────────────────────────────────── */}
        <p style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--text)',
          fontStyle: 'italic',
          textAlign: 'center',
          margin: 0,
        }}>
          This is where the songs become real.
        </p>

      </div>

      {/* ── Venue video — full sheet width, 16:9 ────────────── */}
      <div style={{
        width: '100%',
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <iframe
          key="venue-video"
          src={VENUE_VIDEO_SRC}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
          title="The Madras Taproom"
        />
      </div>

      {/* ── CTAs ─────────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 36px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
        <button
          onClick={() => { onClose(); onOpenWaitlist() }}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: 16,
            background: 'var(--red)',
            color: '#FFF9EF',
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Reserve your spot in the room
        </button>

        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            padding: '13px 0',
            borderRadius: 16,
            border: '1px solid var(--border)',
            color: 'var(--muted)',
            fontWeight: 600,
            fontSize: 14,
            textAlign: 'center',
            textDecoration: 'none',
          }}
        >
          Get directions
        </a>
      </div>
    </BottomSheet>
  )
}
