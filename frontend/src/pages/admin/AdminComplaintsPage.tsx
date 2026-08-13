import { useState, type FormEvent } from 'react'
import { MessageSquareWarning } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, PageTitle, Select, Spinner, Textarea } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { dateTime } from '../../utils/format'
import { useToast } from '../../components/Toast'
import { apiError } from '../../utils/format'

const estados = ['aberto', 'em_analise', 'resolvido', 'encerrado']

export default function AdminComplaintsPage() {
  const { toast } = useToast()
  const [filtro, setFiltro] = useState('')
  const [respostaId, setRespostaId] = useState<number | null>(null)
  const [nota, setNota] = useState('')
  const { data, loading, refetch } = useFetch(() => adminApi.complaints({ estado: filtro || undefined }), [filtro])

  const complaints: any[] = data?.complaints ?? []

  const setStatus = async (id: number, estado: string) => {
    try {
      await adminApi.complaintEstado(id, estado)
      toast('Reclamação atualizada.', 'success')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  const responder = async (e: FormEvent) => {
    e.preventDefault()
    if (respostaId == null) return
    try {
      await adminApi.complaintEstado(respostaId, 'resolvido')
      toast(nota ? 'Reclamação resolvida com observação registada.' : 'Reclamação marcada como resolvida.', 'success')
      setRespostaId(null)
      setNota('')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle title="Reclamações" subtitle="Apoio ao cliente e resolução de conflitos." />
      <div className="mb-5 flex items-center gap-3">
        <Select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-48" defaultOption="Todos os estados">
          {estados.map((e) => <option key={e} value={e}>{e}</option>)}
        </Select>
      </div>

      {loading ? (
        <Spinner label="A carregar reclamações..." />
      ) : complaints.length === 0 ? (
        <EmptyState icon={<MessageSquareWarning className="h-10 w-10" />} title="Sem reclamações" description="Ajusta os filtros para ver mais resultados." />
      ) : (
        <div className="space-y-3">
          {complaints.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-bold text-ink capitalize">{c.categoria}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted">{c.numero_req ? `Pedido ${c.numero_req}` : ''}</span>
                  <StatusBadge status={c.estado} />
                  <Select value={c.estado} onChange={(e) => setStatus(c.id, e.target.value)} className="w-36">
                    {estados.map((e) => <option key={e} value={e}>{e}</option>)}
                  </Select>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted">{c.descricao}</p>
              {c.evidencias && <a href={c.evidencias} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-bold text-primary">Ver evidência →</a>}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-50 pt-3 text-xs text-muted">
                <span>{c.utilizador_nome} • {c.utilizador_telefone} • {dateTime(c.criado_em)}</span>
                {c.estado !== 'resolvido' && c.estado !== 'encerrado' && (
                  <button className="font-bold text-primary hover:text-primary-dark" onClick={() => setRespostaId(respostaId === c.id ? null : c.id)}>
                    {respostaId === c.id ? 'Fechar resposta' : 'Marcar como resolvida'}
                  </button>
                )}
              </div>
              {respostaId === c.id && (
                <form onSubmit={responder} className="mt-3">
                  <Textarea value={nota} onChange={(e) => setNota(e.target.value)} rows={2} placeholder="Observação da resolução (opcional)" />
                  <Button type="submit" className="mt-2">Confirmar resolução</Button>
                </form>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}