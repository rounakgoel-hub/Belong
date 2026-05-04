import { useState, useMemo, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { supabase } from '../../lib/supabase'
import { getAnonId } from '../../lib/anonId'

const VENUE_LAT = 13.0671646
const VENUE_LNG = 80.259706
const CHENNAI_LAT = 13.0827
const CHENNAI_LNG = 80.2707

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

  const [showCityInput, setShowCityInput] = useState(false)
  const [cityContact, setCityContact] = useState('')
  const [cityInterestSaved, setCityInterestSaved] = useState(false)
  const [cityName, setCityName] = useState(null)

  const distFromChennaiKm = position
    ? haversineM(position.lat, position.lng, CHENNAI_LAT, CHENNAI_LNG) / 1000
    : null
  const isOutsideChennai = distFromChennaiKm !== null && distFromChennaiKm > 50

  useEffect(() => {
    if (!isOutsideChennai || !position) return
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.lat}&lon=${position.lng}&format=json`)
      .then(r => r.json())
      .then(data => {
        const name = data.address?.city || data.address?.town || data.address?.state_district || 'your city'
        setCityName(name)
      })
      .catch(() => setCityName('your city'))
  }, [isOutsideChennai])

  function handleCityInterest() {
    setShowCityInput(true)
  }

  async function saveCityInterest() {
    if (!cityContact.trim()) return
    await supabase.from('city_interest').insert({
      city: cityName,
      contact: cityContact.trim(),
      anon_id: getAnonId(),
      created_at: new Date().toISOString(),
    })
    setCityInterestSaved(true)
    setShowCityInput(false)
  }


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
    const text = "I've contributed to Chennai's first crowd-sourced live setlist — follow the community and reserve your spot for the show @belong.chennai"
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
    const text = "I've contributed to Chennai's first crowd-sourced live setlist — I'd love for you to share a song too at the living song map:"
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
            <span className="text-xs" style={{ color: 'var(--muted)', opacity: 0.55 }}>Belong. · Vol. 1 — The Recall Room · Chennai</span>
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
              Your song is <strong>{insights.venueDistKm}km</strong> from the room. On May 30th, it travels there.
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

      {/* 3. Out-of-city detection ─────────────────────────── */}
      {isOutsideChennai && cityName && (
        <div style={{
          width: '100%',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
        }}>
          <p style={{
            fontSize: '0.58rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            fontWeight: 600,
            margin: 0,
          }}>Dropping in from {cityName}?</p>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text)',
            lineHeight: 1.55,
            fontWeight: 500,
            margin: 0,
          }}>
            The Recall Room begins in Chennai — but it's coming to more cities. We'll find you when it does.
          </p>
          {cityInterestSaved ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--red-l)', fontWeight: 600, margin: 0 }}>
              We'll find you. ♪
            </p>
          ) : showCityInput ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                placeholder="Phone / WhatsApp or email"
                value={cityContact}
                onChange={e => setCityContact(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                name="city-contact-x9m"
                style={{
                  flex: 1,
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                  padding: '0.6rem 0.75rem',
                  fontSize: '0.82rem',
                  borderRadius: 6,
                  fontFamily: 'var(--sans)',
                  outline: 'none',
                }}
              />
              <button
                onClick={saveCityInterest}
                style={{
                  background: 'var(--red)',
                  color: 'var(--cream)',
                  border: 'none',
                  borderRadius: 6,
                  padding: '0.6rem 0.9rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--sans)',
                }}
              >→</button>
            </div>
          ) : (
            <button
              onClick={handleCityInterest}
              style={{
                background: 'var(--red)',
                color: 'var(--cream)',
                border: 'none',
                borderRadius: 8,
                padding: '0.65rem 1rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--sans)',
                letterSpacing: '0.06em',
              }}
            >
              Let us know when it arrives →
            </button>
          )}
        </div>
      )}

      {/* 4. Headline ───────────────────────────────────────── */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: '0 0 4px' }}>
          You just reminded someone of a song they probably forgot!
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0 }}>
          Now let more of the city in.
        </p>
      </div>

      {/* 5. CTAs ───────────────────────────────────────────── */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={handleShare}
          className="w-full py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-0.5"
          style={{ background: 'var(--red)', color: 'var(--text)' }}
        >
          <span>Share your drop</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.75 }}>Let the city know</span>
        </button>

        <button
          onClick={handleInvite}
          className="w-full py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-0.5"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)', background: 'transparent' }}
        >
          <span>Invite someone whose taste you trust</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.75 }}>They should be here too</span>
        </button>

        <button
          onClick={onWaitlist}
          className="w-full py-4 rounded-2xl font-bold text-sm flex flex-col items-center gap-0.5"
          style={{ border: '1px solid var(--gold)', color: 'var(--gold)', background: 'transparent' }}
        >
          <span>Reserve your spot in the room</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.75 }}>Ticketing opens on priority</span>
        </button>
      </div>

      {/* 6. Back link ──────────────────────────────────────── */}
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
