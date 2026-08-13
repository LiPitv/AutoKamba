import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, MapPin, Navigation } from 'lucide-react'
import { requestApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, PageTitle, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import CategoryIcon from '../../components/CategoryIcon'
import { Map } from '../../components/Map'
import { apiError, dateTime } from '../../utils/format'
import { useToast } from '../../components/Toast'

export default function AvailableRequestsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => {
    const lat = user?.latitude ?? -8.8383334
    const lng = user?.longitude ?? 13.2344444
    return requestApi.available(lat, lng, 25)
  }, [user?.latitude, user?.longitude])
  const [busyId, setBusyId] = useState<number | null>(null)

  const requests: any[] = data?.requests ?? []

  const accept = async (id: number) => {
    if (!['verificado', 'online'].includes(user?.estado_profissional ?? '')) {
      toast('A tua conta ainda não está verificada para receber pedidos.', 'error')
      return
    }
    setBusyId(id)
    try {
      await requestApi.status(id, 'aceite')
      toast('Pedido aceite! O condutor já foi notificado.', 'success')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <PageTitle
        title="Pedidos disponíveis"
        subtitle="Condutores à tua espera. Aceita o pedido mais próximo."
        actions={<StatusBadge status={user?.estado_profissional === 'online' ? 'online' : user?.estado_profissional ?? 'offline'} />}
      />
      {loading ? (
        <Spinner label="A procurar pedidos..." />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<AlertCircle className="h-10 w-10" />}
          title="Sem pedidos disponíveis agora"
          description="Os pedidos aparecem em tempo real. Fica online para não perderes nenhum!"
          action={<Link to="/app/dashboard" className="text-sm font-bold text-primary">Ir para o painel →</Link>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-xl"><CategoryIcon icone={r.categoria_icone} className="h-6 w-6 text-primary" /></span>
                  <div>
                    <p className="font-bold text-ink">{r.categoria_nome}</p>
                    <p className="text-xs text-muted">{r.numero_req} • {dateTime(r.criado_em)}</p>
                  </div>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="mt-3 grid gap-2 rounded-2xl bg-gray-50 p-4 text-sm">
                <p className="flex items-center gap-2 text-ink"><MapPin className="h-4 w-4 text-sos" /> {r.condutor_nome} — {r.endereco || `${Number(r.latitude).toFixed(4)}, ${Number(r.longitude).toFixed(4)}`}</p>
                <p className="flex items-center gap-2 text-muted"><Navigation className="h-4 w-4 text-primary" /> Distância: {r.distancia_km != null ? `${Number(r.distancia_km).toFixed(1).replace('.', ',')} km` : '—'}</p>
                {r.marca && <p className="text-muted"><b className="text-ink">{r.marca} {r.modelo}</b> ({r.placa})</p>}
                {r.descricao && <p className="italic text-muted">"{r.descricao}"</p>}
              </div>
              {r.latitude && r.longitude && (
                <Map center={[Number(r.latitude), Number(r.longitude)]} zoom={12} className="mt-3 h-40 w-full rounded-2xl" points={[{ lat: Number(r.latitude), lng: Number(r.longitude), type: 'sos' }]} />
              )}
              <Button className="mt-4 w-full" onClick={() => accept(r.id)} loading={busyId === r.id}>
                <CheckCircle2 className="h-4 w-4" /> Aceitar pedido
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}