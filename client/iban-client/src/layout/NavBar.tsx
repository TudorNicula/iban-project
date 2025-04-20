import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function NavBar() {
  const { role, assignedRaion, setToken } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    setToken(null)
    navigate('/login')
  }

  const links = [
    { to: '/', label: 'Registru IBAN', shown: true },
    { to: '/admin', label: 'Admin Panel', shown: role === 'Admin' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              IBAN<span className="text-gray-500 dark:text-gray-300">Portal</span>
            </Link>
            <nav className="hidden md:flex md:ml-8 space-x-4">
              {links.map(
                (l) =>
                  l.shown && (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {l.label}
                    </Link>
                  )
              )}
            </nav>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {role && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Rol: <span className="font-semibold text-gray-800 dark:text-gray-200">{role}</span>
                {role === 'OperatorRaion' && assignedRaion && (
                  <> | Raion: <span className="font-semibold">{assignedRaion}</span></>
                )}
              </p>
            )}
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-1 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        show={mobileOpen}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95 -translate-y-2"
        enterTo="opacity-100 scale-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100 translate-y-0"
        leaveTo="opacity-0 scale-95 -translate-y-2"
      >
        <nav className="md:hidden bg-white dark:bg-gray-900 px-2 pt-2 pb-4 space-y-1">
          {links.map(
            (l) =>
              l.shown && (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  {l.label}
                </Link>
              )
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {role && (
              <p className="px-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                Rol: <span className="font-semibold">{role}</span>
                {role === 'OperatorRaion' && assignedRaion && <> | {assignedRaion}</>}
              </p>
            )}
            <button
              onClick={() => {
                handleLogout()
                setMobileOpen(false)
              }}
              className="mt-2 w-full bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </nav>
      </Transition>
    </header>
  )
}
