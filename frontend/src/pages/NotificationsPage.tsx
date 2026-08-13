import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CheckCheck, Siren, Star, MessageSquareWarning, Info, MapPin } from 'lucide-react'
import { notificationApi } from '../services'
import { useFetch } from '../hooks/useFetch'
import { Button, Card, EmptyState, PageTitle, Spinner } from '../components/ui'
import { dateTime } from '../utils/format'
import { useToast } from '../components/Toast'

const tipoIcon: Record<string, React.ReactNode> = {
  pedido: <Siren className="h-4.5 w-4.5" />,
  rastreio: <MapPin className="h-4.5 w-4.5" />,
  avaliacao: <Star className="h-4.5 w-4.5" />,
  reclamacao: <MessageSquareWarning className="h-4.5 w-4.5" />,
  info: <Info className="h-4.5 w-4.5" />,
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => notificationApi.all(), [])
  const [marking, setMarking] = useState(false)

  const notifications: any[] = data?.notifications ?? []
  const unread: number = data?.unread_count ?? 0

  const read = async (id: number) => {
    await notificationApi.markRead(id).catch(() => undefined)
    refetch()
  }

  const readAll = async () => {
    setMarking(true)
    try {
      await notificationApi.markAll()
      refetch()
      toast('Todas as notificações foram marcadas como lidas.', 'success')
    } catch {
      toast('Não foi possível atualizar.', 'error')
    } finally {
      setMarking(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageTitle
        title="Notificações"
        subtitle={unread > 0 ? `${unread} notificação(ões) por ler` : 'Está tudo em dia.'}
        actions={
          unread > 0 ? (
            <Button variant="outline" onClick={readAll} loading={marking}>
              <CheckCheck className="h-4 w-4" /> Marcar todas como lidas
            </Button>
          ) : undefined
        }
      />
      {loading ? (
        <Spinner label="A carregar notificações..." />
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell className="h-10 w-10" />} title="Sem notificações" description="Quando houver novidades, vais vê-las aqui." />
      ) : (
        <Card className="divide-y divide-gray-50 p-2">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3.5 rounded-xl px-3.5 py-4 ${n.lida ? 'opacity-70' : 'bg-primary/5'}`}>
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.lida ? 'bg-gray-100 text-muted' : 'bg-primary/15 text-primary'}`}>
                {tipoIcon[n.tipo] ?? <Info className="h-4.5 w-4.5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-ink">{n.titulo}</p>
                  <span className="shrink-0 text-[11px] text-muted">{dateTime(n.criado_em)}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted">{n.mensagem}</p>
                {n.link && (
                  <Link to={n.link} onClick={() => read(n.id)} className="mt-1.5 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark">
                    <MapPin className="h-3.5 w-3.5" /> Ver detalhes
                  </Link>
                )}
              </div>
              {!n.lida && (
                <button onClick={() => read(n.id)} className="shrink-0 rounded-lg p-1.5 text-muted hover:bg-primary/10 hover:text-primary" title="Marcar como lida">
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}