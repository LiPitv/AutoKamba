import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Logo } from '../components/Logo'
import { Phone } from 'lucide-react'

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-gradient-to-br from-gray-900 to-primary-dark p-10 text-white lg:flex">
        <Link to="/" className="w-fit">
          <Logo dark />
        </Link>
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
          <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">
          <Link to="/" className="font-semibold text-primary hover:text-primary-dark">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  )
}