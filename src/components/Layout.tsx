import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { label: 'Dashboard', to: '/' },
    { label: 'Produkter', to: '/products' },
    { label: 'Klubbar', to: '/clubs' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 shadow-lg shadow-black/50' : 'bg-black'
        } border-b border-[#1A1A1A]`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-white font-bold text-xl">
                <span className="text-[#4BC8D8]">AZ</span> STORE
              </Link>
              {/* Desktop nav links */}
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === link.to
                        ? 'text-[#4BC8D8]'
                        : 'text-[#A0A0A0] hover:text-[#4BC8D8]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm text-[#A0A0A0]">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-[#A0A0A0] hover:text-red-400 transition-colors"
              >
                Logga ut
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-[#1A1A1A]">
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-[#4BC8D8]'
                      : 'text-[#A0A0A0] hover:text-[#4BC8D8]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-[#1A1A1A] flex items-center justify-between">
                <span className="text-sm text-[#A0A0A0]">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#A0A0A0] hover:text-red-400 transition-colors"
                >
                  Logga ut
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <Outlet />
      </main>
    </div>
  )
}
