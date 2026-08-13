import { ScrollText } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Card, EmptyState, PageTitle, Spinner } from '../../components/ui'
import { dateTime } from '../../utils/format'

export default function AdminLogsPage() {
  const { data, loading } = useFetch(() => adminApi.logs(), [])

  const logs: any[] = data?.logs ?? []

  return (
    <div>
      <PageTitle title="Logs administrativos" subtitle="Registo de todas as ações da equipa de administração." />
      {loading ? (
        <Spinner label="A carregar logs..." />
      ) : logs.length === 0 ? (
        <EmptyState icon={<ScrollText className="h-10 w-10" />} title="Sem registos" description="As ações administrativas aparecem aqui." />
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-130 text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3.5">Data</th>
                <th className="px-5 py-3.5">Administrador</th>
                <th className="px-5 py-3.5">Ação</th>
                <th className="px-5 py-3.5">Detalhes</th>
                <th className="px-5 py-3.5">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="whitespace-nowrap px-5 py-3.5 text-xs text-muted">{dateTime(l.criado_em)}</td>
                  <td className="px-5 py-3.5 font-semibold text-ink">{l.admin_nome ?? 'Sistema'}</td>
                  <td className="px-5 py-3.5"><span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary-dark">{l.acao}</span></td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted">{l.detalhes}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted">{l.ip ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}