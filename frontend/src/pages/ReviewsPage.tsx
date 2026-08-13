import { Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useFetch } from '../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../components/ui'
import { Rating } from '../components/Rating'
import { requestApi, professionalApi } from '../services'
import { dateTime } from '../utils/format'

export default function ReviewsPage() {
  const { user } = useAuth()
  const isProvider = user?.role === 'prestador'

  const mine = useFetch(() => requestApi.mine('concluido'), [])
  const profile = useFetch(() => professionalApi.me(), [isProvider])

  const ratings = isProvider
    ? profile.data?.professional?.reviews ?? []
    : (mine.data?.requests ?? []).map((r: any) => r.rating).filter(Boolean)

  const loading = isProvider ? profile.loading : mine.loading

  return (
    <div>
      <PageTitle
        title="Avaliações"
        subtitle={isProvider ? 'O que os condutores dizem dos teus serviços.' : 'Avalia os serviços que já recebeste.'}
      />
      {loading ? (
        <Spinner label="A carregar..." />
      ) : ratings.length === 0 ? (
        <EmptyState icon={<Star className="h-10 w-10" />} title="Ainda sem avaliações" description="Quando houver avaliações, aparecem aqui." />
      ) : (
        <div className="space-y-3">
          {ratings.map((r: any, i: number) => (
            <Card key={r.id ?? i}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-ink">{isProvider ? r.condutor_nome : `Pedido #${r.request_id}`}</p>
                <span className="text-xs text-muted">{dateTime(r.criado_em)}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <Rating value={r.nota} />
                {(r.rapidez != null || r.atendimento != null) && (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    {r.rapidez != null && <span>Rapidez: {r.rapidez}/5</span>}
                    {r.atendimento != null && <span>Atendimento: {r.atendimento}/5</span>}
                    {r.qualidade != null && <span>Qualidade: {r.qualidade}/5</span>}
                    {r.preco != null && <span>Preço: {r.preco}/5</span>}
                  </div>
                )}
              </div>
              {r.comentario && <p className="mt-2 text-sm text-muted">"{r.comentario}"</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}