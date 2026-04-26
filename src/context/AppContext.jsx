import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { EDITION_ID } from '../lib/constants'
import { getAnonId } from '../lib/anonId'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // ── Theme ──────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('belong_theme_v2') || 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [])

  function toggleTheme() {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('belong_theme_v2', next)
      document.documentElement.classList.toggle('light', next === 'light')
      return next
    })
  }

  // ── Pins + interest ────────────────────────────────────────
  const [pins, setPins] = useState([])
  const [pinsLoading, setPinsLoading] = useState(true)
  const [interestCount, setInterestCount] = useState(0)
  const [interested, setInterested] = useState(false)

  // Pending realtime events — flushed in a single batch after 150ms of quiet
  const pending = useRef({ inserts: [], updates: [], deletes: [] })
  const flushTimer = useRef(null)
  const anonId = getAnonId()

  useEffect(() => {
    let cancelled = false

    function flushPins() {
      flushTimer.current = null
      const { inserts, updates, deletes } = pending.current
      pending.current = { inserts: [], updates: [], deletes: [] }

      setPins(prev => {
        let next = prev
        for (const pin of inserts) {
          if (pin.edition_id === EDITION_ID && !next.find(p => p.id === pin.id)) {
            next = [pin, ...next]
          }
        }
        for (const pin of updates) {
          if (pin.edition_id === EDITION_ID) {
            next = next.map(p => p.id === pin.id ? pin : p)
          }
        }
        for (const pin of deletes) {
          next = next.filter(p => p.id !== pin.id)
        }
        // Skip re-render if nothing actually changed
        return next === prev ? prev : next
      })
    }

    function schedulePinsFlush() {
      if (!flushTimer.current) {
        flushTimer.current = setTimeout(flushPins, 150)
      }
    }

    // ── Initial fetches ──────────────────────────────────────
    supabase
      .from('pins')
      .select('*')
      .eq('edition_id', EDITION_ID)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        if (data) setPins(data)
        setPinsLoading(false)
      })

    supabase
      .from('interest')
      .select('*', { count: 'exact', head: true })
      .eq('edition_id', EDITION_ID)
      .then(({ count: n }) => { if (!cancelled && n != null) setInterestCount(n) })

    supabase
      .from('interest')
      .select('id')
      .eq('edition_id', EDITION_ID)
      .eq('anon_id', anonId)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled && data) setInterested(true) })

    // ── Single shared realtime channel ───────────────────────
    // All .on() callbacks must be chained before .subscribe()
    const channel = supabase
      .channel('belong-app')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pins' }, ({ new: pin }) => {
        pending.current.inserts.push(pin)
        schedulePinsFlush()
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pins' }, ({ new: pin }) => {
        pending.current.updates.push(pin)
        schedulePinsFlush()
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'pins' }, ({ old: pin }) => {
        pending.current.deletes.push(pin)
        schedulePinsFlush()
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'interest' }, ({ new: row }) => {
        if (row.edition_id === EDITION_ID) setInterestCount(n => n + 1)
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'interest' }, ({ old: row }) => {
        if (row.edition_id === EDITION_ID) setInterestCount(n => Math.max(0, n - 1))
      })
      .subscribe()

    return () => {
      cancelled = true
      clearTimeout(flushTimer.current)
      supabase.removeChannel(channel)
    }
  }, [])

  async function registerInterest(toast, message) {
    if (interested) {
      // Toggle off — optimistic update, then delete
      setInterested(false)
      setInterestCount(n => Math.max(0, n - 1))
      await supabase
        .from('interest')
        .delete()
        .eq('edition_id', EDITION_ID)
        .eq('anon_id', anonId)
      return
    }

    const { error } = await supabase
      .from('interest')
      .insert({ edition_id: EDITION_ID, anon_id: anonId })

    if (!error) {
      setInterested(true)
      setInterestCount(n => n + 1)
      toast?.(message || "You're in. See you at the show \u266a")
    }
  }

  return (
    <AppContext.Provider value={{ theme, toggleTheme, pins, pinsLoading, interestCount, interested, registerInterest }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider')
  return ctx
}
