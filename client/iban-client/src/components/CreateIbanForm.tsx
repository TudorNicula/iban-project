import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { IbanCode } from '../types/Iban'
import FilterCombobox from './FilterCombobox'
import { useRaioane, useLocalitati, useAllLocalitati } from '../hooks/useLocations'

type Props = {
  onSuccess: () => void
  initialData?: IbanCode | null
}

export default function CreateIbanForm({ onSuccess, initialData }: Props) {
  const { token } = useAuth()

  
  const [iban, setIban] = useState('')
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [codEco, setCodEco] = useState('')

  
  const raions = useRaioane()
  const [selectedRaionId, setSelectedRaionId] = useState<number>()
  
  const localitatiByRaion = useLocalitati(selectedRaionId)
  const allLocalitati = useAllLocalitati()
  const localitati = selectedRaionId ? localitatiByRaion : allLocalitati
  const [localitate, setLocalitate] = useState('')

  
  useEffect(() => {
    if (initialData) {
      setIban(initialData.iban)
      setYear(initialData.year)
      setCodEco(initialData.codEco)
      const r = raions.find((r) => r.name === initialData.raion)
      setSelectedRaionId(r?.id)
      setLocalitate(initialData.localitate)
    } else {
      setIban('')
      setYear(new Date().getFullYear())
      setCodEco('')
      setSelectedRaionId(undefined)
      setLocalitate('')
    }
  }, [initialData, raions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const raionName = selectedRaionId
      ? raions.find((r) => r.id === selectedRaionId)!.name
      : ''

    try {
      if (initialData) {
        await axios.put(
          `http://localhost:5141/iban/${initialData.id}`,
          { id: initialData.id, iban, year, codEco, raion: raionName, localitate },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success('IBAN actualizat cu succes!')
      } else {
        await axios.post(
          'http://localhost:5141/iban',
          { iban, year, codEco, raion: raionName, localitate },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        toast.success('IBAN adăugat cu succes!')
        
        setIban('')
        setYear(new Date().getFullYear())
        setCodEco('')
        setSelectedRaionId(undefined)
        setLocalitate('')
      }
      onSuccess()
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.title
          ? err.response.data.title
          : 'Eroare la salvare.'
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        {initialData ? 'Editează IBAN' : 'Adaugă Cod IBAN'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          value={iban}
          onChange={(e) => setIban(e.target.value)}
          placeholder="IBAN (24 caractere)"
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(+e.target.value)}
          placeholder="An"
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />
        <input
          value={codEco}
          onChange={(e) => setCodEco(e.target.value)}
          placeholder="Cod Eco"
          className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400"
        />

        <FilterCombobox
          label="Raion"
          options={raions.map((r) => r.name)}
          value={
            selectedRaionId
              ? raions.find((r) => r.id === selectedRaionId)!.name
              : ''
          }
          onChange={(name) => {
            const found = raions.find((r) => r.name === name)
            setSelectedRaionId(found?.id)
            setLocalitate('')
          }}
        />

        <FilterCombobox
          label="Localitate"
          options={localitati.map((l) => l.name)}
          value={localitate}
          onChange={(name) => {
            setLocalitate(name)
            
            const found = localitati.find((l) => l.name === name)
            if (found) {
              setSelectedRaionId(found.raionId)
            }
          }}
          infinite
          pageSize={50}
        />
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded">
        {initialData ? 'Salvează modificările' : 'Salvează'}
      </button>
    </form>
  )
}
