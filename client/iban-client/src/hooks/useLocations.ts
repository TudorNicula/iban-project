import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from './useAuth'

export type Raion = { id: number; name: string }
export type Localitate = { id: number; name: string; raionId: number }

const BASE = 'http://localhost:5141/api/locations'

export function useRaioane(): Raion[] {
  const { token } = useAuth()
  const [raioane, setRaioane] = useState<Raion[]>([])
  useEffect(() => {
    axios
      .get<Raion[]>(`${BASE}/raioane`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setRaioane(res.data))
      .catch((err) => console.error('Failed loading raions:', err))
  }, [token])
  return raioane
}

export function useLocalitati(raionId?: number): Localitate[] {
  const { token } = useAuth()
  const [localitati, setLocalitati] = useState<Localitate[]>([])
  useEffect(() => {
    if (!raionId) {
      setLocalitati([])
      return
    }
    axios
      .get<Localitate[]>(`${BASE}/raioane/${raionId}/localitati`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLocalitati(res.data))
      .catch((err) => console.error('Failed loading localitati:', err))
  }, [token, raionId])
  return localitati
}

export function useAllLocalitati(): Localitate[] {
    const { token } = useAuth()
    const [all, setAll] = useState<Localitate[]>([])
    useEffect(() => {
      axios
        .get<Localitate[]>(`${BASE}/localitati`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => setAll(r.data))
        .catch(console.error)
    }, [token])
    return all
  }