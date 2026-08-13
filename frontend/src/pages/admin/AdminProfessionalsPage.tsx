import { useMemo, useState } from 'react'
import { CheckCircle2, Search, XCircle, FileText, Wrench, MessageSquareWarning, ShieldCheck } from 'lucide-react'
import { adminApi } from '../../services'
import { useFetch } from '../../hooks/useFetch'
import { Avatar, Button, Card, EmptyState, Input, Modal, PageTitle, Select, Spinner, Textarea } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { money, dateTime } from '../../utils/format'
import { useToast } from '../../components/Toast'
import { apiError } from '../../utils/format'

export default function AdminProfessionalsPage() {
  const { toast } = useToast()
  const [estado, setEstado] = useState('')
  const [search, setSearch] = useState('')
  const { data, loading, refetch } = useFetch(() => adminApi.professionals({ estado: estado || undefined, search: search || undefined }), [estado, search])
  const [selected, setSelected] = useState<any>(null)
  const [detail, setDetail] = useState<any>(null)
  const [busy, setBusy] = useState(false)
  const [rejeitando, setRejeitando] = useState<{ tipo: 'conta' | 'doc'; id: number } | null>(null)
  const [motivo, setMotivo] = useState('')

  const professionals: any[] = data?.professionals ?? []

  const counts = useMemo(
    () => ({
      pendentes: professionals.filter((p) => ['pendente_verificacao', 'submetido_verificacao'].includes(p.estado_profissional)).length,
      aAutorizar: professionals.filter((p) => p.estado_profissional === 'submetido_verificacao').length,
      verificados: professionals.filter((p) => ['verificado', 'online'].includes(p.estado_profissional)).length,
    }),
    [professionals],
  )

  const openDetail = async (p: any) => {
    setSelected(p)
    setDetail(null)
    setRejeitando(null)
    setMotivo('')
    const r = await adminApi.professional(p.id).catch(() => null)
    setDetail(r?.professional ?? null)
  }

  const refreshDetail = async () => {
    if (!selected) return
    const r = await adminApi.professional(selected.id).catch(() => null)
    setDetail(r?.professional ?? null)
  }

  const verify = async (id: number, estado: string, tipo: string, alvo?: any, motivoTxt = '') => {
    setBusy(true)
    try {
      if (tipo === 'verif') await adminApi.professionalVerif(id, estado, motivoTxt || undefined)
      else if (tipo === 'status') await adminApi.professionalStatus(id, estado as any)
      else if (tipo === 'doc') await adminApi.documentEstado(alvo.id, estado, motivoTxt || undefined)
      toast('Atualizado com sucesso.', 'success')
      setRejeitando(null)
      setMotivo('')
      refetch()
      await refreshDetail()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const docVerificado = (d: any) => d.estado === 'verificado'
  const biOk = detail?.documents?.some((d: any) => d.tipo === 'bi' && docVerificado(d))
  const certificadoOk = detail?.documents?.some((d: any) => d.tipo === 'profissional' && docVerificado(d))
  const docsObrigatoriosOk = biOk && certificadoOk

  return (
    <div>
      <PageTitle
        title="Profissionais"
        subtitle={`${counts.aAutorizar} aguardam a tua autorização • ${counts.verificados} autorizados`}
      />
      <Card className="mb-5 flex flex-wrap items-center gap-3">
        <div className="min-w-55 flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar por nome, email ou telefone..." className="pl-10" />
          </div>
        </div>
        <div className="flex gap-1.5">
          {[
            ['', 'Todos'],
            ['submetido_verificacao', 'A autorizar'],
            ['pendente_verificacao', 'Pendentes'],
            ['verificado', 'Autorizados'],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setEstado(v)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                estado === v ? 'bg-primary text-white' : 'bg-gray-100 text-muted hover:bg-gray-200'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <Select value={estado} onChange={(e) => setEstado(e.target.value)} className="w-52" defaultOption="Todos os estados">
          {['pendente_verificacao', 'submetido_verificacao', 'verificado', 'rejeitado', 'online', 'offline', 'ocupado', 'suspenso', 'bloqueado'].map((e) => (
            <option key={e} value={e}>{e.replace('_', ' ')}</option>
          ))}
        </Select>
      </Card>

      {loading ? (
        <Spinner label="A carregar profissionais..." />
      ) : professionals.length === 0 ? (
        <EmptyState icon={<Wrench className="h-10 w-10" />} title="Sem profissionais" description="Ajusta os filtros para ver mais resultados." />
      ) : (
        <div className="space-y-3">
          {professionals.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-4 py-3.5">
              <Avatar src={p.avatar} name={p.nome} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink">{p.nome}</p>
                <p className="text-xs text-muted">{p.email} • {p.telefone}</p>
                {p.area_atendimento && <p className="text-xs text-muted">📍 {p.area_atendimento}</p>}
                {p.estado_profissional === 'rejeitado' && p.motivo_rejeicao && (
                  <p className="mt-0.5 text-xs font-semibold text-error">Rejeitado: {p.motivo_rejeicao}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={p.estado_profissional} />
                <span className="hidden text-xs text-muted sm:block">{p.numero_pedidos} pedidos</span>
                <Button variant="outline" onClick={() => openDetail(p)}>Ver detalhes</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `Detalhes: ${selected.nome}` : ''} wide>
        {!detail ? (
          <Spinner label="A carregar detalhes..." />
        ) : (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar src={detail.avatar} name={detail.nome} size={56} />
              <div className="flex-1">
                <p className="font-extrabold text-ink">{detail.nome}</p>
                <p className="text-sm capitalize text-muted">{detail.tipo_profissional}{detail.especialidade ? ` • ${detail.especialidade}` : ''} — {detail.area_atendimento || 'Luanda'}</p>
                <p className="text-xs text-muted">{detail.email} • {detail.telefone}</p>
              </div>
              <StatusBadge status={detail.estado_profissional} />
            </div>

            {detail.estado_profissional === 'rejeitado' && (
              <Card className="border-error/40 bg-red-50/60">
                <p className="flex items-center gap-2 font-bold text-ink"><XCircle className="h-5 w-5 text-error" /> Verificação rejeitada</p>
                <p className="mt-1 text-sm text-muted">Motivo: <strong className="text-ink">{detail.motivo_rejeicao || 'não indicado'}</strong></p>
              </Card>
            )}

            <div className="flex flex-wrap gap-2">
              {detail.estado_profissional === 'verificado' || detail.estado_profissional === 'online' ? (
                <Button variant="outline" disabled>
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Conta autorizada
                </Button>
              ) : (
                <Button
                  loading={busy}
                  disabled={!docsObrigatoriosOk}
                  onClick={() => verify(detail.id, 'verificado', 'verif')}
                  title={docsObrigatoriosOk ? 'Autoriza a conta após a aprovação dos documentos' : 'Aprove primeiro o B.I. e o Certificado de Mecânico do profissional'}
                >
                  <CheckCircle2 className="h-4 w-4" /> Autorizar conta
                </Button>
              )}
              {!docsObrigatoriosOk && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-warn">
                  <ShieldCheck className="h-4 w-4" /> Aprove o B.I. e o Certificado de Mecânico abaixo para autorizar a conta.
                </p>
              )}
              {docsObrigatoriosOk && ['pendente_verificacao', 'submetido_verificacao', 'rejeitado'].includes(detail.estado_profissional) && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <CheckCircle2 className="h-4 w-4" /> Documentos aprovados: a conta será autorizada automaticamente.
                </p>
              )}
              <Button
                variant="outline"
                loading={busy}
                disabled={rejeitando !== null}
                onClick={() => setRejeitando({ tipo: 'conta', id: detail.id })}
              >
                <XCircle className="h-4 w-4" /> Rejeitar
              </Button>
              <Button variant="ghost" loading={busy} onClick={() => verify(detail.id, 'suspenso', 'status')}>
                Suspender
              </Button>
            </div>

            {rejeitando?.tipo === 'conta' && (
              <Card className="border-error/30 bg-red-50/40">
                <p className="text-sm font-bold text-ink">Motivo da rejeição (visível para o profissional)</p>
                <Textarea
                  className="mt-2"
                  rows={2}
                  placeholder="Ex.: certificado ilegível, não comprova ser mecânico..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                />
                <div className="mt-2 flex gap-2">
                  <Button loading={busy} disabled={!motivo.trim()} onClick={() => verify(detail.id, 'rejeitado', 'verif', undefined, motivo.trim())}>
                    Confirmar rejeição
                  </Button>
                  <Button variant="outline" onClick={() => { setRejeitando(null); setMotivo('') }}>Cancelar</Button>
                </div>
              </Card>
            )}

            {detail.descricao && <p className="rounded-xl bg-gray-50 p-4 text-sm text-muted">{detail.descricao}</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <BadgeCol label="Avaliação" value={detail.avaliacao_media != null ? `${detail.avaliacao_media} ★` : '—'} />
              <BadgeCol label="Serviços" value={String(detail.numero_servicos ?? 0)} />
              <BadgeCol label="Receita" value={money(detail.ganhos?.total ?? 0)} />
              <BadgeCol label="Estado" value={String(detail.estado_profissional)} />
            </div>

            {detail.documents?.length > 0 && (
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-ink"><FileText className="h-4 w-4 text-primary" /> Documentos</p>
                <div className="space-y-2">
                  {detail.documents.map((d: any) => (
                    <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-100 p-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold capitalize text-ink">
                          {d.tipo === 'bi' ? 'Bilhete de Identidade' : d.tipo === 'profissional' ? 'Certificado de Mecânico' : d.tipo.replace('_', ' ')}
                          {(d.tipo === 'bi' || d.tipo === 'profissional') && <span className="ml-1 text-[10px] font-bold uppercase text-primary">obrigatório</span>}
                        </p>
                        <p className="text-xs text-muted">{dateTime(d.criado_em)}</p>
                        {d.estado === 'rejeitado' && d.motivo_rejeicao && (
                          <p className="mt-0.5 text-xs font-semibold text-error">Motivo: {d.motivo_rejeicao}</p>
                        )}
                      </div>
                      <StatusBadge status={d.estado === 'verificado' ? 'verificado_doc' : d.estado === 'rejeitado' ? 'rejeitado_doc' : 'pendente_verificacao'} />
                      {d.caminho && <a href={d.caminho} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary">Ver →</a>}
                      <Button variant="outline" loading={busy} onClick={() => verify(detail.id, 'verificado', 'doc', d)}><CheckCircle2 className="h-4 w-4" /></Button>
                      {rejeitando?.tipo === 'doc' && rejeitando.id === d.id ? (
                        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
                          <Input
                            placeholder="Motivo..."
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            className="min-w-40 flex-1"
                          />
                          <Button loading={busy} disabled={!motivo.trim()} onClick={() => verify(detail.id, 'rejeitado', 'doc', d, motivo.trim())}>Confirmar</Button>
                          <Button variant="ghost" onClick={() => { setRejeitando(null); setMotivo('') }}>X</Button>
                        </div>
                      ) : (
                        <Button variant="ghost" disabled={rejeitando !== null} onClick={() => { setRejeitando({ tipo: 'doc', id: d.id }); setMotivo('') }}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 flex items-center gap-2 text-sm font-bold text-ink"><MessageSquareWarning className="h-4 w-4 text-primary" /> Reclamações deste profissional</p>
              {detail.complaints?.length ? (
                <p className="text-sm text-muted">Este profissional tem reclamações associadas. Verifica a secção Reclamações.</p>
              ) : (
                <p className="text-xs text-muted">Sem reclamações registadas.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function BadgeCol({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-ink">{value}</p>
    </div>
  )
}
