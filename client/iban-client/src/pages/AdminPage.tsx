import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '../hooks/useAuth'

type User = {
  id: number
  fullName: string
  email: string
  role: string
  assignedRaion: string | null
}

const roles = ['Admin', 'Operator', 'OperatorRaion']

const AdminPage = () => {
  const { token } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'Operator',
    assignedRaion: '',
  })
  const [error, setError] = useState('')

  // Fetch users with error toast
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get<User[]>('http://localhost:5141/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data)
    } catch {
      console.error('Eroare la încărcarea utilizatorilor.')
      toast.error('Eroare la încărcarea utilizatorilor.')
    }
  }, [token])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleCreate = async () => {
    setError('')
    if (!form.fullName || !form.email || !form.password) {
      setError('Completează toate câmpurile.')
      return
    }

    try {
      await axios.post(
        'http://localhost:5141/users',
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
          assignedRaion:
            form.role === 'OperatorRaion' ? form.assignedRaion : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // success toast
      toast.success('Utilizator creat cu succes!')

      // reset form & refresh list
      setForm({
        fullName: '',
        email: '',
        password: '',
        role: 'Operator',
        assignedRaion: '',
      })
      fetchUsers()
    } catch (err: unknown) {
      let message = 'Eroare la crearea utilizatorului.'
      if (axios.isAxiosError(err) && err.response?.data?.title) {
        message = err.response.data.title
      }
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Toast container */}
      <ToastContainer position="top-right" />

      <h2 className="text-2xl font-semibold text-gray-800">
        Admin Panel – Gestionare Utilizatori
      </h2>

      {/* Create User Form */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-lg font-medium text-gray-700">
          Adaugă Utilizator Nou
        </h3>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="fullName"
            placeholder="Nume Complet"
            value={form.fullName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <input
            name="password"
            type="password"
            placeholder="Parolă"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {form.role === 'OperatorRaion' && (
            <input
              name="assignedRaion"
              placeholder="Raion Atribuit"
              value={form.assignedRaion}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          )}
        </div>

        <button
          onClick={handleCreate}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md transition"
        >
          Creare Utilizator
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Lista Utilizatori
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Nume', 'Email', 'Rol', 'Raion'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {u.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {u.fullName}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {u.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {u.role}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {u.assignedRaion || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminPage
