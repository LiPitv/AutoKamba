import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, Car } from 'lucide-react'
import { authApi, vehicleApi } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { AuthError } from './LoginPage'
import { Button, Input, Select } from '../components/ui'
import { apiError } from '../utils/format'
import AuthShell from './AuthShell'

export default function RegisterDriverPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', password: '', confirmar_password: '', placa: '', marca: '', modelo: '', cor: '', ano: '' })
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { token, user } = await authApi.registerDriver({
        nome: form.nome,
        telefone: form.telefone,
        email: form.email,
        password: form.password,
        confirmar_password: form.confirmar_password,
      })
      login(token, user)
      if (form.placa && form.marca) {
        const formData = new FormData()
        formData.append('placa', form.placa)
        formData.append('marca', form.marca)
        formData.append('modelo', form.modelo)
        formData.append('cor', form.cor)
        formData.append('ano', form.ano)
        formData.append('principal', '1')
        await vehicleApi.create(formData).catch(() => undefined)
      }
      navigate('/app/pedir-assistencia', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Criar conta de condutor" subtitle="Regista-te em menos de 2 minutos e viaja em segurança.">
      <form onSubmit={submit} className="space-y-4">
        <AuthError message={error} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Nome completo</span>
          <span className="relative block">
            <UserIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <Input value={form.nome} onChange={(e) => set('nome', e.target.value)} placeholder="Ex.: João Manuel dos Santos" required className="pl-10.5" />
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
        <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-ink"><Car className="h-4 w-4 text-primary" /> Veículo (opcional)</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Input value={form.placa} onChange={(e) => set('placa', e.target.value)} placeholder="Matrícula (ex.: LD-23-45-AB)" />
            <Input value={form.marca} onChange={(e) => set('marca', e.target.value)} placeholder="Marca (ex.: Toyota)" />
            <Input value={form.modelo} onChange={(e) => set('modelo', e.target.value)} placeholder="Modelo (ex.: Corolla)" />
            <Input value={form.cor} onChange={(e) => set('cor', e.target.value)} placeholder="Cor" />
            <Select value={form.ano} onChange={(e) => set('ano', e.target.value)} defaultOption="Ano">
              {Array.from({ length: 30 }, (_, i) => String(new Date().getFullYear() - i)).map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </Select>
          </div>
        </div>

        <Button type="submit" loading={busy} className="w-full">Criar conta</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Já tens conta?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">Entrar</Link>
      </p>
    </AuthShell>
  )
}