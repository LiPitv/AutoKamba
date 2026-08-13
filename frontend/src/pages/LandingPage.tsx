import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone, ShieldCheck, Star, MapPin, Car, Wrench, Truck, Percent, BatteryCharging, KeyRound,
  Fuel, Zap, ChevronDown, ArrowRight, Clock, CheckCircle2, MessageCircle, CreditCard, Loader2,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import api from '../services/api'

const servicos = [
  { icon: <Wrench className="h-6 w-6" />, titulo: 'Mecânica', desc: 'Avarias mecânicas, diagnóstico e reparações no local.' },
  { icon: <Truck className="h-6 w-6" />, titulo: 'Reboque e guincho', desc: 'Transporte do veículo até à oficina que preferir.' },
  { icon: <Percent className="h-6 w-6" />, titulo: 'Pneus', desc: 'Furo ou rebentamento? Trocamos o pneu onde estiver.' },
  { icon: <BatteryCharging className="h-6 w-6" />, titulo: 'Baterias', desc: 'Bateria descarregada: recarga ou substituição imediata.' },
  { icon: <KeyRound className="h-6 w-6" />, titulo: 'Chaveiro', desc: 'Chaves trancadas dentro do carro. Recuperação no local.' },
  { icon: <Fuel className="h-6 w-6" />, titulo: 'Combustível', desc: 'Sem combustível? Entregamos combustível até si.' },
  { icon: <Zap className="h-6 w-6" />, titulo: 'Eletricista automóvel', desc: 'Problemas elétricos, alternador e iluminação.' },
  { icon: <Car className="h-6 w-6" />, titulo: 'Técnico automóvel', desc: 'Acompanhamento e apoio técnico no local.' },
]

const passos = [
  { num: '01', titulo: 'Peça ajuda em segundos', desc: 'Pressione o botão SOS ou descreva a avaria. A sua localização é enviada automaticamente.' },
  { num: '02', titulo: 'Escolha o profissional', desc: 'Receba em minutos propostas de profissionais verificados, com avaliações e preço.' },
  { num: '03', titulo: 'Acompanhe em tempo real', desc: 'Siga o profissional no mapa até chegarem a si. Comunicação direta por chat.' },
  { num: '04', titulo: 'Pague com transparência', desc: 'Pague em dinheiro ou multicaixa e avalie o serviço após a conclusão.' },
]

const faqs = [
  { q: 'Como funciona o pedido de assistência?', a: 'Crie a conta, adicione o seu veículo e pressione o botão SOS no momento da avaria. Enviamos o seu pedido aos profissionais verificados na sua zona e recebe propostas em poucos minutos.' },
  { q: 'Quanto custa usar a AutoKamba?', a: 'A criação de conta e o pedido de assistência são gratuitos. Paga apenas o valor do serviço acordado com o profissional, em dinheiro ou multicaixa.' },
  { q: 'Os profissionais são verificados?', a: 'Sim. Todos os profissionais passam por um processo de verificação de identidade, documentos e registo de atividade antes de receberem pedidos.' },
  { q: 'Que zonas são cobertas?', a: 'Estamos a operar em Luanda, com cobertura em expansão. Ao fazer o pedido, apenas profissionais na sua zona recebem a sua solicitação.' },
  { q: 'O que acontece se o profissional não vier?', a: 'O pedido é reatribuído automaticamente a outro profissional disponível. Pode também cancelar a qualquer momento e contactar o nosso suporte.' },
  { q: 'Como são definidos os preços?', a: 'O profissional apresenta o preço na proposta e o condutor aceita antes do início do serviço. Não há valores escondidos.' },
]

function Faq({ item }: { item: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-gray-100 bg-white">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="text-sm font-semibold text-ink sm:text-base">{item.q}</span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm leading-relaxed text-muted">{item.a}</p>}
    </div>
  )
}

