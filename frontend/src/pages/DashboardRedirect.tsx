import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/app/admin" replace />
  if (user.role === 'prestador') return <Navigate to="/app/dashboard" replace />
  return <Navigate to="/app/pedir-assistencia" replace />
}