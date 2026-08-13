import { Link } from 'react-router-dom'
import { AlertTriangle, Phone, ShieldCheck, Siren, MapPin, Car, BookOpen } from 'lucide-react'
import { PageTitle, Card, Button } from '../../components/ui'

const dicas = [
  {
    icon: <Car className="h-5 w-5" />,
    t: 'Antes de partir',
    d: 'Verifica pneus, óleo, líquido de arrefecimento, luzes e travões. Mantém o depósito acima de ¼.',
  },
  {
    icon: <Siren className="h-5 w-5" />,
    t: 'Em caso de avaria',
    d: 'Liga as luzes de perigo, coloque o colete refletor e o triângulo de sinalização. Se possível, pare fora da via.',
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    t: 'Segurança com profissionais',
    d: 'Verifica sempre a identidade do profissional antes de partilhar demasiadas informações. Pede o pedido pela app.',
  },
  {
    icon: <MapPin className="h-5 w-5" />,
    t: 'Partilha a tua localização',
    d: 'Ao pedir assistência pela app envias a localização em tempo real à nossa central e ao profissional selecionado.',
  },
]

const contactos = [
  { nome: 'Emergência (112)', desc: 'Bombeiros, polícia e emergência médica', valor: '112' },
  { nome: 'Bombeiros (Luanda)', desc: 'Incêndios e resgates', valor: '115' },
  { nome: 'Polícia (Luanda)', desc: 'Autoridade nacional', valor: '113' },
  { nome: 'Linha AutoKamba', desc: 'Suporte da plataforma', valor: '+244 923 000 000' },
]

export default function SafetyPage() {
  return (
    <div className="space-y-8">
      <PageTitle title="Seguro e SOS" subtitle="Dicas e contactos para te manteres seguro na estrada." />

      <Card className="border-sos/20 bg-sos/5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sos text-white"><Siren className="h-7 w-7" /></span>
          <div className="flex-1">
            <p className="text-lg font-extrabold text-ink">Emergência? A AutoKamba está contigo.</p>
            <p className="text-sm text-muted">Em caso de perigo imediato liga primeiro os serviços de emergência locais, depois pede ajuda na app.</p>
          </div>
          <Link to="/app/pedir-assistencia">
            <Button variant="sos"><Phone className="h-4 w-4" /> Pedir SOS agora</Button>
          </Link>
        </div>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-bold text-ink">Contactos de emergência</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {contactos.map((c) => (
            <Card key={c.nome} className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sos/10 text-sos"><AlertTriangle className="h-5 w-5" /></span>
              <div className="flex-1">
                <p className="font-bold text-ink">{c.nome}</p>
                <p className="text-xs text-muted">{c.desc}</p>
              </div>
              <a href={`tel:${c.valor.replace(/\s/g, '')}`} className="text-sm font-extrabold text-primary">{c.valor}</a>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-bold text-ink">Dicas de segurança</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {dicas.map((d) => (
            <Card key={d.t}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{d.icon}</span>
              <p className="mt-3 font-bold text-ink">{d.t}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{d.d}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <p className="flex items-center gap-2 font-bold text-ink"><BookOpen className="h-5 w-5 text-primary" /> Como funciona o botão SOS</p>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span> Abre a app e toca em <b className="text-ink">Pedir SOS agora</b> — a tua localização é enviada automaticamente.</li>
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span> Descreve a avaria e escolhe o tipo de assistência.</li>
          <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">3</span> Recebes propostas de profissionais verificados e acompanhas o resgate em tempo real.</li>
        </ol>
        <p className="mt-4 rounded-xl bg-gray-50 p-3.5 text-xs text-muted">
          A AutoKamba não substitui os serviços de emergência oficiais. Em situações de risco (incêndio, colisão grave, saúde), ligue 112 em primeiro lugar.
        </p>
      </Card>
    </div>
  )
}