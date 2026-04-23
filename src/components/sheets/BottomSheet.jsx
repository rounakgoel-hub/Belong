import { useEffect, useRef } from 'react'

export default function BottomSheet({ open, onClose, children, maxHeight = '90vh', noDrag = false }) {
  const overlayRef = useRef()

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full rounded-t-3xl flex flex-col"
        style={{
          background: '#221E1C',
          maxHeight,
          animation: 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
          border: '1px solid rgba(255,249,239,0.08)',
          borderBottom: 'none',
        }}
      >
        {/* Handle */}
        {!noDrag && (
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,249,239,0.15)' }} />
          </div>
        )}

        <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
