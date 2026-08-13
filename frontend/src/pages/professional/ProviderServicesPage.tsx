import { useEffect, useState, type FormEvent } from 'react'
import { Briefcase, Pencil, Plus, Trash2, Power } from 'lucide-react'
import { categoryApi, professionalApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, Input, Modal, PageTitle, Select, Spinner, Textarea, Badge } from '../../components/ui'
import { apiError } from '../../utils/format'
import { useToast } from '../../components/Toast'

interface ServiceRow {
  id: number
  category_id: number
  categoria_nome?: string
  nome: string
  preco: number | null
  descricao: string | null
  ativo: number
}

export default function ProviderServicesPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => professionalApi.services(), [])
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [editing, setEditing] = useState<ServiceRow | null>(null)
  const [form, setForm] = useState({ category_id: '', nome: '', preco: '', descricao: '' })

  const services: ServiceRow[] = data?.services ?? []

  useEffect(() => {
    categoryApi.all().then(({ categories }) => setCategories(categories)).catch(() => undefined)
  }, [])

  const openForm = (service?: ServiceRow) => {
    setEditing(service ?? null)
    setForm({
      category_id: service ? String(service.category_id) : String(categories[0]?.id ?? ''),
      nome: service?.nome ?? '',
      preco: service?.preco != null ? String(service.preco) : '',
      descricao: service?.descricao ?? '',
    })
    setOpen(true)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    try {
      const payload = { category_id: Number(form.category_id), nome: form.nome, preco: Number(form.preco || 0), descricao: form.descricao || undefined, ativo: 1 }
      if (editing) await professionalApi.updateService(editing.id, payload)
      else await professionalApi.createService(payload)
      toast(editing ? 'Serviço atualizado.' : 'Serviço criado com sucesso.', 'success')
      setOpen(false)
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Remover este serviço?')) return
    try {
      await professionalApi.removeService(id)
      toast('Serviço removido.', 'info')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  const toggle = async (s: ServiceRow) => {
    try {
      await professionalApi.updateService(s.id, { ativo: s.ativo ? 0 : 1 })
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle
        title="Os meus serviços"
        subtitle="Define o que ofereces e quanto cobras. Inclui o teu preço base e as categorias que atendes."
        actions={<Button onClick={() => openForm()}><Plus className="h-4 w-4" /> Novo serviço</Button>}
      />
      {loading ? (
        <Spinner label="A carregar serviços..." />
      ) : services.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-10 w-10" />}
          title="Sem serviços configurados"
          description="Regista os teus serviços para que os condutores te encontrem nos pedidos."
          action={<Button onClick={() => openForm()}>Criar o meu primeiro serviço</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <Card key={s.id} className={!s.ativo ? 'opacity-60' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink">{s.nome}</p>
                  <p className="text-xs text-muted">{s.categoria_nome}</p>
                </div>
                <Badge tone={s.ativo ? 'green' : 'gray'}>{s.ativo ? 'Ativo' : 'Inativo'}</Badge>
              </div>
              <p className="mt-2 text-xl font-extrabold text-primary">{s.preco != null ? `${s.preco} Kz` : 'A combinar'}</p>
              {s.descricao && <p className="mt-1 text-sm text-muted">{s.descricao}</p>}
              <div className="mt-4 flex items-center gap-2">
                <Button variant="outline" onClick={() => openForm(s)} className="px-3"><Pencil className="h-4 w-4" /> Editar</Button>
                <Button variant="ghost" onClick={() => toggle(s)} title={s.ativo ? 'Desativar' : 'Ativar'}><Power className="h-4 w-4" /></Button>
                <Button variant="ghost" onClick={() => remove(s.id)} className="text-sos hover:bg-red-50 hover:text-sos"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Editar serviço' : 'Novo serviço'}>
        <form onSubmit={submit} className="space-y-4">
          <Select label="Categoria" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </Select>
          <Input label="Nome do serviço" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Ex.: Troca de pneu no local" />
          <Input label="Preço (Kz)" type="number" min="0" required value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} placeholder="Ex.: 5000" />
          <Textarea label="Descrição (opcional)" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} rows={3} placeholder="Inclui o que está coberto..." />
          <Button type="submit" loading={busy} className="w-full">{editing ? 'Guardar alterações' : 'Criar serviço'}</Button>
        </form>
      </Modal>
    </div>
  )
}