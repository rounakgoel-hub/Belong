import { useEffect, useRef } from 'react'
import { useDragToDismiss } from '../../hooks/useDragToDismiss'

export default function BottomSheet({ open, onClose, children, maxHeight = '90vh' }) {
  const scrollRef = useRef(null)
  const { sheetHandlers, sheetStyle } = useDragToDismiss(onClose, scrollRef)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 flex flex-col justify-end" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Sheet — drag anywhere on this to dismiss */}
      <div
        className="relative w-full rounded-t-3xl flex flex-col"
        style={{
          background: 'var(--surface)',
          maxHeight,
          border: '1px solid var(--border)',
          borderBottom: 'none',
          animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
          ...sheetStyle,
        }}
        {...sheetHandlers}
      >
        {/* Handle — visual only */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.2)' }} />
        </div>

        {/* Scrollable content — ref tracked so drag doesn't fire when scrolled */}
        <div
          ref={scrollRef}
          className="overflow-y-auto flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
