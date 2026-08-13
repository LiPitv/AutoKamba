import { CircleDollarSign, CreditCard } from 'lucide-react'
import { paymentApi, adminApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { dateTime, money } from '../../utils/format'

export default function AdminPaymentsPage() {
  const { user } = useAuth()
  const { data: statsData } = useFetch(() => adminApi.stats(), [])
  const { data, loading } = useFetch(() => paymentApi.all(), [])
  const s = statsData?.stats

  const payments: any[] = data?.payments ?? []

  return (
    <div>
      <PageTitle title="Comissões e pagamentos" subtitle="Visão geral dos pagamentos registados na plataforma." />
      {user?.role === 'admin' && s && (
        <div className="mb-5 grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Volume total (serviços concluídos)</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">{money(s.volume)}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Serviços concluídos</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">{s.servicos_concluidos}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Profissionais verificados</p>
            <p className="mt-2 text-2xl font-extrabold text-primary">{s.profissionais_verificados}</p>
          </Card>
        </div>
      )}
      {loading ? (
        <Spinner label="A carregar pagamentos..." />
      ) : payments.length === 0 ? (
        <EmptyState icon={<CreditCard className="h-10 w-10" />} title="Sem pagamentos" description="Quando os serviços forem concluídos com valor, os pagamentos aparecem aqui." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-140 text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Pedido</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5">Método</th>
                <th className="px-5 py-3.5 text-right">Valor</th>
                <th className="px-5 py-3.5 text-right">Comissão</th>
                <th className="px-5 py-3.5 text-right">Líquido</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3.5 font-semibold text-ink">{p.numero_req}</td>
                  <td className="px-5 py-3.5 text-muted">{p.categoria_nome}</td>
                  <td className="px-5 py-3.5 text-muted">{p.metodo}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">{money(p.valor)}</td>
                  <td className="px-5 py-3.5 text-right font-bold text-primary">{money(p.comissao)}</td>
                  <td className="px-5 py-3.5 text-right text-muted">{money(p.valor_liquido)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.estado} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{dateTime(p.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="mt-5">
        <p className="flex items-center gap-2 font-bold text-ink"><CircleDollarSign className="h-5 w-5 text-primary" /> Nota sobre comissões</p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Cada serviço concluído com valor regista automaticamente um pagamento com comissão percentual sobre o valor.
          A percentagem é configurável em <b className="text-ink">Configurações</b> (default: 10%).
        </p>
      </Card>
    </div>
  )
}