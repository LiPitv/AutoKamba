import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './components/Toast'
import { Spinner } from './components/ui'
import DashboardLayout from './layouts/DashboardLayout'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import RegisterDriverPage from './pages/RegisterDriverPage'
import RegisterProfessionalPage from './pages/RegisterProfessionalPage'
import ProfessionalPublicPage from './pages/ProfessionalPublicPage'
import RequestWizardPage from './pages/driver/RequestWizardPage'
import MyRequestsPage from './pages/driver/MyRequestsPage'
import RequestDetailPage from './pages/driver/RequestDetailPage'
import HistoryPage from './pages/HistoryPage'
import VehiclesPage from './pages/driver/VehiclesPage'
import FavoritesPage from './pages/driver/FavoritesPage'
import PaymentsPage from './pages/PaymentsPage'
import ReviewsPage from './pages/ReviewsPage'
import NotificationsPage from './pages/NotificationsPage'
import SupportPage from './pages/SupportPage'
import ProfilePage from './pages/ProfilePage'
import SafetyPage from './pages/driver/SafetyPage'
import AvailableRequestsPage from './pages/professional/AvailableRequestsPage'
import CurrentServicePage from './pages/professional/CurrentServicePage'
import EarningsPage from './pages/professional/EarningsPage'
import ProviderServicesPage from './pages/professional/ProviderServicesPage'
import DocumentsPage from './pages/professional/DocumentsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminProfessionalsPage from './pages/admin/AdminProfessionalsPage'
import AdminDriversPage from './pages/admin/AdminDriversPage'
import AdminRequestsPage from './pages/admin/AdminRequestsPage'
import AdminComplaintsPage from './pages/admin/AdminComplaintsPage'
import AdminPromotionsPage from './pages/admin/AdminPromotionsPage'
import AdminPaymentsPage from './pages/admin/AdminPaymentsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import AdminLogsPage from './pages/admin/AdminLogsPage'
import DashboardRedirect from './pages/DashboardRedirect'
import DashboardHome from './pages/DashboardHome'
import ErrorBoundary from './components/ErrorBoundary'

function Protected({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner label="A carregar..." />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/app/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registar" element={<RegisterPage />} />
          <Route path="/registar-condutor" element={<RegisterDriverPage />} />
          <Route path="/registar-profissional" element={<RegisterProfessionalPage />} />
          <Route path="/profissionais/:id" element={<ProfessionalPublicPage />} />

          <Route
            path="/app"
            element={
              <Protected>
                <DashboardLayout />
              </Protected>
            }
          >
            <Route index element={<DashboardRedirect />} />
            <Route path="dashboard" element={<Protected roles={['condutor', 'prestador']}><DashboardHome /></Protected>} />
            <Route path="pedir-assistencia" element={<Protected roles={['condutor']}><RequestWizardPage /></Protected>} />
            <Route path="meus-pedidos" element={<Protected roles={['condutor']}><MyRequestsPage /></Protected>} />
            <Route path="historico" element={<Protected roles={['condutor', 'prestador']}><HistoryPage /></Protected>} />
            <Route path="pedidos/:id" element={<Protected roles={['condutor', 'prestador']}><RequestDetailPage /></Protected>} />
            <Route path="veiculos" element={<Protected roles={['condutor']}><VehiclesPage /></Protected>} />
            <Route path="favoritos" element={<Protected roles={['condutor']}><FavoritesPage /></Protected>} />
            <Route path="pagamentos" element={<Protected roles={['condutor', 'prestador']}><PaymentsPage /></Protected>} />
            <Route path="avaliacoes" element={<Protected roles={['condutor', 'prestador']}><ReviewsPage /></Protected>} />
            <Route path="notificacoes" element={<Protected roles={['condutor', 'prestador', 'admin']}><NotificationsPage /></Protected>} />
            <Route path="suporte" element={<Protected roles={['condutor', 'prestador']}><SupportPage /></Protected>} />
            <Route path="perfil" element={<Protected roles={['condutor', 'prestador', 'admin']}><ProfilePage /></Protected>} />
            <Route path="seguranca" element={<Protected roles={['condutor']}><SafetyPage /></Protected>} />
            <Route path="pedidos-disponiveis" element={<Protected roles={['prestador']}><AvailableRequestsPage /></Protected>} />
            <Route path="servico-atual" element={<Protected roles={['prestador']}><CurrentServicePage /></Protected>} />
            <Route path="ganhos" element={<Protected roles={['prestador']}><EarningsPage /></Protected>} />
            <Route path="servicos" element={<Protected roles={['prestador']}><ProviderServicesPage /></Protected>} />
            <Route path="documentos" element={<Protected roles={['prestador']}><DocumentsPage /></Protected>} />
            <Route path="admin" element={<Protected roles={['admin']}><AdminDashboardPage /></Protected>} />
            <Route path="admin/profissionais" element={<Protected roles={['admin']}><AdminProfessionalsPage /></Protected>} />
            <Route path="admin/condutores" element={<Protected roles={['admin']}><AdminDriversPage /></Protected>} />
            <Route path="admin/pedidos" element={<Protected roles={['admin']}><AdminRequestsPage /></Protected>} />
            <Route path="admin/reclamacoes" element={<Protected roles={['admin']}><AdminComplaintsPage /></Protected>} />
            <Route path="admin/promocoes" element={<Protected roles={['admin']}><AdminPromotionsPage /></Protected>} />
            <Route path="admin/comissoes" element={<Protected roles={['admin']}><AdminPaymentsPage /></Protected>} />
            <Route path="admin/configuracoes" element={<Protected roles={['admin']}><AdminSettingsPage /></Protected>} />
            <Route path="admin/relatorios" element={<Protected roles={['admin']}><AdminReportsPage /></Protected>} />
            <Route path="admin/logs" element={<Protected roles={['admin']}><AdminLogsPage /></Protected>} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </ToastProvider>
  )
}