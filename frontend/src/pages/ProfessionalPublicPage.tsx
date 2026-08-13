import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Phone, Star, ChevronLeft } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { professionalApi } from '../services'
import { Avatar, Button, Card, EmptyState, Spinner } from '../components/ui'
import { Rating } from '../components/Rating'
import { tipoProfissionalLabel } from '../utils/format'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/Toast'

export default function ProfessionalPublicPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const { data, loading, error } = useFetch(() => professionalApi.detail(Number(id)), [id])

  if (loading) return <Spinner label="A carregar profissional..." />
  if (error || !data?.professional) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <EmptyState title="Profissional não encontrado" description={error} />
      </div>
    )
  }

  const p = data.professional

  const pedir = async () => {
    const professional = data.professional
    if (!professional?.services?.length) {
      toast('Este profissional ainda não configurou serviços.', 'error')
      return
    }
    navigate(`/app/pedir-assistencia?profissional=${professional.id}&categoria=${professional.services[0].category_id}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-primary">
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>
      <Card>
        <div className="flex flex-wrap items-center gap-5">
          <Avatar src={p.avatar} name={p.nome} size={80} />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold text-ink">{p.nome}</h1>
            <p className="text-sm text-muted">{tipoProfissionalLabel(p.tipo_profissional)}{p.especialidade ? ` • ${p.especialidade}` : ''}</p>
            <div className="mt-1.5 flex items-center gap-2 text-sm">
              <Rating value={p.avaliacao_media ?? 0} />
              <span className="text-muted">({p.numero_avaliacoes} avaliações)</span>
            </div>
          </div>
          {user && user.role === 'condutor' ? (
            <Button onClick={pedir}>Pedir assistência</Button>
          ) : (
            <Button onClick={() => (window.location.href = '/registar')}>Criar conta e pedir</Button>
          )}
        </div>
        {p.descricao && <p className="mt-5 rounded-2xl bg-gray-50 p-4 text-sm leading-relaxed text-muted">{p.descricao}</p>}
        <div className="mt-5 grid gap-3 text-sm text-muted sm:grid-cols-3">
          <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {p.area_atendimento || 'Luanda'}</p>
          <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {p.telefone}</p>
          <p className="flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {p.numero_servicos} serviços concluídos</p>
        </div>
      </Card>

      {p.services?.length > 0 && (
        <Card className="mt-4">
          <h2 className="font-bold text-ink">Serviços oferecidos</h2>
          <div className="mt-3 space-y-2">
            {p.services.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-ink">{s.nome || s.category_name || 'Serviço'}</p>
                <p className="text-sm font-bold text-primary">{s.preco ? `${s.preco} Kz` : 'A combinar'}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-4">
        <h2 className="font-bold text-ink">Avaliações</h2>
        {p.reviews?.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Ainda sem avaliações. Seja o primeiro!</p>
        ) : (
          <div className="mt-3 space-y-4 divide-y divide-gray-50">
            {p.reviews?.map((r: any) => (
              <div key={r.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">{r.condutor_nome}</p>
                </div>
                <Rating value={r.nota} />
                {r.comentario && <p className="mt-1.5 text-sm text-muted">{r.comentario}</p>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}