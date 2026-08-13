import { Bar, Pie, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend } from 'chart.js'
import { CloudDownload, ScrollText } from 'lucide-react'
import { adminApi, paymentApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, PageTitle, Spinner } from '../../components/ui'
import { money } from '../../utils/format'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Tooltip, Legend)

export default function AdminReportsPage() {
  const { data: statsData, loading } = useFetch(() => adminApi.stats(), [])
  const { data: paymentsData } = useFetch(() => paymentApi.all(), [])

  if (loading) return <Spinner label="A gerar relatórios..." />
  const s = statsData?.stats
  if (!s) return null

  const receita = s.receita_ultimos_14_dias
  const novos = s.novos_usuarios_ultimos_14_dias
  const categorias = s.servicos_por_categoria
  const pagamentos = paymentsData?.payments ?? []

  const csv = () => {
    const linhas = ['pedido,categoria,condutor,profissional,metodo,valor,comissao,liquido,data']
    pagamentos.forEach((p: any) =>
      linhas.push([p.numero_req, p.categoria_nome, p.condutor_nome ?? '', p.profissional_nome ?? '', p.metodo, p.valor, p.comissao, p.valor_liquido, p.criado_em].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')))
    const blob = new Blob(['\ufeff' + linhas.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autokamba-relatorio-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <PageTitle
        title="Relatórios"
        subtitle="Análise detalhada do desempenho da plataforma."
        actions={<Button variant="outline" onClick={csv}><CloudDownload className="h-4 w-4" /> Exportar CSV</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 font-bold text-ink">Receita diária (14 dias)</p>
          {receita.length === 0 ? (
            <p className="text-sm text-muted">Sem dados neste período.</p>
          ) : (
            <div className="h-64">
              <Line
                data={{
                  labels: receita.map((r: any) => r.data.slice(5)),
                  datasets: [{ label: 'Volume (Kz)', data: receita.map((r: any) => r.valor), borderColor: '#00B86B', backgroundColor: 'rgba(0,184,107,.12)', fill: true, tension: 0.35 }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#F2F4F7' } }, x: { grid: { display: false } } } }}
              />
            </div>
          )}
        </Card>
        <Card>
          <p className="mb-4 font-bold text-ink">Serviços por categoria</p>
          {categorias.length === 0 || categorias.every((c: any) => c.total === 0) ? (
            <p className="text-sm text-muted">Sem dados neste período.</p>
          ) : (
            <div className="h-64">
              <Pie
                data={{
                  labels: categorias.map((c: any) => c.categoria),
                  datasets: [{ data: categorias.map((c: any) => c.total), backgroundColor: ['#00B86B', '#087A4B', '#FFB703', '#E53935', '#667085', '#2563EB', '#9333EA', '#0891B2'] }],
                }}
                options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }}
              />
            </div>
          )}
        </Card>
        <Card className="lg:col-span-2">
          <p className="mb-4 font-bold text-ink">Novos utilizadores por dia (14 dias)</p>
          {novos.length === 0 ? (
            <p className="text-sm text-muted">Sem dados neste período.</p>
          ) : (
            <div className="h-56">
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

      <Card>
        <p className="mb-3 flex items-center gap-2 font-bold text-ink"><ScrollText className="h-5 w-5 text-primary" /> Resumo executivo</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3">Indicador</th>
                <th className="px-4 py-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr><td className="px-4 py-3 text-muted">Condutores registados</td><td className="px-4 py-3 text-right font-bold text-ink">{s.condutores}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Profissionais registados</td><td className="px-4 py-3 text-right font-bold text-ink">{s.profissionais}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Profissionais verificados</td><td className="px-4 py-3 text-right font-bold text-ink">{s.profissionais_verificados}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Pedidos totais</td><td className="px-4 py-3 text-right font-bold text-ink">{s.servicos}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Pedidos hoje</td><td className="px-4 py-3 text-right font-bold text-ink">{s.servicos_hoje}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Pedidos concluídos</td><td className="px-4 py-3 text-right font-bold text-ink">{s.servicos_concluidos}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Volume financeiro</td><td className="px-4 py-3 text-right font-bold text-primary">{money(s.volume)}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Reclamações abertas</td><td className="px-4 py-3 text-right font-bold text-ink">{s.reclamacoes_abertas}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Pagamentos registados</td><td className="px-4 py-3 text-right font-bold text-ink">{pagamentos.length}</td></tr>
              <tr><td className="px-4 py-3 text-muted">Última atualização</td><td className="px-4 py-3 text-right text-muted">{new Date().toLocaleString('pt-PT')}</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}