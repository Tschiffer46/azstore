import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-lg font-bold text-blue-700 hover:text-blue-900"
              >
                AZStore
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium text-gray-700 hover:text-blue-700"
              >
                Produkter
              </Link>
              <Link
                to="/clubs"
                className="text-sm font-medium text-gray-700 hover:text-blue-700"
              >
                Klubbar
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
