import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EDITION_ID } from '../lib/constants'

export function useEdition() {
  const [edition, setEdition] = useState(null)

  useEffect(() => {
    supabase
      .from('editions')
      .select('*')
      .eq('id', EDITION_ID)
      .single()
      .then(({ data }) => { if (data) setEdition(data) })
  }, [])

  return edition
}
