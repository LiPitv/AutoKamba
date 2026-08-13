import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { authApi } from '../services'
import { useAuth } from '../contexts/AuthContext'
import { Logo } from '../components/Logo'
import { Button } from '../components/ui'
import { apiError } from '../utils/format'

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-gray-900 to-primary-dark p-10 text-white lg:flex">
        <button className="w-fit cursor-pointer" onClick={() => (window.location.href = '/')}>
          <Logo dark />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold leading-tight">Avariou?<br />Estamos a caminho.</h2>
          <p className="mt-3 max-w-sm text-white/70">Assistência automóvel rápida e segura. Peça ajuda em segundos, acompanhe o profissional em tempo real.</p>
          <div className="mt-6 space-y-2.5 text-sm text-white/80">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> Botão SOS num toque</p>
            <p className="flex items-center gap-2"><span className="text-primary">✓</span> Profissionais 100% verificados</p>
            <p className="flex items-center gap-2"><span className="text-primary">✓</span> Preço combinado antes do serviço</p>
          </div>
        </div>
        <p className="text-xs text-white/40">© {new Date().getFullYear()} AutoKamba — O teu parceiro na estrada</p>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60">
          <div className="mb-6 flex justify-center lg:hidden">
            <Link to="/"><Logo /></Link>
          </div>
          {children}
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link to="/" className="font-semibold text-primary hover:text-primary-dark">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null
  return <div className="rounded-xl bg-sos/10 px-4 py-3 text-sm font-medium text-sos">{message}</div>
}

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (loading) return null
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/app/admin' : user.role === 'prestador' ? '/app/dashboard' : '/app/pedir-assistencia'} replace />
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const { token, user } = await authApi.login(email.trim(), password)
      login(token, user)
      navigate(user.role === 'admin' ? '/app/admin' : user.role === 'prestador' ? '/app/dashboard' : '/app/pedir-assistencia', { replace: true })
    } catch (err) {
      setError(apiError(err))
    } finally {
      setBusy(false)
    }
  }

  const fill = (mail: string) => {
    setEmail(mail)
    setPassword('admin123')
  }

  return (
    <AuthShell>
      <h1 className="text-2xl font-extrabold text-ink">Bem-vindo de volta!</h1>
      <p className="mt-1.5 text-sm text-muted">Acede à tua conta para continuares a viajar em segurança.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <AuthError message={error} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Email</span>
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.ao"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10.5 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Password</span>
          <span className="relative block">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted" />
            <input
              type={show ? 'text' : 'password'}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10.5 pr-11 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink" aria-label="Mostrar password">
              {show ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </span>
        </label>
        <Button type="submit" loading={busy} className="w-full">Entrar</Button>
      </form>
      <div className="mt-5 rounded-xl bg-gray-50 p-3.5 text-xs text-muted">
        <p className="font-semibold text-ink">Contas de demonstração (password: admin123)</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {[
            ['Condutor', 'joao@autokamba.co.ao'],
            ['Profissional', 'kianda@autokamba.co.ao'],
            ['Admin', 'admin@autokamba.co.ao'],
          ].map(([label, mail]) => (
            <button key={mail} type="button" onClick={() => fill(mail)} className="rounded-lg bg-white px-2.5 py-1.5 font-semibold text-primary-dark shadow-sm ring-1 ring-gray-200 hover:ring-primary">
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Ainda não tens conta?{' '}
        <Link to="/registar" className="font-semibold text-primary hover:text-primary-dark">Criar conta</Link>
      </p>
    </AuthShell>
  )
}