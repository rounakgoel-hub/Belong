import { useState, useMemo } from 'react'
import { useAppContext } from '../../context/AppContext'

const VENUE_LAT = 13.0671646
const VENUE_LNG = 80.259706

function haversineM(lat1, lng1, lat2, lng2) {
  const R = 6371000
  const φ1 = lat1 * Math.PI / 180
  const φ2 = lat2 * Math.PI / 180
  const Δφ = (lat2 - lat1) * Math.PI / 180
  const Δλ = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export default function PostSubmission({ pin, isFirst, onWaitlist, onBack, toast, position, locationGranted, onNearestPinClick }) {
  const { pins } = useAppContext()
  const hasArt = !!pin?.album_art_url

  // ready = true immediately for no-art pins; set true on image load for art pins.
  // Everything — art, song name bars, memory — waits on the same gate so the
  // whole card reveals in one smooth transition.
  const [ready, setReady] = useState(!hasArt)


  const insights = useMemo(() => {
    if (!position) return null

    const venueDistKm = (haversineM(position.lat, position.lng, VENUE_LAT, VENUE_LNG) / 1000).toFixed(1)

    let nearestPin = null
    let nearestDistM = Infinity
    for (const p of pins) {
      if (p.id === pin?.id) continue
      const d = haversineM(position.lat, position.lng, p.lat, p.lng)
      if (d < nearestDistM) { nearestDistM = d; nearestPin = p }
    }

    return {
      venueDistKm,
      nearestPin,
      nearestDistM: nearestPin ? Math.round(nearestDistM) : null,
    }
  }, [locationGranted, position, pins, pin?.id])

  async function handleShare() {
    const title = 'Belong.'
    const text = "I've contributed to Chennai's first crowd-sourced music socials — follow the community and reserve your spot for the show @belong.chennai"
    const url = 'https://www.instagram.com/belong.chennai/'
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    }
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
        toast?.('Copied to clipboard ♪')
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast?.('Copied to clipboard ♪')
      }
    }
  }

  return (
    <div className="px-4 pb-10 pt-4 flex flex-col gap-5">

      {/* 1. Postcard ───────────────────────────────────────── */}
      <div
        className="w-full overflow-hidden"
        style={{ borderRadius: 18, background: 'var(--surface)', boxShadow: '0 4px 24px rgba(0,0,0,0.18)' }}
      >
        {/* Top half — art banner (160px) */}
        <div className="relative overflow-hidden" style={{ height: 160 }}>

          {!ready && (
            <div className="absolute inset-0 animate-pulse" style={{ background: 'var(--surface2)', zIndex: 1 }} />
          )}

          {hasArt ? (
            <img
              src={pin.album_art_url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 'blur(6px) brightness(0.55)',
                transform: 'scale(1.08)',
                opacity: ready ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
              onLoad={() => setReady(true)}
            />
          ) : (
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #2A1F0A 0%, #1A1614 100%)' }} />
          )}

          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)', zIndex: 2 }} />

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4" style={{ zIndex: 3 }}>
            {ready ? (
              <>
                <p className="font-extrabold leading-tight" style={{ fontSize: 22, color: '#FFF9EF', textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
                  {pin.song_name}
                </p>
                {pin.artist && (
                  <p className="text-sm mt-0.5" style={{ color: 'rgba(255,249,239,0.65)' }}>{pin.artist}</p>
                )}
              </>
            ) : (
              <>
                <div className="animate-pulse rounded-md" style={{ height: 22, width: '65%', background: 'rgba(255,255,255,0.18)', marginBottom: 8 }} />
                <div className="animate-pulse rounded-md" style={{ height: 14, width: '42%', background: 'rgba(255,255,255,0.12)' }} />
              </>
            )}
          </div>
        </div>

        {/* Bottom half — memory + branding */}
        <div className="px-5 pt-4 pb-4" style={{ background: 'var(--surface)' }}>
          {ready ? (
            pin.memory && (
              <div className="mb-4 pl-4 text-sm italic leading-relaxed" style={{ color: 'var(--muted)', borderLeft: '2px solid var(--red)' }}>
                "{pin.memory}"
              </div>
            )
          ) : (
            <div className="mb-4 pl-4" style={{ borderLeft: '2px solid var(--border)' }}>
              <div className="animate-pulse rounded-md mb-2" style={{ height: 13, width: '92%', background: 'var(--surface2)' }} />
              <div className="animate-pulse rounded-md" style={{ height: 13, width: '74%', background: 'var(--surface2)' }} />
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--muted)', opacity: 0.55 }}>Belong. · Edition 1 · Chennai</span>
            <a
              href="https://www.instagram.com/belong.chennai/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: '0.58rem', color: 'rgba(138,126,120,0.45)', letterSpacing: '0.07em', textDecoration: 'none' }}
            >
              @belong.chennai
            </a>
          </div>
        </div>
      </div>

      {/* 2. Spatial insights ───────────────────────────────── */}
      {insights && (
        <div style={{
          width: '100%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '0.9rem 1rem',
        }}>
          <p style={{
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.65rem',
            fontWeight: 600,
          }}>
            Spatial Insight
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <span style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.1rem' }}>◎</span>
            <p style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              Your song is <strong>{insights.venueDistKm}km</strong> from the stage. On May 30th, it travels there.
            </p>
          </div>

          {insights.nearestPin && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: '0.1rem' }}>◉</span>
              <button
                onClick={() => onNearestPinClick?.(insights.nearestPin)}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--text)',
                  lineHeight: 1.5,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--border)',
                }}
              >
                Someone <strong>{insights.nearestDistM}m</strong> away dropped <strong>{insights.nearestPin.song_name}</strong>. Tap to hear their story.
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Headline ───────────────────────────────────────── */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          You just reminded us of a true forgotten song!
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
          Now let more of the city in.
        </p>
      </div>

      {/* 4. CTAs ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ background: 'var(--red)', color: 'var(--text)' }}
        >
          Share the resurrection
        </button>

        <button
          onClick={handleInvite}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
        >
          Invite someone whose taste you trust
        </button>

        <button
          onClick={onWaitlist}
          className="w-full py-4 rounded-2xl font-bold text-sm"
          style={{ border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent' }}
        >
          Be in the room when this plays live
        </button>
      </div>

      {/* 5. Back link ──────────────────────────────────────── */}
      <button
        onClick={onBack}
        className="text-sm underline underline-offset-4 text-center"
        style={{ color: 'var(--muted)' }}
      >
        ← Back to the map
      </button>

    </div>
  )
}
