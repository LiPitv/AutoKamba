import { Link } from 'react-router-dom'
import { Car, Wrench, ArrowRight, ChevronLeft } from 'lucide-react'
import AuthShell from './AuthShell'

export default function RegisterPage() {
  return (
    <AuthShell title="Cria a tua conta" subtitle="Escolhe o tipo de conta que queres criar.">
      <div className="space-y-4">
        <Link to="/registar-condutor" className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5">
          <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
            <Car className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink">Sou condutor</p>
            <p className="text-sm text-muted">Preciso de assistência na estrada</p>
          </div>
          <ArrowRight className="h-4.5 w-4.5 text-muted transition group-hover:text-primary" />
        </Link>
        <Link to="/registar-profissional" className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-primary hover:shadow-lg hover:shadow-primary/5">
          <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
            <Wrench className="h-6 w-6" />
          </span>
          <div className="flex-1">
            <p className="font-bold text-ink">Sou profissional</p>
            <p className="text-sm text-muted">Quero receber pedidos de assistência</p>
          </div>
          <ArrowRight className="h-4.5 w-4.5 text-muted transition group-hover:text-primary" />
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Já tens conta?{' '}
        <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
          <ChevronLeft className="mr-0.5 inline h-3.5 w-3.5" />
          Entrar agora
        </Link>
      </p>
    </AuthShell>
  )
}