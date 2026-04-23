import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getAnonId } from '../lib/anonId'

export function useResonance(pin, onToast) {
  const [count, setCount] = useState(pin?.resonance_count ?? 0)
  const [resonated, setResonated] = useState(false)
  const [totalGiven, setTotalGiven] = useState(0)

  async function toggle() {
    const anon_id = getAnonId()

    if (resonated) {
      await supabase.from('resonances').delete().match({ pin_id: pin.id, anon_id })
      await supabase.from('pins').update({ resonance_count: count - 1 }).eq('id', pin.id)
      setCount(c => c - 1)
      setResonated(false)
    } else {
      const { error } = await supabase.from('resonances').insert({ pin_id: pin.id, anon_id })
      if (!error) {
        await supabase.from('pins').update({ resonance_count: count + 1 }).eq('id', pin.id)
        setCount(c => c + 1)
        setResonated(true)
        const next = totalGiven + 1
        setTotalGiven(next)
        if (next >= 5 && onToast) onToast('You feel deeply. The room needs people like you.')
      }
    }
  }

  return { count, resonated, toggle }
}
