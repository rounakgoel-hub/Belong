import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EDITION_ID } from '../lib/constants'

export function usePins() {
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('pins')
      .select('*')
      .eq('edition_id', EDITION_ID)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setPins(data)
        setLoading(false)
      })

    const channel = supabase
      .channel('pins-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pins' }, ({ new: pin }) => {
        if (pin.edition_id === EDITION_ID) setPins(prev => [pin, ...prev])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'pins' }, ({ new: pin }) => {
        if (pin.edition_id === EDITION_ID) setPins(prev => prev.map(p => p.id === pin.id ? pin : p))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return { pins, loading }
}
