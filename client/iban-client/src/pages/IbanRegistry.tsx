import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { toast, ToastContainer } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
import { IbanCode } from '../types/Iban'
import FilterCombobox from '../components/FilterCombobox'
import CreateIbanForm from '../components/CreateIbanForm'
import { exportToCsv } from '../utils/exportToCsv'
import { useRaioane, useLocalitati, useAllLocalitati } from '../hooks/useLocations'
import 'react-toastify/dist/ReactToastify.css'
import 'sweetalert2/src/sweetalert2.scss'

export default function IbanRegistry() {
  const { token, role, assignedRaion } = useAuth()

  // filter state
  const [year, setYear] = useState('')
  const [codEco, setCodEco] = useState('')
  const [selectedRaionId, setSelectedRaionId] = useState<number>()
  const [localitate, setLocalitate] = useState('')
  // lazy-load all localitati only when needed
  const [editTarget, setEditTarget] = useState<IbanCode | null>(null)

  // dropdown options
  const [years, setYears] = useState<string[]>([])
  const [codEcos, setCodEcos] = useState<string[]>([])
  const raions = useRaioane()
  // cascade localitati: by raion or all
  const localitatiByRaion = useLocalitati(selectedRaionId)
  // always load the full list of localitati (cached by the hook) and also support filtering by raion
  const allLocalitati = useAllLocalitati()
  const localitati = selectedRaionId ? localitatiByRaion : allLocalitati

  // on mount load years & codEcos
  useEffect(() => {
    axios
      .get<IbanCode[]>('http://localhost:5141/iban', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data
        setYears(Array.from(new Set(data.map((i) => i.year.toString()))).sort((a, b) => +b - +a))
        setCodEcos(Array.from(new Set(data.map((i) => i.codEco))))
      })
      .catch(() => toast.error('Eroare la încărcarea opțiunilor'))
  }, [token])

  // fetch registry when you click “Caută”
  const fetchIbans = useCallback(async () => {
    try {
      const params: any = { year, codEco, localitate }
      if (selectedRaionId) {
        const r = raions.find((r) => r.id === selectedRaionId)
        if (r) params.raion = r.name
      }
      const { data } = await axios.get<IbanCode[]>('http://localhost:5141/iban', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      })
      setIbans(data)
    } catch {
      toast.error('Eroare la încărcarea registrului')
    }
  }, [token, year, codEco, localitate, selectedRaionId, raions])

  // auto-set for OperatorRaion
  useEffect(() => {
    if (role === 'OperatorRaion' && assignedRaion) {
      const r = raions.find((r) => r.name === assignedRaion)
      if (r) setSelectedRaionId(r.id)
    }
  }, [role, assignedRaion, raions])

  // delete
  const handleDelete = async (id: number) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Ștergere cod IBAN',
      text: 'Sigur vrei să ștergi acest cod IBAN?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Da, șterge',
      cancelButtonText: 'Nu, renunț',
      reverseButtons: true,
    })
    if (!isConfirmed) return

    try {
      await axios.delete(`http://localhost:5141/iban/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('IBAN șters cu succes!')
      fetchIbans()
    } catch {
      toast.error('Nu am putut șterge IBAN‑ul.')
    }
  }

  // export
  const handleExport = () => {
    const clean = ibans.map(({ id, iban, year, codEco, raion, localitate, createdBy }) => ({
      ID: id,
      IBAN: iban,
      An: year,
      CodEco: codEco,
      Raion: raion,
      Localitate: localitate,
      CreatDe: createdBy,
    }))
    exportToCsv('registru-iban.csv', clean)
    toast.info('CSV exportat cu succes!')
  }

  const [ibans, setIbans] = useState<IbanCode[]>([])

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-8">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Registrul IBAN</h2>
        {role !== 'OperatorRaion' && (
          <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            📥 Exportă CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded shadow flex flex-wrap gap-4">
        <FilterCombobox label="An" options={years} value={year} onChange={setYear} />
        <FilterCombobox label="Cod Eco" options={codEcos} value={codEco} onChange={setCodEco} />
        <FilterCombobox
          label="Raion"
          options={raions.map((r) => r.name)}
          value={selectedRaionId ? raions.find((r) => r.id === selectedRaionId)!.name : ''}
          onChange={(name) => {
            const f = raions.find((r) => r.name === name)
            setSelectedRaionId(f?.id)
            setLocalitate('')
          }}
          disabled={role === 'OperatorRaion'}
        />
        <FilterCombobox
          label="Localitate"
          options={localitati.map((l) => l.name)}
          value={localitate}
          onChange={(name) => {
            setLocalitate(name)
            // auto-select raion when choosing a localitate
            const found = localitati.find((l) => l.name === name)
            if (found) {
              setSelectedRaionId(found.raionId)
            }
          }}
          infinite
          pageSize={50}
        />

        <button onClick={fetchIbans} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Caută
        </button>
      </div>

      {/* Create/Edit */}
      {role !== 'OperatorRaion' && (
        <div className="bg-white p-6 rounded shadow">
          <CreateIbanForm
            initialData={editTarget}
            onSuccess={() => {
              setEditTarget(null)
              fetchIbans()
            }}
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-white p-6 rounded shadow overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'IBAN', 'An', 'Cod Eco', 'Raion', 'Localitate', 'Acțiuni'].map((h) => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {ibans.map((i) => (
              <tr key={i.id}>
                <td className="px-6 py-4">{i.id}</td>
                <td className="px-6 py-4">{i.iban}</td>
                <td className="px-6 py-4">{i.year}</td>
                <td className="px-6 py-4">{i.codEco}</td>
                <td className="px-6 py-4">{i.raion}</td>
                <td className="px-6 py-4">{i.localitate}</td>
                <td className="px-6 py-4 space-x-2">
                  {(role === 'Admin' || role === 'Operator') && (
                    <>
                      <button onClick={() => setEditTarget(i)}>✏️</button>
                      <button onClick={() => handleDelete(i.id)}>🗑️</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
