import { Link } from 'react-router-dom'
import { ArrowRight, CircleDollarSign, ClipboardList, MessageSquareWarning, Users, Wrench } from 'lucide-react'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Card, PageTitle, Spinner } from '../../components/ui'
import { money } from '../../utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend)

export default function AdminDashboardPage() {
  const { data, loading } = useFetch(() => adminApi.stats(), [])

  if (loading) return <Spinner label="A carregar estatísticas..." />

  const s = data?.stats
  if (!s) return null

  const receita = s.receita_ultimos_14_dias
  const novos = s.novos_usuarios_ultimos_14_dias
  const categorias = s.servicos_por_categoria

  return (
    <div className="space-y-6">
      <PageTitle title="Painel administrativo" subtitle="Visão geral da plataforma AutoKamba." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Condutores</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{s.condutores}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Profissionais</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{s.profissionais}</p>
          <p className="mt-1 text-xs text-muted">{s.profissionais_pendentes} em verificação</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Serviços</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{s.servicos}</p>
          <p className="mt-1 text-xs text-muted">{s.servicos_hoje} hoje • {s.servicos_concluidos} concluídos</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Volume</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">{money(s.volume)}</p>
          <p className="mt-1 text-xs text-muted">{s.reclamacoes_abertas} reclamações abertas</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 flex items-center gap-2 font-bold text-ink"><CircleDollarSign className="h-5 w-5 text-primary" /> Receita (últimos 14 dias)</p>
          {receita.length === 0 ? (
            <p className="text-sm text-muted">Sem serviços concluídos neste período.</p>
          ) : (
            <div className="h-64">
              <Line
                data={{
                  labels: receita.map((r: any) => r.data.slice(5)),
                  datasets: [{ label: 'Volume (Kz)', data: receita.map((r: any) => r.valor), borderColor: '#00B86B', backgroundColor: 'rgba(0,184,107,.15)', fill: true, tension: 0.35, pointRadius: 3 }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F2F4F7' } }, x: { grid: { display: false } } } }}
              />
            </div>
          )}
        </Card>
        <Card>
          <p className="mb-4 flex items-center gap-2 font-bold text-ink"><Users className="h-5 w-5 text-primary" /> Novos utilizadores (14 dias)</p>
          {novos.length === 0 ? (
            <p className="text-sm text-muted">Sem novos registos neste período.</p>
          ) : (
            <div className="h-64">
              <Bar
                data={{
                  labels: novos.map((r: any) => r.data.slice(5)),
                  datasets: [{ label: 'Novos', data: novos.map((r: any) => r.total), backgroundColor: '#087A4B', borderRadius: 6 }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { precision: 0 }, grid: { color: '#F2F4F7' } }, x: { grid: { display: false } } } }}
              />
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <p className="mb-4 flex items-center gap-2 font-bold text-ink"><ClipboardList className="h-5 w-5 text-primary" /> Serviços por categoria</p>
          <div className="space-y-3">
            {categorias.map((c: any) => (
              <div key={c.categoria}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-ink">{c.categoria}</span>
                  <span className="text-muted">{c.total}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${categorias[0]?.total ? (c.total / categorias[0].total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <p className="mb-4 font-bold text-ink">Ações rápidas</p>
          <div className="space-y-2">
            {[
              { to: '/app/admin/profissionais', label: 'Verificar profissionais', icon: <Wrench className="h-4 w-4" />, badge: s.profissionais_pendentes },
              { to: '/app/admin/reclamacoes', label: 'Gerir reclamações', icon: <MessageSquareWarning className="h-4 w-4" />, badge: s.reclamacoes_abertas },
              { to: '/app/admin/pedidos', label: 'Ver pedidos', icon: <ClipboardList className="h-4 w-4" /> },
              { to: '/app/admin/configuracoes', label: 'Configurar comissão', icon: <CircleDollarSign className="h-4 w-4" /> },
            ].map((a) => (
              <Link key={a.to} to={a.to} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3.5 transition hover:border-primary/40 hover:bg-primary/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">{a.icon}</span>
                <span className="flex-1 text-sm font-semibold text-ink">{a.label}</span>
                {a.badge != null && a.badge > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sos px-1.5 text-[10px] font-bold text-white">{a.badge}</span>
                )}
                <ArrowRight className="h-4 w-4 text-muted" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}