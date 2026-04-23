import { useState, useCallback } from 'react'
import Toast from './Toast'

let _push = null

export function useToast() {
  return useCallback((msg) => { if (_push) _push(msg) }, [])
}

export default function ToastManager() {
  const [toasts, setToasts] = useState([])

  _push = (message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
  }

  function remove(id) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} onDone={() => remove(t.id)} />
      ))}
    </>
  )
}
