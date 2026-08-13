import { useState } from 'react'
import { Search, Users, UserCheck, UserX } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Avatar, Card, EmptyState, Input, PageTitle, Select, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { useToast } from '../../components/Toast'
import { apiError } from '../../utils/format'

export default function AdminDriversPage() {
  const { toast } = useToast()
  const [estado, setEstado] = useState('')
  const [search, setSearch] = useState('')
  const { data, loading, refetch } = useFetch(() => adminApi.drivers({ estado: estado || undefined, search: search || undefined }), [estado, search])

  const drivers: any[] = data?.drivers ?? []

  const setStatus = async (id: number, estado: string) => {
    try {
      await adminApi.driverStatus(id, estado as any)
      toast('Estado do condutor atualizado.', 'success')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle title="Condutores" subtitle="Gestão de contas de condutores da plataforma." />
      <Card className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-55 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por nome, email ou telefone..." className="pl-10" />
          </div>
        </div>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-44" defaultOption="Todos os estados">
          {['ativo', 'suspenso', 'bloqueado'].map((e) => <option key={e} value={e}>{e}</option>)}
        </Select>
      </Card>

      {loading ? (
        <Spinner label="A carregar condutores..." />
      ) : drivers.length === 0 ? (
        <EmptyState icon={<Users className="h-10 w-10" />} title="Sem condutores" description="Ajusta os filtros para ver mais resultados." />
      ) : (
        <div className="space-y-3">
          {drivers.map((d) => (
            <Card key={d.id} className="flex flex-wrap items-center gap-4 py-3.5">
              <Avatar src={d.avatar} name={d.nome} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{d.nome}</p>
                <p className="text-xs text-muted">{d.email} • {d.telefone}</p>
                <p className="text-xs text-muted">{d.numero_pedidos} pedidos realizados</p>
              </div>
              <StatusBadge status={d.estado} />
              <div className="flex items-center gap-2">
                <button onClick={() => setStatus(d.id, 'ativo')} className="rounded-lg p-2 text-muted hover:bg-emerald-50 hover:text-emerald-600" title="Definir ativo">
                  <UserCheck className="h-4.5 w-4.5" />
                </button>
                <button onClick={() => setStatus(d.id, 'suspenso')} className="rounded-lg p-2 text-muted hover:bg-amber-50 hover:text-amber-600" title="Suspender temporariamente">
                  <UserX className="h-4.5 w-4.5" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}