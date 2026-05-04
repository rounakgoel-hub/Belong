import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import WaitlistModal from '../sheets/WaitlistModal'

const VIMEO_SRC =
  'https://player.vimeo.com/video/1187795118?autoplay=0&muted=0&portrait=0&title=0&byline=0&badge=0'

const CITY_BULLETS = [
  'Chennai has a reputation for knowing exactly what it likes.',
  'What that reputation misses is how wide that taste actually runs.',
  'Bollywood hummed in traffic. Sid Sriram in the background of every other memory. Ghazals carried like quiet secrets. Twenty One Pilots in rooms where nobody expected them.',
  'The relationship with music here has always been deeper, stranger, and more surprising than the outside world imagined.',
]

const PROJECT_BULLETS = [
  'Belong is an attempt to surface that.',
  'To find out which songs are quietly living in which corners of this city.',
  'And to bring them — with the people who carry them — into the same room.',
  'This is Edition 1. There will be more.',
]

function RevealItem({ children, delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function BulletList({ items, startDelay = 0 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map((text, i) => (
        <RevealItem key={i} delay={startDelay + i * 80}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--red)', flexShrink: 0, marginTop: 7,
            }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
              {text}
            </p>
          </div>
        </RevealItem>
      ))}
    </div>
  )
}

export default function AboutScreen() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppContext()
  const [waitlistOpen, setWaitlistOpen] = useState(false)

  return (
    <>
      <div
        style={{
          height: '100%',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          background: 'var(--bg)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div
          style={{
            position: 'sticky', top: 0, zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            background: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              fontSize: '0.8rem', fontWeight: 600,
              color: 'var(--muted)', background: 'none',
              border: 'none', cursor: 'pointer', padding: 0,
            }}
          >
            ← Back
          </button>

          <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>
            Belong<span style={{ color: 'var(--red)' }}>.</span>
          </span>

          <button
            onClick={toggleTheme}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--surface2)', border: 'none',
              cursor: 'pointer', fontSize: 15,
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* ── Body ────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 420, margin: '0 auto',
            padding: '32px 20px 48px',
            display: 'flex', flexDirection: 'column', gap: 36,
          }}
        >

          {/* ── Opening statement ───────────────────────────── */}
          <RevealItem delay={0}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', lineHeight: 1.4, margin: 0 }}>
              I've been holding onto forgotten songs my whole life. In case you are too, let's relive them together.
            </p>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--red-l)',
              fontWeight: 600,
              fontStyle: 'italic',
              marginTop: '0.5rem',
            }}>
              Chennai is where this begins.
            </p>
          </RevealItem>

          {/* ── Video ────────────────────────────────────────── */}
          <RevealItem delay={100}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <iframe
                src={VIMEO_SRC}
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                style={{ width: 'min(360px, 90vw)', aspectRatio: '9/16', borderRadius: 12, display: 'block' }}
                title="Belong. — The intention"
              />
            </div>
          </RevealItem>

          {/* ── The city ─────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <RevealItem delay={0}>
              <p style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
                The city
              </p>
            </RevealItem>
            <BulletList items={CITY_BULLETS} startDelay={60} />
          </div>

          {/* ── The project ──────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <RevealItem delay={0}>
              <p style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
                The project
              </p>
            </RevealItem>
            <BulletList items={PROJECT_BULLETS} startDelay={60} />
          </div>

          {/* ── Edition box ──────────────────────────────────── */}
          <RevealItem delay={0}>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                The Recall Room
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--muted)', margin: 0 }}>
                Vol. 1 — Bollywood, Hindi &amp; Desi
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--red-l)', margin: 0 }}>
                May 30th, 2026
              </p>
            </div>
          </RevealItem>

          {/* ── CTAs ─────────────────────────────────────────── */}
          <RevealItem delay={0}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => navigate('/map')}
                style={{
                  width: '100%', padding: '14px 0',
                  borderRadius: 16, fontWeight: 700, fontSize: '0.9rem',
                  background: 'var(--red)', color: 'var(--text)',
                  border: 'none', cursor: 'pointer',
                }}
              >
                Drop your song →
              </button>

              <button
                onClick={() => setWaitlistOpen(true)}
                style={{
                  width: '100%', padding: '13px 0',
                  borderRadius: 16, fontWeight: 600, fontSize: '0.9rem',
                  background: 'transparent',
                  border: '1px solid var(--gold)',
                  color: 'var(--gold)',
                  cursor: 'pointer',
                }}
              >
                Reserve your spot
              </button>
            </div>
          </RevealItem>

          {/* ── Copyright footer ──────────────────────────────── */}
          <div style={{ padding: '1.5rem 1.25rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border)', marginTop: '1rem' }}>
            <p style={{ fontSize: '0.6rem', color: 'rgba(138,126,120,0.35)', letterSpacing: '0.08em', lineHeight: 1.8, margin: 0 }}>
              © 2026 Belong. · The Recall Room · All rights reserved.<br />
              Concept & curation by Rounak Goel<br />
              <a
                href="https://www.instagram.com/belong.chennai/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'rgba(138,126,120,0.5)', textDecoration: 'none' }}
              >
                @belong.chennai
              </a>
            </p>
          </div>

        </div>
      </div>

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  )
}
