import { useRef, useState, useCallback } from 'react'

const DISMISS_THRESHOLD = 40

export function useDragToDismiss(onClose, scrollRef) {
  const [dy, setDy] = useState(0)
  const startY = useRef(null)

  const onTouchStart = useCallback((e) => {
    // If inner content is scrolled down, don't start a dismiss gesture
    if (scrollRef?.current && scrollRef.current.scrollTop > 2) return
    startY.current = e.touches[0].clientY
  }, [scrollRef])

  const onTouchMove = useCallback((e) => {
    if (startY.current === null) return
    // Cancel if user scrolled the content while dragging
    if (scrollRef?.current && scrollRef.current.scrollTop > 2) {
      startY.current = null
      setDy(0)
      return
    }
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0) setDy(delta)
  }, [scrollRef])

  const onTouchEnd = useCallback(() => {
    if (dy > DISMISS_THRESHOLD) {
      setDy(0)
      onClose()
    } else {
      setDy(0)
    }
    startY.current = null
  }, [dy, onClose])

  return {
    sheetHandlers: { onTouchStart, onTouchMove, onTouchEnd },
    sheetStyle: {
      transform: dy > 0 ? `translateY(${dy}px)` : 'translateY(0)',
      transition: dy > 0 ? 'none' : 'transform 0.22s cubic-bezier(0.32,0.72,0,1)',
    },
  }
}
