import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[9999] px-5 py-3 rounded-2xl text-sm font-medium text-cream shadow-xl pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s, transform 0.3s',
        background: 'var(--surface)',
        border: '1px solid rgba(255,249,239,0.12)',
        maxWidth: '88vw',
        textAlign: 'center',
      }}
    >
      {message}
    </div>
  )
}
