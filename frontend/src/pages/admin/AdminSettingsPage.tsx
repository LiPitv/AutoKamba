import { useState, type FormEvent } from 'react'
import { Coins, MapPin, Percent, Timer } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, Input, PageTitle, Spinner } from '../../components/ui'
import { apiError } from '../../utils/format'
import { useToast } from '../../components/Toast'

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => adminApi.settings(), [])
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})

  if (loading && !data) return <Spinner label="A carregar configurações..." />

  const settings: Record<string, string> = data?.settings ?? {}

  const campo = (chave: string) => form[chave] ?? settings[chave] ?? ''

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      await adminApi.updateSettings(form)
      toast('Configurações guardadas com sucesso.', 'success')
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle title="Configurações do sistema" subtitle="Parâmetros globais da plataforma." />
      <form onSubmit={submit} className="space-y-4">
        <Card>
          <p className="flex items-center gap-2 font-bold text-ink"><Coins className="h-5 w-5 text-primary" /> Comissão da plataforma</p>
          <p className="mt-1 text-sm text-muted">Percentual aplicado automaticamente sobre cada serviço concluído com valor.</p>
          <div className="mt-4">
            <Input
              label="Taxa de comissão (%)"
              type="number"
              min="0"
              max="100"
              step="0.1"
              required
              value={campo('commission_rate')}
              onChange={(e) => setForm({ ...form, commission_rate: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 font-bold text-ink"><Timer className="h-5 w-5 text-primary" /> Tempos do pedido</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Tempo máximo de aceitação (min)"
              type="number"
              min="1"
              required
              value={campo('accept_timeout_minutes')}
              onChange={(e) => setForm({ ...form, accept_timeout_minutes: e.target.value })}
            />
            <Input
              label="Raio de procura (km)"
              type="number"
              min="1"
              required
              value={campo('search_radius_km')}
              onChange={(e) => setForm({ ...form, search_radius_km: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 font-bold text-ink"><MapPin className="h-5 w-5 text-primary" /> Cidade e preço base</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Cidade padrão"
              value={campo('default_city')}
              onChange={(e) => setForm({ ...form, default_city: e.target.value })}
            />
            <Input
              label="Preço base de referência (Kz)"
              type="number"
              min="0"
              value={campo('base_price')}
              onChange={(e) => setForm({ ...form, base_price: e.target.value })}
            />
          </div>
        </Card>

        <Card>
          <p className="flex items-center gap-2 font-bold text-ink"><Percent className="h-5 w-5 text-primary" /> Contactos e promoção</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Input
              label="Linha de suporte"
              value={campo('support_phone')}
              onChange={(e) => setForm({ ...form, support_phone: e.target.value })}
            />
            <Input
              label="Email de suporte"
              value={campo('support_email')}
              onChange={(e) => setForm({ ...form, support_email: e.target.value })}
            />
          </div>
        </Card>

        <Button type="submit" loading={busy} className="w-full py-3.5">Guardar configurações</Button>
      </form>
    </div>
  )
}