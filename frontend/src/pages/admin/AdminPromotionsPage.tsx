import { useState, type FormEvent } from 'react'
import { Percent, Pencil, Plus, Tag, Trash2 } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Badge, Button, Card, EmptyState, Input, Modal, PageTitle, Select, Spinner, Textarea } from '../../components/ui'
import { apiError } from '../../utils/format'
import { useToast } from '../../components/Toast'

interface Promotion {
  id: number
  titulo: string
  descricao: string | null
  codigo: string | null
  percentual: number | null
  ativo: number
  inicio_em: string | null
  fim_em: string | null
}

export default function AdminPromotionsPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => adminApi.promotions(), [])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [form, setForm] = useState({ titulo: '', descricao: '', codigo: '', percentual: '', ativo: '1', inicio_em: '', fim_em: '' })

  const promotions: Promotion[] = data?.promotions ?? []

  const openForm = (p?: Promotion) => {
    setEditing(p ?? null)
    setForm({
      titulo: p?.titulo ?? '',
      descricao: p?.descricao ?? '',
      codigo: p?.codigo ?? '',
      percentual: p?.percentual != null ? String(p.percentual) : '',
      ativo: String(p?.ativo ?? 1),
      inicio_em: p?.inicio_em?.slice(0, 10) ?? '',
      fim_em: p?.fim_em?.slice(0, 10) ?? '',
    })
    setOpen(true)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const payload = { ...form, percentual: form.percentual || undefined, inicio_em: form.inicio_em || undefined, fim_em: form.fim_em || undefined }
      if (editing) await adminApi.updatePromotion(editing.id, payload)
      else await adminApi.createPromotion(payload)
      toast(editing ? 'Promoção atualizada.' : 'Promoção criada.', 'success')
      setOpen(false)
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Eliminar esta promoção?')) return
    try {
      await adminApi.removePromotion(id)
      toast('Promoção eliminada.', 'info')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle
        title="Promoções"
        subtitle="Códigos e campanhas de desconto para condutores."
        actions={<Button onClick={() => openForm()}><Plus className="h-4 w-4" /> Nova promoção</Button>}
      />
      {loading ? (
        <Spinner label="A carregar promoções..." />
      ) : promotions.length === 0 ? (
        <EmptyState icon={<Tag className="h-10 w-10" />} title="Sem promoções" description="Cria ofertas para atrair mais condutores." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Percent className="h-5 w-5" /></span>
                <Badge tone={p.ativo ? 'green' : 'gray'}>{p.ativo ? 'Ativa' : 'Inativa'}</Badge>
              </div>
              <p className="mt-3 font-bold text-ink">{p.titulo}</p>
              {p.descricao && <p className="mt-1 text-sm text-muted">{p.descricao}</p>}
              {p.codigo && <p className="mt-2 inline-block rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-bold text-ink">{p.codigo}</p>}
              {p.percentual != null && <p className="mt-2 text-lg font-extrabold text-primary">{p.percentual}%</p>}
              {(p.inicio_em || p.fim_em) && (
                <p className="mt-2 text-xs text-muted">
                  {p.inicio_em ? `de ${p.inicio_em.slice(0, 10)}` : 'sem início'} {p.fim_em ? `até ${p.fim_em.slice(0, 10)}` : ''}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" onClick={() => openForm(p)} className="px-3"><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => remove(p.id)} className="text-sos hover:bg-red-50 hover:text-sos"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar promoção' : 'Nova promoção'}>
        <form onSubmit={submit} className="space-y-4">
          <Input label="Título" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Ex.: Desconto no guincho" />
          <Textarea label="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Código" value={form.codigo} onChange={(e) => setForm({ ...form, codigo: e.target.value })} placeholder="GUINCHO10" />
            <Input label="Percentual (%)" type="number" min="1" max="100" value={form.percentual} onChange={(e) => setForm({ ...form, percentual: e.target.value })} placeholder="10" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Início" type="date" value={form.inicio_em} onChange={(e) => setForm({ ...form, inicio_em: e.target.value })} />
            <Input label="Fim" type="date" value={form.fim_em} onChange={(e) => setForm({ ...form, fim_em: e.target.value })} />
          </div>
          <Select label="Estado" value={form.ativo} onChange={(e) => setForm({ ...form, ativo: e.target.value })}>
            <option value="1">Ativa</option>
            <option value="0">Inativa</option>
          </Select>
          <Button type="submit" loading={busy} className="w-full">{editing ? 'Guardar alterações' : 'Criar promoção'}</Button>
        </form>
      </Modal>
    </div>
  )
}