export default function LandingPage() {
  const [stats, setStats] = useState<{ professionals: number; assistencias: number; tempoMedio: string }>({
    professionals: 0,
    assistencias: 0,
    tempoMedio: '--',
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profRes, reqRes] = await Promise.all([
          api.get('/stats/professionals').catch(() => ({ data: { total: 0 } })),
          api.get('/stats/requests').catch(() => ({ data: { total: 0, tempoMedio: '--' } })),
        ])
        setStats({
          professionals: profRes.data?.total ?? 0,
          assistencias: reqRes.data?.total ?? 0,
          tempoMedio: reqRes.data?.tempoMedio ?? '--',
        })
      } catch {
        // silencioso - mantém zeros
      } finally {
        setLoadingStats(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted lg:flex">
            <a href="#como-funciona" className="hover:text-primary-dark">Como funciona</a>
            <a href="#servicos" className="hover:text-primary-dark">Serviços</a>
            <a href="#seguranca" className="hover:text-primary-dark">Segurança</a>
            <a href="#profissionais" className="hover:text-primary-dark">Para profissionais</a>
            <a href="#faq" className="hover:text-primary-dark">FAQ</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-ink hover:bg-gray-50">Entrar</Link>
            <Link to="/registar" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 hover:bg-primary-dark">Criar conta</Link>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary-dark">
              <MapPin className="h-3.5 w-3.5" /> Luanda e arredores
            </span>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-ink sm:text-5xl xl:text-6xl">
              O teu parceiro <span className="text-primary">na estrada</span>.<br />
              Avariou? Nós resolvemos.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted">
              Pane, furo, bateria ou chave perdida? Pede assistência em segundos e acompanha o profissional
              até si em tempo real, com preço combinado e sem surpresas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/registar" className="inline-flex items-center gap-2 rounded-xl bg-sos px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-sos/25 hover:bg-red-700">
                <Phone className="h-5 w-5" /> Pedir SOS agora
              </Link>
              <a href="#como-funciona" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-ink hover:border-primary hover:text-primary-dark">
                Como funciona <ArrowRight className="h-4.5 w-4.5" />
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-8">
              {[
                { valor: loadingStats ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : stats.professionals > 0 ? `${stats.professionals}+` : '—', rotulo: 'profissionais verificados' },
                { valor: loadingStats ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : stats.assistencias > 0 ? `${stats.assistencias}+` : '—', rotulo: 'assistências concluídas' },
                { valor: loadingStats ? <Loader2 className="h-6 w-6 animate-spin text-primary" /> : stats.tempoMedio, rotulo: 'tempo médio de resposta' },
              ].map((s) => (
                <div key={s.rotulo}>
                  <p className="text-2xl font-extrabold text-ink">{typeof s.valor === 'string' ? s.valor : s.valor}</p>
                  <p className="text-xs text-muted">{s.rotulo}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto w-full max-w-md">
            <div className="relative rounded-3xl bg-primary p-1.5 shadow-2xl shadow-primary/20">
              <div className="rounded-3xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink">Pedido de assistência</p>
                  <span className="rounded-full bg-sos/10 px-2.5 py-1 text-[10px] font-bold text-sos">SOS ACTIVO</span>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl bg-gray-50 p-3.5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sos text-white"><Phone className="h-5 w-5" /></span>
                  <div>
                    <p className="text-sm font-bold text-ink">Avaria: bateria</p>
                    <p className="text-xs text-muted">Onde estiveres • pedido em minutos</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    { nome: 'Profissional perto de si', tipo: 'Recebe propostas em minutos', preco: 'Preço combinado', min: '--' },
                  ].map((p, i) => (
                    <div key={p.nome} className="flex items-center gap-3 rounded-2xl border border-primary bg-primary/5 p-3.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-ink">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">{p.nome}</p>
                        <p className="text-[11px] text-muted">{p.tipo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink">{p.preco}</p>
                        <span className="text-[10px] font-semibold text-primary">Aguardando pedidos</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-gray-900 p-4 text-white">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Profissional a caminho</span><span>Distância • ETA</span>
                  </div>
                  <div className="mt-2.5 h-1.5 rounded-full bg-gray-700">
                    <div className="h-1.5 w-2/3 rounded-full bg-primary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-primary" /> Profissionais verificados e avaliados
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Como funciona</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Da avaria à solução em 4 passos</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((p) => (
            <div key={p.num} className="rounded-2xl border border-gray-100 bg-white p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition">
              <span className="text-3xl font-black text-primary/25">{p.num}</span>
              <h3 className="mt-3 text-lg font-bold text-ink">{p.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="servicos" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Serviços</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Qualquer avaria, um só lugar</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Reboque, mecânica, pneus, baterias, chaveiro e mais — profissionais prontos para o ajudar.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {servicos.map((s) => (
              <div key={s.titulo} className="group rounded-2xl border border-gray-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white">
                  {s.icon}
                </span>
                <h3 className="mt-4 font-bold text-ink">{s.titulo}</h3>
                <p className="mt-1.5 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="seguranca" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, t: 'Verificação de identidade', d: 'Documentos e registo validados antes de aceitar pedidos.' },
              { icon: <Star className="h-5 w-5" />, t: 'Avaliações reais', d: 'Cada serviço concluído gera uma avaliação para condutores e profissionais.' },
              { icon: <MapPin className="h-5 w-5" />, t: 'Partilha de localização', d: 'O condutor acompanha o trajeto do profissional em tempo real.' },
              { icon: <MessageCircle className="h-5 w-5" />, t: 'Suporte dedicado', d: 'Reclamações e pedidos de ajuda respondidos pela equipa AutoKamba.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-gray-100 bg-white p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">{c.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-ink">{c.t}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Segurança</p>
            <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">A tua segurança é o nosso compromisso</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Todos os profissionais da AutoKamba são verificados antes de começarem a receber pedidos.
              Avaliações e classificações mantêm a comunidade transparente, e o botão SOS garante ajuda
              sempre que precisar, de dia ou de noite.
            </p>
            <ul className="mt-6 space-y-3">
              {['Registo e verificação obrigatória de documentos', 'Seguro e acompanhamento em tempo real', 'Cancelamento gratuito até o profissional iniciar o serviço'].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm font-medium text-ink">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="profissionais" className="bg-gradient-to-br from-gray-900 to-primary-dark py-20 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Para profissionais</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Aumenta os teus ganhos, nós trazemos os clientes</h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Recebe pedidos de assistência direto no telemóvel, nas horas que escolheres. Define os teus
              serviços, preços e horários, com pagamentos combinados com antecedência.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: <Clock className="h-5 w-5" />, t: 'Horário flexível', d: 'Online quando quiseres.' },
                { icon: <Car className="h-5 w-5" />, t: 'Clientes próximos', d: 'Sem deslocações longas.' },
                { icon: <CreditCard className="h-5 w-5" />, t: 'Preço combinado', d: 'Garantido por pedido.' },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl bg-white/5 p-4">
                  <span className="text-primary">{c.icon}</span>
                  <h3 className="mt-2 text-sm font-bold">{c.t}</h3>
                  <p className="mt-1 text-xs text-white/60">{c.d}</p>
                </div>
              ))}
            </div>
            <Link to="/registar-profissional" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-primary-dark hover:bg-gray-100">
              Quero ser profissional <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
          <div className="rounded-3xl bg-white/5 p-8 backdrop-blur">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white"><Wrench className="h-7 w-7" /></span>
            <div className="mt-6 space-y-3">
              {['Registo gratuito e sem mensalidades', 'Comissão justa apenas sobre serviços concluídos', 'Avaliações que constroem a tua reputação', 'Clientes próximos na tua zona'].map((t) => (
                <div key={t} className="flex items-center gap-2.5 text-sm text-white/80">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Perguntas frequentes</h2>
        </div>
        <div className="mt-10 space-y-3">
          {faqs.map((f) => <Faq key={f.q} item={f} />)}
        </div>
      </section>

      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Avariou na estrada? Não entres em pânico.</h2>
          <p className="mt-3 text-lg text-muted">Cria a conta agora e fica protegido em todas as viagens.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/registar" className="inline-flex items-center gap-2 rounded-xl bg-sos px-6 py-3.5 font-bold text-white shadow-lg shadow-sos/25 hover:bg-red-700">
              <Phone className="h-5 w-5" /> Pedir SOS agora
            </Link>
            <Link to="/registar-profissional" className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-ink hover:border-primary hover:text-primary-dark">
              Sou profissional <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-4">
          <div>
            <Logo dark />
            <p className="mt-4 text-sm leading-relaxed text-white/60">O teu parceiro na estrada. Assistência automóvel rápida, segura e acessível em Luanda.</p>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/40">Plataforma</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li><a href="#como-funciona" className="hover:text-white">Como funciona</a></li>
              <li><a href="#servicos" className="hover:text-white">Serviços</a></li>
              <li><a href="#profissionais" className="hover:text-white">Para profissionais</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/40">Contactos</p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              <li>Luanda, Angola</li>
              <li>+244 923 000 000</li>
              <li>suporte@autokamba.co.ao</li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white/40">Emergência</p>
            <p className="mt-4 text-sm text-white/70">Em caso de emergência grave, ligue sempre os serviços de emergência locais antes de usar a app.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 px-4 pt-6 text-xs text-white/40 sm:px-6">
          © {new Date().getFullYear()} AutoKamba. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}