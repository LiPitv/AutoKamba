import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../services/api'
import { authApi } from '../services'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (token: string, user: User) => void
  setUser: (user: User | null) => void
  refreshUser: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ak_token')
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem('ak_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = (token: string, user: User) => {
    localStorage.setItem('ak_token', token)
    setUser(user)
  }

  const refreshUser = async () => {
    const { user } = await authApi.me()
    setUser(user)
  }

  const logout = () => {
    api.post('/auth/logout').catch(() => undefined)
    localStorage.removeItem('ak_token')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, setUser, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}