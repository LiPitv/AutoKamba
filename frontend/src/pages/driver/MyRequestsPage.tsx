import { Link } from 'react-router-dom'
import { ClipboardList, MapPin } from 'lucide-react'
import { requestApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import CategoryIcon from '../../components/CategoryIcon'
import { dateTime } from '../../utils/format'

const active = ['procurando', 'aceite', 'a_caminho', 'chegou', 'em_atendimento']

export default function MyRequestsPage() {
  const { data, loading } = useFetch(() => requestApi.mine(), [])

  const requests: any[] = data?.requests ?? []
  const ativos = requests.filter((r) => active.includes(r.status))
  const terminados = requests.filter((r) => !active.includes(r.status))

  return (
    <div className="space-y-8">
      <PageTitle title="Os meus pedidos" subtitle="Acompanha os serviços em curso e o histórico." />
      {loading ? (
        <Spinner label="A carregar pedidos..." />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<ClipboardList className="h-10 w-10" />}
          title="Ainda não tens pedidos"
          description="Quando precisares de assistência, pressiona o botão SOS."
        />
      ) : (
        <>
          {ativos.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">Em curso ({ativos.length})</h2>
              <div className="space-y-3">
                {ativos.map((r) => (
                  <Link key={r.id} to={`/app/pedidos/${r.id}`} className="block">
                    <Card className="transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl"><CategoryIcon icone={r.categoria_icone} className="h-6 w-6 text-primary" /></span>
                          <div>
                            <p className="text-sm font-bold text-ink">{r.categoria_nome} — {r.numero_req}</p>
                            <p className="flex items-center gap-1 text-xs text-muted">
                              <MapPin className="h-3 w-3" /> {r.profissional_nome ? `Profissional: ${r.profissional_nome}` : 'A procurar profissional...'}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                      {r.status === 'procurando' && (
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                          <div className="h-full w-1/2 animate-pulse rounded-full bg-warn" />
                        </div>
                      )}
                      <p className="mt-2 text-xs text-muted">Criado: {dateTime(r.criado_em)}</p>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {terminados.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-ink">Terminados ({terminados.length})</h2>
              <div className="space-y-3">
                {terminados.map((r) => (
                  <Link key={r.id} to={`/app/pedidos/${r.id}`} className="block">
                    <Card className="transition hover:border-primary/40">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg"><CategoryIcon icone={r.categoria_icone} className="h-5 w-5" /></span>
                          <div>
                            <p className="text-sm font-bold text-ink">{r.categoria_nome}</p>
                            <p className="text-xs text-muted">{r.marca ? `${r.marca} ${r.modelo} (${r.placa})` : 'Sem veículo'} • {dateTime(r.criado_em)}</p>
                          </div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}