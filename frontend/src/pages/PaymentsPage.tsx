import { CreditCard } from 'lucide-react'
import { paymentApi } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../components/ui'
import StatusBadge from '../components/StatusBadge'
import { dateTime, money } from '../utils/format'

export default function PaymentsPage() {
  const { user } = useAuth()
  const { data, loading } = useFetch(() => paymentApi.all(), [])

  const payments: any[] = data?.payments ?? []
  const total = user?.role === 'prestador' ? payments.reduce((s, p) => s + Number(p.valor_liquido ?? 0), 0) : 0
  const comissoes = user?.role === 'prestador' ? payments.reduce((s, p) => s + Number(p.comissao ?? 0), 0) : 0

  return (
    <div>
      <PageTitle title="Pagamentos" subtitle={user?.role === 'prestador' ? 'Comissões e valores líquidos dos teus serviços.' : 'Histórico de pagamentos dos teus serviços.'} />
      {user?.role === 'prestador' && payments.length > 0 && (
        <div className="mb-5 grid gap-4 sm:grid-cols-2">
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Total líquido recebido</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">{money(total)}</p>
          </Card>
          <Card>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Total de comissões AutoKamba</p>
            <p className="mt-2 text-2xl font-extrabold text-muted">{money(comissoes)}</p>
          </Card>
        </div>
      )}
      {loading ? (
        <Spinner label="A carregar pagamentos..." />
      ) : payments.length === 0 ? (
        <EmptyState icon={<CreditCard className="h-10 w-10" />} title="Sem pagamentos" description="Os pagamentos de serviços concluídos aparecem aqui." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-130 text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Pedido</th>
                <th className="px-5 py-3.5">Serviço</th>
                <th className="px-5 py-3.5">Método</th>
                <th className="px-5 py-3.5 text-right">Valor</th>
                {user?.role === 'prestador' && <th className="px-5 py-3.5 text-right">Comissão</th>}
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
                  <td className="px-5 py-3.5 capitalize text-muted">{p.metodo}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">{money(p.valor)}</td>
                  {user?.role === 'prestador' && <td className="px-5 py-3.5 text-right text-muted">−{money(p.comissao)}</td>}
                  <td className="px-5 py-3.5 text-right font-bold text-primary">{money(p.valor_liquido)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.estado} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{dateTime(p.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}