import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Circle, MapPin, Phone, Send, Star } from 'lucide-react'
import { messageApi, ratingApi, requestApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, EmptyState, Input, PageTitle, Spinner } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { RatingInput } from '../../components/Rating'
import { Map } from '../../components/Map'
import { apiError, dateTime, money } from '../../utils/format'
import { useToast } from '../../components/Toast'

const timelineOrder = ['procurando', 'aceite', 'a_caminho', 'chegou', 'em_atendimento', 'concluido']

export default function RequestDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const { data, loading, error, refetch } = useFetch(() => requestApi.detail(Number(id)), [id])

  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [rated, setRated] = useState(false)
  const [ratingOpen, setRatingOpen] = useState(false)
  const [rating, setRating] = useState({ nota: 5, rapidez: 5, atendimento: 5, qualidade: 5, preco: 5, comentario: '' })
  const [busy, setBusy] = useState(false)
  const [statusBusy, setStatusBusy] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!data?.request) return
    messageApi.list(Number(id)).then((r) => setMessages(r.messages)).catch(() => setMessages([]))
    const timer = setInterval(() => {
      messageApi.list(Number(id)).then((r) => setMessages(r.messages)).catch(() => undefined)
    }, 10000)
    return () => clearInterval(timer)
  }, [data, id])

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight })
  }, [messages, id])

  if (loading) return <Spinner label="A carregar pedido..." />
  if (error || !data?.request) {
    return (
      <div className="mx-auto max-w-2xl">
        <EmptyState title="Pedido não encontrado" description={error} />
        <Link to="/app/meus-pedidos" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark">
          <ArrowLeft className="h-4 w-4" /> Voltar para os meus pedidos
        </Link>
      </div>
    )
  }

  const r = data.request as any
  const isDriver = r.user_id === user?.id
  const historical = r.historico ?? []
  const activeIndex = timelineOrder.indexOf(r.status)
  const showChat = ['aceite', 'a_caminho', 'chegou', 'em_atendimento', 'concluido'].includes(r.status)
  const canReview = user?.role === 'condutor' && r.status === 'concluido' && isDriver && !rated

  const send = async () => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setBusy(true)
    try {
      const { message } = await messageApi.send(Number(id), trimmed)
      setMessages((m) => [...m, message])
      setText('')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const cancel = async () => {
    if (!window.confirm('Tens a certeza que queres cancelar este pedido?')) return
    setStatusBusy(true)
    try {
      await requestApi.status(Number(id), 'cancelado')
      refetch()
      toast('Pedido cancelado.', 'info')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setStatusBusy(false)
    }
  }

  const submitRating = async () => {
    setBusy(true)
    try {
      await ratingApi.create({ request_id: Number(id), nota: rating.nota, rapidez: rating.rapidez, atendimento: rating.atendimento, qualidade: rating.qualidade, preco: rating.preco, comentario: rating.comentario || undefined })
      toast('Avaliação enviada. Obrigado!', 'success')
      setRated(true)
      setRatingOpen(false)
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const mapaPoints = [
    { lat: Number(r.latitude), lng: Number(r.longitude), label: 'Local da avaria', type: 'sos' as const },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <PageTitle
        title={`Pedido ${r.numero_req}`}
        subtitle={`${r.categoria_nome} • criado em ${dateTime(r.criado_em)}`}
        actions={
          <>
            <StatusBadge status={r.status} />
            {isDriver && r.status === 'procurando' && (
              <Button variant="outline" onClick={cancel} loading={statusBusy} className="text-sos hover:border-sos hover:text-sos">Cancelar pedido</Button>
            )}
          </>
        }
      />

      {error && <p className="text-sm text-sos">{error}</p>}

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <p className="font-bold text-ink">Acompanhar serviço</p>
            {r.profissional_nome && (
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
                <span className="font-bold text-primary-dark">{'🔧'}</span>
                <div>
                  <p className="text-sm font-bold text-ink">{r.profissional_nome}</p>
                  <p className="text-xs text-muted">{r.profissional_telefone}</p>
                </div>
                <a href={`tel:${r.profissional_telefone}`} className="ml-auto rounded-xl bg-primary px-3.5 py-2 text-white"><Phone className="h-4 w-4" /></a>
              </div>
            )}
            <div className="mt-4 space-y-0.5">
              {historical.map((h: any) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full ${timelineOrder.indexOf(h.status) <= activeIndex ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {timelineOrder.indexOf(h.status) <= activeIndex && h.status !== 'cancelado' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                    </span>
                    {h.id !== historical[historical.length - 1]?.id && <span className="h-full w-0.5 bg-gray-100" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-semibold text-ink">{r.status === h.status && activeIndex >= 0 ? 'Estado atual' : h.status}</p>
                    <p className="text-xs text-muted">{h.observacao || '—'}</p>
                    <p className="text-[11px] text-gray-400">{dateTime(h.criado_em)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {r.latitude && r.longitude && (
            <Card>
              <p className="mb-3 flex items-center gap-2 font-bold text-ink"><MapPin className="h-4.5 w-4.5 text-sos" /> Local da avaria</p>
              <Map center={[Number(r.latitude), Number(r.longitude)]} zoom={14} className="h-56 w-full rounded-2xl" points={mapaPoints} />
            </Card>
          )}

          {canReview && (
            <Card>
              <p className="flex items-center gap-2 font-bold text-ink"><Star className="h-5 w-5 text-warn fill-warn" /> Avalia o serviço</p>
              {!ratingOpen ? (
                <Button onClick={() => setRatingOpen(true)} className="mt-3"><Star className="h-4 w-4" /> Avaliar agora</Button>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink">Nota geral</p>
                    <RatingInput value={rating.nota} onChange={(v) => setRating({ ...rating, nota: v })} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(['rapidez', 'atendimento', 'qualidade', 'preco'] as const).map((k) => (
                      <label key={k} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                        <span className="text-sm font-medium capitalize text-ink">{k}</span>
                        <select value={rating[k]} onChange={(e) => setRating({ ...rating, [k]: Number(e.target.value) })} className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
                          {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </label>
                    ))}
                  </div>
                  <Input value={rating.comentario} onChange={(e) => setRating({ ...rating, comentario: e.target.value })} placeholder="Conta como foi o serviço (opcional)" />
                  <div className="flex gap-2">
                    <Button onClick={submitRating} loading={busy}>Enviar avaliação</Button>
                    <Button variant="ghost" onClick={() => setRatingOpen(false)}>Agora não</Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <Card>
            <p className="font-bold text-ink">Detalhes</p>
            <div className="mt-3 space-y-2.5 text-sm">
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Categoria</span><b className="text-ink">{r.categoria_nome}</b></div>
              <div className="flex justify-between rounded-xl bg-gray-50 px-4 py-3"><span className="text-muted">Veículo</span><b className="text-ink">{r.marca ? `${r.marca} ${r.modelo} • ${r.placa}` : '—'}</b></div>
              {r.descricao && <div className="rounded-xl bg-gray-50 px-4 py-3 text-muted">"{r.descricao}"</div>}
              {r.valor ? (
                <div className="flex justify-between rounded-xl bg-primary/5 px-4 py-3 ring-1 ring-primary/20"><span className="text-muted">Valor combinado</span><b className="text-primary">{money(r.valor)}</b></div>
              ) : (
                <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-muted">O valor é combinado com o profissional antes do início do serviço.</div>
              )}
              {r.estado_pagamento === 'pago' && <StatusBadge status="pago" />}
            </div>
          </Card>

          {showChat && (
            <Card className="flex h-95 flex-col">
              <p className="font-bold text-ink">Chat com {isDriver ? r.profissional_nome : r.condutor_nome}</p>
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
          )}
        </div>
      </div>
    </div>
  )
}