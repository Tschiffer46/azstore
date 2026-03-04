import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export type UserRole = 'admin' | 'manager' | 'viewer'

export interface User {
  username: string
  role: UserRole
}

interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

// Hardcoded users for POC
const USERS: Array<User & { password: string }> = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
  { username: 'viewer', password: 'viewer123', role: 'viewer' },
]

const SESSION_KEY = 'azstore_user'

function loadUserFromSession(): User | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(loadUserFromSession)

  const login = useCallback((username: string, password: string): boolean => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password,
    )
    if (!found) return false
    const u: User = { username: found.username, role: found.role }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(u))
    setUser(u)
    return true
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
