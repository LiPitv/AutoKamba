import { useNavigate } from 'react-router-dom'
import { Star, Trash2, Wrench } from 'lucide-react'
import { favoriteApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Avatar, Button, Card, EmptyState, PageTitle, Spinner } from '../../components/ui'
import { useToast } from '../../components/Toast'
import { apiError, tipoProfissionalLabel } from '../../utils/format'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => favoriteApi.all(), [])

  const favorites: any[] = data?.favorites ?? []

  const remove = async (id: number) => {
    try {
      await favoriteApi.remove(id)
      toast('Removido dos favoritos.', 'info')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle title="Profissionais favoritos" subtitle="Os teus profissionais de confiança, sempre à distância de um toque." />
      {loading ? (
        <Spinner label="A carregar favoritos..." />
      ) : favorites.length === 0 ? (
        <EmptyState
          icon={<Star className="h-10 w-10" />}
          title="Sem favoritos ainda"
          description="Ao consultar perfis de profissionais, podes guardá-los aqui para um pedido rápido."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((f) => (
            <Card key={f.provider_id} className="flex flex-col">
              <div className="flex items-start gap-3">
                <Avatar src={f.avatar} name={f.nome} size={52} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink">{f.nome}</p>
                  <p className="text-xs text-muted">{tipoProfissionalLabel(f.tipo_profissional)}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                    <Star className="h-3.5 w-3.5 fill-warn text-warn" />
                    {f.avaliacao_media != null ? `${Number(f.avaliacao_media).toFixed(1).replace('.', ',')} (${f.numero_avaliacoes})` : 'Sem avaliações'}
                  </p>
                </div>
                <button onClick={() => remove(f.provider_id)} className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-sos" title="Remover dos favoritos">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {f.area_atendimento && <p className="mt-2 text-xs text-muted">📍 {f.area_atendimento}</p>}
              {f.preco_base != null && <p className="mt-1 text-sm font-bold text-primary">{f.preco_base} Kz (preço base)</p>}
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  navigate(`/app/pedir-assistencia?profissional=${f.provider_id}`)
                }}
              >
                <Wrench className="h-4 w-4" /> Pedir assistência
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}