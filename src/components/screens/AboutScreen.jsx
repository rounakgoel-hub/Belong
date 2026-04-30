import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const VIMEO_SRC =
  'https://player.vimeo.com/video/1187795118?autoplay=0&muted=0&portrait=0&title=0&byline=0&badge=0'

export default function AboutScreen() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppContext()

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

          {/* ── Section 1 — opening statement ───────────────── */}
          <p
            style={{
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--text)', lineHeight: 1.4, margin: 0,
            }}
          >
            I've quietly wished for Chennai to have something special. Building this in anticipation.
          </p>

          {/* ── Section 2 — video ────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <iframe
              src={VIMEO_SRC}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: 'min(360px, 90vw)',
                aspectRatio: '9/16',
                borderRadius: 12,
                display: 'block',
              }}
              title="Belong. — The intention"
            />
          </div>

          {/* ── Section 3 — the why ──────────────────────────── */}
          <p
            style={{
              fontSize: '0.85rem', color: 'var(--muted)',
              lineHeight: 1.8, margin: 0,
            }}
          >
            Chennai has always had a particular relationship with music, one that goes deeper than playlists and algorithms. Songs here carry streets, seasons, and people inside them. Belong is an attempt to surface that. To find out which songs are quietly living in which corners of this city, and to bring them with the people who carry them, into the same room. This is Edition 1. There will be more.
          </p>

          {/* ── Section 4 — Edition 1 details box ───────────── */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '1rem',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}
          >
            <p
              style={{
                fontSize: '0.6rem', color: 'var(--muted)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Edition 1
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Dead Song Resurrection Project
            </p>
          </div>

          {/* ── Section 5 — CTAs ────────────────────────────── */}
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
              onClick={() => navigate('/stories')}
              style={{
                width: '100%', padding: '13px 0',
                borderRadius: 16, fontWeight: 600, fontSize: '0.9rem',
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                cursor: 'pointer',
              }}
            >
              Take a quick glance at Chennai's Musical Storyboard →
            </button>
          </div>

        </div>
      </div>

    </>
  )
}
