import { useState, type FormEvent } from 'react'
import { MessageSquareWarning, Phone, Mail } from 'lucide-react'
import { complaintApi } from '../services'
import { useFetch } from '../hooks/useFetch'
import { Button, Card, EmptyState, Input, PageTitle, Select, Spinner, Textarea } from '../components/ui'
import StatusBadge from '../components/StatusBadge'
import { apiError, dateTime } from '../utils/format'
import { useToast } from '../components/Toast'

const categorias = ['serviço', 'faturação', 'comportamento do profissional', 'problema técnico', 'suporte', 'outro']

export default function SupportPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => complaintApi.mine(), [])
  const [form, setForm] = useState({ categoria: categorias[0], request_id: '', descricao: '' })
  const [busy, setBusy] = useState(false)

  const complaints: any[] = data?.complaints ?? []

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await complaintApi.create({ categoria: form.categoria, request_id: form.request_id || undefined, descricao: form.descricao })
      toast('Reclamação enviada. A nossa equipa vai analisar.', 'success')
      setForm({ categoria: categorias[0], request_id: '', descricao: '' })
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageTitle title="Suporte e reclamações" subtitle="Tens um problema? Conta-nos tudo." />
      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Phone className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold text-ink">Linha de apoio</p>
              <p className="text-xs text-muted">+244 923 000 000 (dias úteis, 8h–18h)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-bold text-ink">Email</p>
              <p className="text-xs text-muted">suporte@autokamba.co.ao</p>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
              {categorias.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </Select>
            <Input label="Nº do pedido (opcional)" value={form.request_id} onChange={(e) => setForm({ ...form, request_id: e.target.value })} placeholder="Ex.: 5" />
          </div>
          <Textarea label="Descrição" required value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={4} placeholder="Descreve o que aconteceu com o máximo de detalhe..." />
          <Button type="submit" loading={busy}>Enviar reclamação</Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink">
          <MessageSquareWarning className="h-5 w-5 text-primary" /> As minhas reclamações
        </h2>
        {loading ? (
          <Spinner label="A carregar..." />
        ) : complaints.length === 0 ? (
          <EmptyState title="Sem reclamações" description="Ainda não submeteste nenhuma reclamação." />
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <Card key={c.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-ink capitalize">{c.categoria}</p>
                  <StatusBadge status={c.estado} />
                </div>
                <p className="mt-2 text-sm text-muted">{c.descricao}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span>Pedido: {c.request_id ? `#${c.request_id}` : '—'}</span>
                  <span>{dateTime(c.criado_em)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}