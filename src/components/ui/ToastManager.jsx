import { useState, useCallback } from 'react'
import Toast from './Toast'

let _push = null

// toast('message')  — standard 3s toast
// toast({ message, duration, loading })  — configurable
export function useToast() {
  return useCallback((msg) => { if (_push) _push(msg) }, [])
}

export default function ToastManager() {
  const [toasts, setToasts] = useState([])

  _push = (input) => {
    const id = Date.now()
    const entry = typeof input === 'string'
      ? { id, message: input }
      : { id, ...input }
    setToasts(prev => [...prev, entry])
  }

  function remove(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          duration={t.duration}
          loading={t.loading}
          onDone={() => remove(t.id)}
        />
      ))}
    </>
  )
}
