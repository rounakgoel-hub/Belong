import { useNavigate } from 'react-router-dom'

export default function LandingScreen() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: '#1A1614', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Faint map background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 60% 40%, rgba(181,41,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col px-6 py-12 max-w-md mx-auto w-full">
        {/* Wordmark */}
        <div className="mb-8">
          <h1 className="font-extrabold leading-none" style={{ fontSize: 56, color: '#FFF9EF' }}>
            Belong<span style={{ color: '#B52900' }}>.</span>
          </h1>
          <p className="text-muted text-sm mt-2 tracking-wide">powered by music, held by people</p>
        </div>

        {/* Edition pill */}
        <div
          className="self-start px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{ background: 'rgba(181,41,0,0.15)', color: '#E05A35', border: '1px solid rgba(181,41,0,0.3)' }}
        >
          Edition 1 · May 2026 · Chennai
        </div>

        {/* Title block */}
        <h2 className="font-extrabold text-3xl leading-tight mb-3" style={{ color: '#FFF9EF' }}>
          Dead Song Resurrection Project
        </h2>
        <p className="text-muted text-base leading-relaxed mb-6">
          Reviving songs we think people stopped playing.
        </p>

        {/* Divider */}
        <div className="w-12 h-px mb-6" style={{ background: 'rgba(255,249,239,0.12)' }} />

        {/* Hook + body */}
        <p className="font-semibold text-base mb-4" style={{ color: '#FFF9EF' }}>
          You know a song you think people stopped playing?
        </p>
        <p className="text-muted text-sm leading-relaxed mb-4">
          Drop a song pin on this map. Share a personal story if you feel you have one — let Chennai know. Together, let's see the how, the where, and what music is quietly pulsating across this city. One memory, one story at a time.
        </p>
        <p className="text-muted text-sm leading-relaxed mb-8">
          When the map fills up, we all get in a room. Belong curates the setlist from everything you've dropped — and we revisit them live, together.
        </p>

        {/* Edition hint */}
        <p className="text-xs mb-8" style={{ color: '#5C524E' }}>
          Edition 1 · Bollywood, Hindi &amp; Desi / Edition 2 · Who knows — maybe it's your language next.
        </p>

        {/* CTAs */}
        <button
          onClick={() => navigate('/map')}
          className="w-full py-4 rounded-2xl font-bold text-cream text-base mb-3"
          style={{ background: '#B52900' }}
        >
          Start the resurrection
        </button>

        <button
          onClick={() => navigate('/map')}
          className="w-full py-3 rounded-2xl text-sm font-medium text-muted"
          style={{ border: '1px solid rgba(255,249,239,0.1)' }}
        >
          Take a quick glance at Chennai's Musical Storyboard →
        </button>
      </div>
    </div>
  )
}
