import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

const VIMEO_SRC =
  'https://player.vimeo.com/video/1187795118?autoplay=0&muted=0&portrait=0&title=0&byline=0&badge=0'

export default function LandingScreen() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppContext()

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: 'var(--bg)',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ position: 'relative' }}>

        {/* Radial ambient glow */}
        <div
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 60% 40%, rgba(181,41,0,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'absolute', top: 16, right: 16, zIndex: 20,
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--surface2)', border: 'none', cursor: 'pointer', fontSize: 16,
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* ── Main content column ────────────────────────────── */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            display: 'flex', flexDirection: 'column',
            padding: '40px 20px 0',
            maxWidth: 384, margin: '0 auto', width: '100%',
          }}
        >
          {/* Wordmark */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, color: 'var(--text)', margin: 0 }}>
              Belong<span style={{ color: 'var(--red)' }}>.</span>
            </h1>
            <p style={{ fontSize: '0.7rem', marginTop: 6, letterSpacing: '0.05em', color: 'var(--muted)' }}>
              powered by music, held by people
            </p>
          </div>

          {/* Edition pill */}
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '4px 10px', borderRadius: 99,
              fontSize: '0.7rem', fontWeight: 600,
              background: 'rgba(181,41,0,0.15)',
              color: 'var(--red-l)',
              border: '1px solid rgba(181,41,0,0.3)',
              marginBottom: 16,
            }}
          >
            Edition 1 · May 2026 · Chennai
          </div>

          {/* Title */}
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, lineHeight: 1.3, color: 'var(--text)', marginBottom: 6 }}>
            Dead Song Resurrection Project
          </h2>

          {/* Subtitle */}
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--muted)', marginBottom: 16 }}>
            Reviving songs we think people stopped playing.
          </p>

          {/* Divider */}
          <div style={{ width: 32, height: 1, background: 'var(--border)', marginBottom: 16 }} />

          {/* Body copy */}
          <p style={{ fontSize: '0.75rem', lineHeight: 1.7, color: 'var(--muted)', marginBottom: 12 }}>
            Drop a song pin on this map. Share a personal story — let Chennai know. Together, let's see where music is quietly pulsating across this city. One memory at a time.
          </p>
          <p style={{ fontSize: '0.75rem', lineHeight: 1.7, color: 'var(--muted)', marginBottom: 20 }}>
            When the map fills up, we all get in a room. Belong curates the setlist from everything you've dropped — and we revisit them live, together.
          </p>

          {/* Edition hint */}
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 4 }}>
            Edition 1 · Bollywood, Hindi &amp; Desi
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 24 }}>
            Edition 2 · Who knows — maybe it's your language next.
          </p>

          {/* CTA 1 */}
          <button
            onClick={() => navigate('/map')}
            style={{
              width: '100%', padding: '14px 0',
              borderRadius: 16, fontWeight: 700, fontSize: '0.875rem',
              background: 'var(--red)', color: 'var(--text)',
              border: 'none', cursor: 'pointer', marginBottom: 10,
            }}
          >
            Start the resurrection
          </button>

          {/* CTA 2 */}
          <button
            onClick={() => navigate('/stories')}
            style={{
              width: '100%', padding: '12px 0',
              borderRadius: 16, fontSize: '0.75rem', fontWeight: 500,
              border: '1px solid var(--border)', color: 'var(--muted)',
              background: 'transparent', cursor: 'pointer', marginBottom: 20,
            }}
          >
            Take a quick glance at Chennai's Musical Storyboard →
          </button>

          {/* ── Watch bifurcation ────────────────────────────── */}
          <div style={{ width: '100%', height: 1, background: 'var(--border)', marginBottom: 14 }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span
              style={{
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'var(--red-l)',
                animation: 'watchGlow 1.8s ease-in-out infinite',
              }}
            >
              Watch
            </span>
            <svg
              className="animate-bounce"
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ color: 'var(--muted)' }}
            >
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* ── Video peek ──────────────────────────────────────── */}
        <div
          style={{
            position: 'relative',
            height: 360,
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* iframe — portrait, top 260px visible, non-interactive */}
          <iframe
            src={VIMEO_SRC}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            style={{
              width: 'min(360px, 90vw)',
              height: `calc(min(360px, 90vw) * 16 / 9)`,
              flexShrink: 0,
              borderRadius: 12,
              display: 'block',
              pointerEvents: 'none',
            }}
            title="Belong. — Why this exists"
          />

          {/* Gradient fade to bg */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, var(--bg) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Transparent click overlay — full video area taps to /about */}
          <div
            onClick={() => navigate('/about')}
            style={{
              position: 'absolute', inset: 0,
              zIndex: 3,
              cursor: 'pointer',
            }}
          />
        </div>

        {/* ── About Belong button — below the video ─────────── */}
        <div
          style={{
            maxWidth: 384, margin: '12px auto 0',
            padding: '0 20px 24px',
          }}
        >
          <button
            onClick={() => navigate('/about')}
            style={{
              width: '100%', padding: '12px 0',
              borderRadius: 16, fontSize: '0.75rem', fontWeight: 500,
              border: '1px solid var(--border)', color: 'var(--muted)',
              background: 'transparent', cursor: 'pointer',
            }}
          >
            About Belong? →
          </button>
        </div>

        {/* ── Copyright footer ────────────────────────────────── */}
        <p style={{
          fontSize: '0.6rem',
          color: 'rgba(138,126,120,0.35)',
          letterSpacing: '0.08em',
          textAlign: 'center',
          padding: '0.5rem 0 1.5rem',
          margin: 0,
        }}>
          © 2026 Belong. · Concept & curation by Rounak Goel · @belong.chennai
        </p>

      </div>
    </div>
  )
}
