import { useState, useEffect } from 'react'
import { WIPE_DATE, daysUntil } from '../../lib/constants'

export default function CountdownStrip() {
  const [days, setDays] = useState(daysUntil(WIPE_DATE))
  const [blink, setBlink] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setBlink(b => !b), 800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-between px-4 py-2 text-xs font-medium text-muted"
      style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div className="flex items-center gap-2">
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--red)', opacity: blink ? 1 : 0.2, transition: 'opacity 0.3s' }}
        />
        <span>Map resets in {days} day{days !== 1 ? 's' : ''}, to make room for the next edition · Curate Chennai's first crowdsourced live setlist</span>
      </div>
      <span className="text-cream font-semibold ml-3 flex-shrink-0">{days}d</span>
    </div>
  )
}
