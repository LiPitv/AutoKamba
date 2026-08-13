import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, MapPin, Navigation, Phone, Send, Star, Wrench } from 'lucide-react'
import { messageApi, requestApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, Input, PageTitle, Select, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { Map } from '../../components/Map'
import { apiError, dateTime, money } from '../../utils/format'
import { useToast } from '../../components/Toast'

const SEQ = [
  { status: 'aceite', label: 'Aceite', desc: 'Pedido aceite' },
  { status: 'a_caminho', label: 'A caminho', desc: 'Estás a caminho do condutor' },
  { status: 'chegou', label: 'Chegou', desc: 'Chegaste ao local' },
  { status: 'em_atendimento', label: 'Em andamento', desc: 'Serviço em execução' },
  { status: 'concluido', label: 'Concluído', desc: 'Serviço concluído' },
]

export default function CurrentServicePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => requestApi.mine(), [])

  const requests: any[] = data?.requests ?? []
  const current = requests.find((r) => !['concluido', 'cancelado', 'rejeitado'].includes(r.status))

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [valor, setValor] = useState('')
  const [metodo, setMetodo] = useState('dinheiro')
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!current) return
    messageApi.list(current.id).then((r) => setMessages(r.messages)).catch(() => setMessages([]))
    const timer = setInterval(() => {
      messageApi.list(current.id).then((r) => setMessages(r.messages)).catch(() => undefined)
    }, 10000)
    return () => clearInterval(timer)
  }, [current])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [messages])

  if (loading) return <Spinner label="A carregar serviço..." />

  if (!current) {
    return (
      <EmptyState
        icon={<Wrench className="h-10 w-10" />}
        title="Sem serviço em curso"
        description="Quando aceitares um pedido, o serviço aparece aqui com chat, mapa e controlos de estado."
        action={
          <Link to="/app/pedidos-disponiveis" className="text-sm font-bold text-primary">Ver pedidos disponíveis →</Link>
        }
      />
    )
  }

  const idx = SEQ.findIndex((s) => s.status === current.status)
  const doing = (status: string) => async () => {
    setBusy(true)
    try {
      await requestApi.status(current.id, status, status === 'concluido' ? { valor, metodo_pagamento: metodo } : {})
      refetch()
      toast(status === 'concluido' ? 'Serviço concluído! Pagamento registado.' : 'Estado atualizado.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const send = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setBusy(true)
    try {
      const { message } = await messageApi.send(current.id, trimmed)
      setMessages((m) => [...m, message])
      setText('')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const next = SEQ[idx + 1]

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageTitle
        title={`Serviço ${current.numero_req}`}
        subtitle={`${current.categoria_nome} • ${current.condutor_nome}`}
        actions={<StatusBadge status={current.status} />}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <p className="font-bold text-ink">Progresso do serviço</p>
            <div className="mt-4 space-y-0.5">
              {SEQ.map((s, i) => {
                const active = i <= idx
                return (
                  <div key={s.status} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 flex h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {active ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-[10px]">{i + 1}</span>}
                      </span>
                      {i < SEQ.length - 1 && <span className={`h-full w-0.5 ${i < idx ? 'bg-primary' : 'bg-gray-100'}`} />}
                    </div>
                    <div className="pb-5">
                      <p className={`text-sm font-bold ${active ? 'text-ink' : 'text-gray-400'}`}>{s.label}</p>
                      <p className="text-xs text-muted">{s.desc}</p>
                      {current.status === s.status && (
                        <div className="mt-3 space-y-3">
                          {next && (
                            <Button onClick={doing(next.status)} loading={busy} variant={next.status === 'concluido' ? 'warn' : 'primary'}>
                              {next.status === 'a_caminho' ? <Navigation className="h-4 w-4" /> : next.status === 'concluido' ? <CheckCircle2 className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                              {next.status === 'a_caminho' && 'Iniciar deslocação'}
                              {next.status === 'chegou' && 'Cheguei ao local'}
                              {next.status === 'em_atendimento' && 'Iniciar serviço'}
                              {next.status === 'concluido' && 'Concluir serviço'}
                            </Button>
                          )}
                          {next?.status === 'concluido' && (
                            <div className="grid gap-3 sm:grid-cols-2">
                              <Input type="number" min="0" label="Valor combinado (Kz)" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="Ex.: 10000" required />
                              <Select label="Método de pagamento" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="cartao">Cartão</option>
                                <option value="transferencia">Transferência</option>
                                <option value="carteira">Carteira digital</option>
                              </Select>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {current.valor && current.estado_pagamento === 'pago' && (
            <Card className="bg-primary/5 ring-1 ring-primary/20">
              <p className="font-bold text-primary-dark">Pagamento recebido: {money(current.valor)} ({current.metodo_pagamento})</p>
            </Card>
          )}

          <Card>
            <p className="mb-3 flex items-center gap-2 font-bold text-ink"><MapPin className="h-4.5 w-4.5 text-sos" /> Local do condutor</p>
            <Map center={[Number(current.latitude), Number(current.longitude)]} zoom={14} className="h-56 w-full rounded-2xl" points={[{ lat: Number(current.latitude), lng: Number(current.longitude), type: 'sos' }]} />
            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-sm text-muted">{current.endereco || `${current.condutor_nome} está aqui`}</p>
              <a href={`https://www.google.com/maps?q=${current.latitude},${current.longitude}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-dark">
                <Navigation className="h-4 w-4" /> Navegar
              </a>
            </div>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg">🧑‍💼</span>
              <div>
                <p className="font-bold text-ink">{current.condutor_nome}</p>
                <p className="text-xs text-muted">{current.condutor_telefone}</p>
              </div>
              <a href={`tel:${current.condutor_telefone}`} className="ml-auto rounded-xl bg-primary p-2.5 text-white"><Phone className="h-4.5 w-4.5" /></a>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Veículo</span><b className="text-ink">{current.marca ? `${current.marca} ${current.modelo} • ${current.placa}` : '—'}</b></div>
              {current.descricao && <div className="rounded-xl bg-gray-50 px-4 py-3 text-muted">"{current.descricao}"</div>}
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Pedido</span><b className="text-ink">{current.numero_req}</b></div>
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Data</span><b className="text-ink">{dateTime(current.criado_em)}</b></div>
            </div>
          </Card>

          <Card className="flex h-95 flex-col">
            <p className="font-bold text-ink">Chat com {current.condutor_nome}</p>
            <div ref={scroller} className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
              {messages.length === 0 && <p className="text-center text-xs text-muted">Sem mensagens ainda.</p>}
              {messages.map((m) => (
                <div key={m.id} className={`max-w-80 rounded-2xl px-3.5 py-2.5 text-sm ${m.remetente_id === user?.id ? 'ml-auto bg-primary text-white' : 'bg-gray-100 text-ink'}`}>
                  {m.mensagem}
                  <div className={`mt-1 text-[10px] ${m.remetente_id === user?.id ? 'text-white/70' : 'text-gray-400'}`}>{dateTime(m.criado_em)}</div>
                </div>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send() }} className="mt-3 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreve uma mensagem..." className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              <Button type="submit" disabled={!text.trim() || busy} className="px-3.5"><Send className="h-4.5 w-4.5" /></Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}