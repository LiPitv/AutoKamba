import { Link } from 'react-router-dom'
import { History } from 'lucide-react'
import { requestApi } from '../services'
import { useFetch } from '../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../components/ui'
import StatusBadge from '../components/StatusBadge'
import CategoryIcon from '../components/CategoryIcon'
import { dateTime, money } from '../utils/format'

export default function HistoryPage() {
  const { data, loading } = useFetch(() => requestApi.mine(), [])

  const requests: any[] = (data?.requests ?? []).filter((r: any) => ['concluido', 'cancelado', 'rejeitado'].includes(r.status))

  return (
    <div>
      <PageTitle title="Histórico" subtitle="Pedidos concluídos, cancelados ou recusados." />
      {loading ? (
        <Spinner label="A carregar histórico..." />
      ) : requests.length === 0 ? (
        <EmptyState icon={<History className="h-10 w-10" />} title="Sem histórico" description="Os pedidos terminados aparecem aqui." />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-base"><CategoryIcon icone={r.categoria_icone} className="h-5 w-5 text-primary" /></span>
                  <div>
                    <p className="text-sm font-bold text-ink">{r.categoria_nome} — {r.numero_req}</p>
                    <p className="text-xs text-muted">
                      {r.marca ? `${r.marca} ${r.modelo} (${r.placa})` : 'Sem veículo'} • {dateTime(r.criado_em)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {r.valor ? <span className="text-sm font-bold text-primary">{money(r.valor)}</span> : null}
                  <StatusBadge status={r.status} />
                </div>
              </div>
              {r.status === 'concluido' && (
                <Link to={`/app/pedidos/${r.id}`} className="mt-3 inline-flex text-xs font-bold text-primary hover:text-primary-dark">
                  Ver detalhes e avaliar →
                </Link>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}