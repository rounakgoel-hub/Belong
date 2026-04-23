export default function ShareCard({ pin }) {
  const handle = pin?.handle || 'Anonymous'

  return (
    <div
      id="belong-share-card"
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #221E1C 0%, #1A1614 100%)',
        border: '1px solid rgba(255,249,239,0.1)',
        padding: '28px 24px',
        maxWidth: 360,
        width: '100%',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="text-cream font-extrabold text-xl tracking-tight">
          Belong<span style={{ color: '#B52900' }}>.</span>
        </span>
        <span className="text-muted text-xs">Ed.1 Chennai · belong.in</span>
      </div>

      {/* Song name */}
      <p className="text-cream font-extrabold text-2xl leading-tight mb-2">
        {pin?.song_name}
      </p>
      <p className="text-muted text-sm mb-5">{pin?.artist}</p>

      {/* Memory */}
      {pin?.memory && (
        <div
          className="mb-5 pl-4 text-sm italic leading-relaxed"
          style={{ color: '#C4B8B2', borderLeft: '2px solid #B52900' }}
        >
          "{pin.memory}"
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid rgba(255,249,239,0.08)' }}>
        <span className="text-muted text-xs">{handle} · Chennai</span>
        <span className="text-xs font-semibold" style={{ color: '#B52900' }}>Dead Song Resurrection</span>
      </div>
    </div>
  )
}
