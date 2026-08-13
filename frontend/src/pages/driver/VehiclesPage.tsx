import { useRef, useState, type FormEvent } from 'react'
import { Car, Star as StarIcon, Trash2 } from 'lucide-react'
import { vehicleApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, Input, Modal, PageTitle, Select, Spinner } from '../../components/ui'
import { apiError } from '../../utils/format'
import { useToast } from '../../components/Toast'

const markers = ['Toyota', 'Hyundai', 'Kia', 'Nissan', 'Ford', 'Chevrolet', 'Mercedes-Benz', 'Volkswagen', 'Mitsubishi', 'Isuzu', 'Outra']

export default function VehiclesPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => vehicleApi.all(), [])
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ placa: '', marca: '', modelo: '', cor: '', ano: '', tipo: 'carro' })
  const [foto, setFoto] = useState<File | null>(null)

  const vehicles: any[] = data?.vehicles ?? []

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    const formData = new FormData()
    Object.entries(form).forEach(([k, v]) => v && formData.append(k, v))
    if (foto) formData.append('foto', foto)
    try {
      await vehicleApi.create(formData)
      toast('Veículo adicionado com sucesso.', 'success')
      setOpen(false)
      setForm({ placa: '', marca: '', modelo: '', cor: '', ano: '', tipo: 'carro' })
      setFoto(null)
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    if (!window.confirm('Remover este veículo?')) return
    try {
      await vehicleApi.remove(id)
      toast('Veículo removido.', 'info')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  const principal = async (id: number) => {
    try {
      await vehicleApi.principal(id)
      refetch()
      toast('Veículo principal atualizado.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  return (
    <div>
      <PageTitle
        title="Os meus veículos"
        subtitle="Regista os teus veículos para pedidos de assistência mais rápidos."
        actions={<Button onClick={() => setOpen(true)}><Car className="h-4 w-4" /> Adicionar veículo</Button>}
      />
      {loading ? (
        <Spinner label="A carregar veículos..." />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={<Car className="h-10 w-10" />}
          title="Sem veículos registados"
          description="Adiciona o teu primeiro veículo para que os profissionais saibam o que encontrar."
          action={<Button onClick={() => setOpen(true)}>Adicionar veículo</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Card key={v.id} className="relative">
              {v.principal ? (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary-dark">
                  <StarIcon className="h-3 w-3 fill-current" /> Principal
                </span>
              ) : (
                <button onClick={() => principal(v.id)} className="absolute right-4 top-4 text-xs font-bold text-muted hover:text-primary">
                  Definir principal
                </button>
              )}
              {v.foto ? (
                <img src={v.foto} alt={`${v.marca} ${v.modelo}`} className="h-32 w-full rounded-xl object-cover" />
              ) : (
                <span className="flex h-32 w-full items-center justify-center rounded-xl bg-gray-50 text-ink"><Car className="h-12 w-12" /></span>
              )}
              <p className="mt-3 font-bold text-ink">{v.marca} {v.modelo}</p>
              <p className="mt-1 flex items-center justify-between text-sm text-muted">
                <span>{v.placa}</span>
                <span>{v.cor} {v.ano ? `• ${v.ano}` : ''}</span>
              </p>
              <button onClick={() => remove(v.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sos hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Remover
              </button>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Adicionar veículo">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Matrícula" required value={form.placa} onChange={(e) => set('placa', e.target.value)} placeholder="LD-23-45-AB" />
            <Input label="Marca" required value={form.marca} onChange={(e) => set('marca', e.target.value)} placeholder="Toyota" list="marcas" />
            <datalist id="marcas">{markers.map((m) => <option key={m} value={m} />)}</datalist>
            <Input label="Modelo" required value={form.modelo} onChange={(e) => set('modelo', e.target.value)} placeholder="Corolla" />
            <Select label="Ano" value={form.ano} onChange={(e) => set('ano', e.target.value)} defaultOption="Seleciona">
              {Array.from({ length: 40 }, (_, i) => String(new Date().getFullYear() - i)).map((a) => <option key={a} value={a}>{a}</option>)}
            </Select>
            <Select label="Tipo" value={form.tipo} onChange={(e) => set('tipo', e.target.value)} disabled>
              <option value="carro">Carro</option>
            </Select>
          </div>
          <Input label="Cor" value={form.cor} onChange={(e) => set('cor', e.target.value)} placeholder="Preto" />
          <button type="button" onClick={() => fileRef.current?.click()} className="w-full rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm font-semibold text-muted hover:border-primary hover:text-primary">
            {foto ? `📷 ${foto.name}` : 'Adicionar foto (opcional)'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
          <Button type="submit" loading={busy} className="w-full">Guardar veículo</Button>
        </form>
      </Modal>
    </div>
  )
}