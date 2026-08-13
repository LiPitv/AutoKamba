import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Wrench, ClipboardList, History, Car, Star, CreditCard, MessageSquareWarning,
  Bell, User, LogOut, Menu, X, MapPin, Wallet, FileText, Siren, ShieldCheck, Users, CircleDollarSign,
  Tag, Settings, ListChecks, ScrollText, Briefcase,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { LogoMark } from '../components/Logo'
import { Avatar } from '../components/ui'
import { notificationApi } from '../services'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
  roles: string[]
}

const items: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/pedir-assistencia', label: 'Pedir assistência', icon: <Siren className="h-4.5 w-4.5" />, roles: ['condutor'] },
  { to: '/app/meus-pedidos', label: 'Meus pedidos', icon: <ClipboardList className="h-4.5 w-4.5" />, roles: ['condutor'] },
  { to: '/app/historico', label: 'Histórico', icon: <History className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador'] },
  { to: '/app/veiculos', label: 'Veículos', icon: <Car className="h-4.5 w-4.5" />, roles: ['condutor'] },
  { to: '/app/favoritos', label: 'Favoritos', icon: <Star className="h-4.5 w-4.5" />, roles: ['condutor'] },
  { to: '/app/pagamentos', label: 'Pagamentos', icon: <CreditCard className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador'] },
  { to: '/app/avaliacoes', label: 'Avaliações', icon: <Star className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador'] },
  { to: '/app/notificacoes', label: 'Notificações', icon: <Bell className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador', 'admin'] },
  { to: '/app/suporte', label: 'Suporte', icon: <MessageSquareWarning className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador'] },
  { to: '/app/perfil', label: 'Perfil', icon: <User className="h-4.5 w-4.5" />, roles: ['condutor', 'prestador', 'admin'] },
  { to: '/app/pedidos-disponiveis', label: 'Pedidos disponíveis', icon: <ListChecks className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/servico-atual', label: 'Serviço atual', icon: <Wrench className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/ganhos', label: 'Ganhos', icon: <Wallet className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/servicos', label: 'Meus serviços', icon: <Briefcase className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/documentos', label: 'Documentos', icon: <FileText className="h-4.5 w-4.5" />, roles: ['prestador'] },
  { to: '/app/admin', label: 'Visão geral', icon: <LayoutDashboard className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/profissionais', label: 'Profissionais', icon: <Wrench className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/condutores', label: 'Condutores', icon: <Users className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/pedidos', label: 'Pedidos', icon: <ClipboardList className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/reclamacoes', label: 'Reclamações', icon: <MessageSquareWarning className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/promocoes', label: 'Promoções', icon: <Tag className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/comissoes', label: 'Comissões e pagamentos', icon: <CircleDollarSign className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/configuracoes', label: 'Configurações', icon: <Settings className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/relatorios', label: 'Relatórios', icon: <ScrollText className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/admin/logs', label: 'Logs', icon: <ShieldCheck className="h-4.5 w-4.5" />, roles: ['admin'] },
  { to: '/app/seguranca', label: 'Segurança (SOS)', icon: <ShieldCheck className="h-4.5 w-4.5" />, roles: ['condutor'] },
]

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  const menu = items.filter((item) => user && item.roles.includes(user.role))

  useEffect(() => {
    const load = () => {
      if (user) {
        notificationApi.unread().then((r) => setUnread(r.unread_count)).catch(() => undefined)
      }
    }
    load()
    const timer = setInterval(load, 30000)
    return () => clearInterval(timer)
  }, [user])

  if (!user) return null

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 -translate-x-full bg-white border-r border-gray-100 transition-transform lg:translate-x-0 lg:static ${open ? 'translate-x-0' : ''}`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-100 px-5">
          <LogoMark size={34} />
          <div>
            <p className="text-base font-extrabold leading-none text-ink">
              Auto<span className="text-primary">Kamba</span>
            </p>
            <p className="text-[11px] text-muted">O teu parceiro na estrada</p>
          </div>
          <button className="ml-auto lg:hidden text-muted" onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/app/dashboard' || item.to === '/app/admin'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-primary/10 text-primary-dark' : 'text-muted hover:bg-gray-50 hover:text-ink'
                }`
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.to === '/app/notificacoes' && unread > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sos px-1.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-gray-100 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar src={user.avatar} name={user.nome} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">{user.nome}</p>
              <p className="text-xs text-muted capitalize">{user.role}</p>
            </div>
            <button onClick={logout} className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-sos" title="Terminar sessão">
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="lg:hidden text-muted" onClick={() => setOpen(true)} aria-label="Abrir menu">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-3.5 py-2 text-sm font-semibold text-primary-dark">
            <MapPin className="h-4 w-4" />
            Luanda, Angola
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link to="/app/notificacoes" className="relative rounded-xl p-2 text-muted hover:bg-gray-100 hover:text-ink">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-sos px-1 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </Link>
            <Link to="/" className="text-sm font-medium text-muted hover:text-primary">Ver site</Link>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}