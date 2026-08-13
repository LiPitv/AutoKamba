import { useState } from 'react'
import { ClipboardList, Search } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Card, EmptyState, Input, PageTitle, Select, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { dateTime, money } from '../../utils/format'

const estados = ['procurando', 'aceite', 'a_caminho', 'chegou', 'em_atendimento', 'concluido', 'cancelado', 'rejeitado', 'pendente']

export default function AdminRequestsPage() {
  const [estado, setEstado] = useState('')
  const [search, setSearch] = useState('')
  const { data, loading } = useFetch(() => adminApi.requests({ estado: estado || undefined, search: search || undefined }), [estado, search])

  const requests: any[] = data?.requests ?? []

  return (
    <div>
      <PageTitle title="Pedidos" subtitle="Todos os pedidos de assistência da plataforma." />
      <Card className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-55 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por número, condutor ou profissional..." className="pl-10" />
          </div>
        </div>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-52" defaultOption="Todos os estados">
          {estados.map((e) => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
        </Select>
      </Card>

      {loading ? (
        <Spinner label="A carregar pedidos..." />
      ) : requests.length === 0 ? (
        <EmptyState icon={<ClipboardList className="h-10 w-10" />} title="Sem pedidos" description="Ajusta os filtros para ver mais resultados." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-140 text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Pedido</th>
                <th className="px-5 py-3.5">Categoria</th>
                <th className="px-5 py-3.5">Condutor</th>
                <th className="px-5 py-3.5">Profissional</th>
                <th className="px-5 py-3.5 text-right">Valor</th>
                <th className="px-5 py-3.5">Estado</th>
                <th className="px-5 py-3.5">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5 font-semibold text-ink">{r.numero_req}</td>
                  <td className="px-5 py-3.5 text-muted">{r.categoria_nome}</td>
                  <td className="max-w-40 truncate px-5 py-3.5 text-muted">{r.condutor_nome}</td>
                  <td className="max-w-40 truncate px-5 py-3.5 text-muted">{r.profissional_nome ?? '—'}</td>
                  <td className="px-5 py-3.5 text-right font-semibold text-ink">{r.valor ? money(r.valor) : '—'}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3.5 text-xs text-muted">{dateTime(r.criado_em)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}