import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProfessionalDashboardPage from './professional/ProfessionalDashboardPage'

export default function DashboardHome() {
  const { user } = useAuth()
  if (user?.role === 'prestador') return <ProfessionalDashboardPage />
  return <Navigate to="/app/pedir-assistencia" replace />
}