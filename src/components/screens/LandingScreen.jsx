import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'

export default function LandingScreen() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useAppContext()

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'var(--bg)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 20,
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--surface2)',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(181,41,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col px-5 pt-10 pb-10 w-full max-w-sm mx-auto">
        {/* Wordmark */}
        <div className="mb-5">
          <h1 className="font-extrabold leading-none" style={{ fontSize: 38, color: 'var(--text)' }}>
            Belong<span style={{ color: 'var(--red)' }}>.</span>
          </h1>
          <p className="text-xs mt-1.5 tracking-wide" style={{ color: 'var(--muted)' }}>powered by music, held by people</p>
        </div>

        {/* Edition pill */}
        <div
          className="self-start px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: 'rgba(181,41,0,0.15)', color: 'var(--red-l)', border: '1px solid rgba(181,41,0,0.3)' }}
        >
          Edition 1 · May 2026 · Chennai
        </div>

        {/* Title block */}
        <h2 className="font-extrabold text-xl leading-snug mb-1.5" style={{ color: 'var(--text)' }}>
          Dead Song Resurrection Project
        </h2>

        {/* Subtitle — italic */}
        <p className="text-sm leading-relaxed mb-4 italic" style={{ color: 'var(--muted)' }}>
          Reviving songs we think people stopped playing.
        </p>

        {/* Divider */}
        <div className="w-8 h-px mb-4" style={{ background: 'var(--border)' }} />

        {/* Body copy */}
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--muted)' }}>
          Drop a song pin on this map. Share a personal story — let Chennai know. Together, let's see where music is quietly pulsating across this city. One memory at a time.
        </p>
        <p className="text-xs leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
          When the map fills up, we all get in a room. Belong curates the setlist from everything you've dropped — and we revisit them live, together.
        </p>

        {/* Edition hint */}
        <p className="text-xs mb-1" style={{ color: 'var(--muted)' }}>
          Edition 1 · Bollywood, Hindi &amp; Desi
        </p>
        <p className="text-xs mb-5" style={{ color: 'var(--muted)' }}>
          Edition 2 · Who knows — maybe it's your language next.
        </p>

        {/* CTAs */}
        <button
          onClick={() => navigate('/map')}
          className="w-full py-3.5 rounded-2xl font-bold text-sm mb-2.5"
          style={{ background: 'var(--red)', color: 'var(--text)' }}
        >
          Start the resurrection
        </button>

        <button
          onClick={() => navigate('/stories')}
          className="w-full py-3 rounded-2xl text-xs font-medium"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
        >
          Take a quick glance at Chennai's Musical Storyboard →
        </button>
      </div>
    </div>
  )
}
