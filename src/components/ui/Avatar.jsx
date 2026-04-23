import { pinColor, initials } from '../../lib/constants'

export default function Avatar({ handle, size = 32, className = '' }) {
  const seed = handle || '♪'
  const bg = pinColor(seed)
  const text = initials(handle)

  return (
    <div
      className={`flex items-center justify-center rounded-full font-bold select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size, background: bg, fontSize: size * 0.38 }}
    >
      <span className="text-cream">{text}</span>
    </div>
  )
}
