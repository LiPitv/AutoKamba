import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, MapPin, Wrench, Loader2 } from 'lucide-react'
import { authApi, categoryApi } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { AuthError } from './LoginPage'
import { Button, Input, Select, Textarea } from '../components/ui'
import { apiError } from '../utils/format'
import { useGeolocation } from '../components/Map'
import AuthShell from './AuthShell'

const tipos = [
  ['mecanico', 'Mecânico'],
  ['tecnico', 'Técnico automóvel'],
  ['eletricista', 'Eletricista automóvel'],
  ['reboque', 'Reboque / Guincho'],
  ['chaveiro', 'Chaveiro automóvel'],
  ['pneus', 'Técnico de pneus'],
  ['bateria', 'Técnico de baterias'],
  ['combustivel', 'Combustível'],
  ['outro', 'Outro'],
]

export default function RegisterProfessionalPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<{ id: number; nome: string }[]>([])
  const [form, setForm] = useState({
    nome: '', telefone: '', email: '', password: '', confirmar_password: '',
    tipo_profissional: 'mecanico', especialidade: '', experiencia: '', area_atendimento: 'Luanda',
    preco_base: '', descricao: '', latitude: '', longitude: '', endereco: '',
  })
  const [categorias, setCategorias] = useState<number[]>([])
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [locating, setLocating] = useState(false)
  const getLocation = useGeolocation()

  useEffect(() => {
    categoryApi.all().then(({ categories }) => setCategories(categories)).catch(() => undefined)
  }, [])

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const locate = async () => {
    setLocating(true)
    setError('')
    try {
      const pos = await getLocation()
      set('latitude', String(pos.latitude))
      set('longitude', String(pos.longitude))
      set('area_atendimento', 'Luanda')
    } catch (err) {
      setError(apiError(err))
    } finally {
      setLocating(false)
    }
  }

  const toggleCat = (id: number) =>
    setCategorias((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { token, user } = await authApi.registerProfessional({
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        password: form.password,
        confirmar_password: form.confirmar_password,
        tipo_profissional: form.tipo_profissional,
        especialidade: form.especialidade,
        experiencia: form.experiencia,
        area_atendimento: form.area_atendimento,
        preco_base: form.preco_base,
        descricao: form.descricao,
        categorias,
        latitude: form.latitude,
        longitude: form.longitude,
      })
      login(token, user)
      navigate('/app/servicos', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Criar conta de profissional" subtitle="Regista-te e começa a receber pedidos de assistência perto de ti.">
      <form onSubmit={submit} className="space-y-4">
        <AuthError message={error} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Nome completo</span>
            <span className="relative block">
              <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <Input value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ex.: Kianda Sousa" required className="pl-10.5" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Telefone</span>
            <span className="relative block">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <Input value={form.telefone} onChange={(e) => set('telefone', e.target.value)} placeholder="+244 923 000 000" required className="pl-10.5" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Email</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="voce@exemplo.ao" required className="pl-10.5" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Tipo de profissional</span>
            <Select value={form.tipo_profissional} onChange={(e) => set('tipo_profissional', e.target.value)}>
              {tipos.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </Select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Password</span>
            <span className="relative block">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
              <Input type={show ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} placeholder="Mínimo 6 caracteres" required className="pl-10.5 pr-10" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label="Mostrar password">
                {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Confirmar password</span>
            <Input type="password" value={form.confirmar_password} onChange={(e) => set('confirmar_password', e.target.value)} placeholder="Repete a password" required />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Especialidade</span>
            <Input value={form.especialidade} onChange={(e) => set('especialidade', e.target.value)} placeholder="Ex.: Motor diesel e injeção" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Anos de experiência</span>
            <Input type="number" min="0" max="60" value={form.experiencia} onChange={(e) => set('experiencia', e.target.value)} placeholder="Ex.: 8" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Área de atendimento</span>
            <Input value={form.area_atendimento} onChange={(e) => set('area_atendimento', e.target.value)} placeholder="Ex.: Talatona, Luanda" required />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink">Preço base (Kz)</span>
            <Input type="number" min="0" value={form.preco_base} onChange={(e) => set('preco_base', e.target.value)} placeholder="Ex.: 5000" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Apresentação</span>
          <Textarea value={form.descricao} onChange={(e) => set('descricao', e.target.value)} placeholder="Descreve o teu trabalho e experiência..." rows={3} />
        </label>

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-ink"><Wrench className="h-4 w-4 text-primary" /> Serviços que ofereces</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCat(c.id)}
                className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition ${
                  categorias.includes(c.id) ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-white text-muted ring-1 ring-gray-200 hover:ring-primary'
                }`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-bold text-ink"><MapPin className="h-4 w-4 text-primary" /> Localização base</p>
            <button type="button" onClick={locate} disabled={locating} className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-primary-dark ring-1 ring-gray-200 hover:ring-primary disabled:opacity-60">
              {locating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <MapPin className="h-3.5 w-3.5" />}
              {locating ? 'A localizar...' : 'Usar a minha localização'}
            </button>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input type="number" step="any" value={form.latitude} onChange={(e) => set('latitude', e.target.value)} placeholder="Latitude (-8.83)" required />
            <Input type="number" step="any" value={form.longitude} onChange={(e) => set('longitude', e.target.value)} placeholder="Longitude (13.23)" required />
          </div>
          <Input className="mt-3" value={form.endereco} onChange={(e) => set('endereco', e.target.value)} placeholder="Endereço (ex.: Rua 4, Talatona)" />
        </div>

        <Button type="submit" loading={busy} className="w-full">Criar conta de profissional</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Já tens conta?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">Entrar</Link>
      </p>
    </AuthShell>
  )
}