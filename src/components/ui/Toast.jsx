import { useEffect, useState } from 'react'

// message: string
// duration: ms before dismissing (default 3000)
// loading: show a pulsing dot prefix (for "in progress" feedback)
export default function Toast({ message, duration = 3000, loading = false, onDone }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 300) }, duration)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="fixed bottom-24 left-1/2 z-[9999] px-5 py-3 rounded-2xl text-sm font-medium shadow-xl pointer-events-none"
      style={{
        transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s, transform 0.3s',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        maxWidth: '88vw',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
      }}
    >
      {loading && (
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{
            background: 'var(--red)',
            animation: 'pulse 1s ease-in-out infinite',
          }}
        />
      )}
      {message}
    </div>
  )
}
