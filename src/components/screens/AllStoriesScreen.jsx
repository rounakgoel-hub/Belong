import { useNavigate } from 'react-router-dom'
import { usePins } from '../../hooks/usePins'
import Avatar from '../ui/Avatar'

export default function AllStoriesScreen() {
  const navigate = useNavigate()
  const { pins, loading } = usePins()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#1A1614' }}>
      {/* Header */}
      <div className="px-5 pt-10 pb-4" style={{ borderBottom: '1px solid rgba(255,249,239,0.06)' }}>
        <button onClick={() => navigate('/map')} className="text-muted text-sm mb-4 flex items-center gap-1">
          ← Back to map
        </button>
        <h1 className="text-cream font-extrabold text-xl leading-tight">
          Every dead song.<br />Every memory. One stage.
        </h1>
        <p className="text-muted text-xs mt-1">{pins.length} song{pins.length !== 1 ? 's' : ''} dropped</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">
        {loading && (
          <p className="text-muted text-sm text-center py-8">Loading the stage…</p>
        )}

        {!loading && pins.length === 0 && (
          <div className="text-center py-16">
            <div
              className="w-3 h-3 rounded-full mx-auto mb-4"
              style={{ background: '#B52900', animation: 'pulse 2s ease-in-out infinite' }}
            />
            <p className="text-muted text-sm">The stage is empty. Start the resurrection.</p>
          </div>
        )}

        {pins.map(pin => (
          <div
            key={pin.id}
            className="flex gap-3 py-4"
            style={{ borderBottom: '1px solid rgba(255,249,239,0.06)' }}
          >
            <Avatar handle={pin.handle} size={40} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-cream font-bold text-base leading-tight">{pin.song_name}</p>
                <span className="text-muted text-xs flex-shrink-0 pt-0.5">{pin.resonance_count} 〰</span>
              </div>
              {pin.artist && <p className="text-muted text-xs mb-1">{pin.artist}</p>}
              <p className="text-xs mb-2" style={{ color: '#5C524E' }}>
                {pin.handle || 'Anonymous'} · Chennai
              </p>
              {pin.memory && (
                <p className="text-sm italic leading-relaxed" style={{ color: '#9A8E88' }}>
                  "{pin.memory}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
