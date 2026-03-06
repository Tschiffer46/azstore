import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(username, password)
    if (ok) {
      navigate('/')
    } else {
      setError('Felaktigt användarnamn eller lösenord.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#111111] border border-[#1A1A1A] rounded-lg p-8 w-full max-w-sm shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-[#4BC8D8]">AZ</span> STORE
          </h1>
          <p className="text-[#A0A0A0] text-sm mt-1">Logga in</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-[#A0A0A0] mb-1"
            >
              Användarnamn
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4BC8D8] placeholder-[#555]"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#A0A0A0] mb-1"
            >
              Lösenord
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1A1A1A] rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#4BC8D8] placeholder-[#555]"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#4BC8D8] text-black py-2 rounded font-medium hover:bg-[#3ab5c4] transition-colors"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  )
}
