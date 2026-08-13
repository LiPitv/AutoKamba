import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CircleDollarSign, ClipboardCheck, FileText, Wrench, ListChecks } from 'lucide-react'
import { professionalApi, requestApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Button, Card, PageTitle, Spinner, EmptyState } from '../../components/ui'
import StatusBadge from '../../components/StatusBadge'
import { Rating } from '../../components/Rating'
import { money } from '../../utils/format'
import { useToast } from '../../components/Toast'
import { apiError } from '../../utils/format'

export default function ProfessionalDashboardPage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const { data: profileData, loading: profileLoading } = useFetch(() => professionalApi.me(), [])
  const { data: requestData } = useFetch(() => requestApi.mine(), [])
  const { data: earningsData } = useFetch(() => professionalApi.earnings(), [])

  const professional = profileData?.professional
  const isVerified = ['verificado', 'online'].includes(user?.estado_profissional ?? '')

  const requests: any[] = requestData?.requests ?? []
  const activeRequest = requests.find((r) => !['concluido', 'cancelado', 'rejeitado'].includes(r.status))
  const earnings = earningsData?.earnings

  const toggle = async () => {
    if (!isVerified) {
      toast('A tua conta ainda não está verificada para receber pedidos.', 'error')
      return
    }
    const next = user?.estado_profissional === 'online' ? 'offline' : 'online'
    try {
      await professionalApi.availability(next)
      await refreshUser()
      toast(next === 'online' ? 'Estás online! A receber pedidos.' : 'Conta offline. Não recebes pedidos.', next === 'online' ? 'success' : 'info')
    } catch (err) {
      toast(apiError(err), 'error')
    }
  }

  const statusAction = useMemo(() => {
    if (!professional) return null
    const docPendentes = professional.documents?.filter((d: any) => d.estado === 'pendente').length ?? 0
    const steps = [
      { done: isVerified, label: 'Conta verificada', hint: docPendentes > 0 ? `${docPendentes} documento(s) em análise` : 'Documentos em dia' },
      { done: (professional.documents?.length ?? 0) >= 3, label: 'Documentos carregados', hint: `${professional.documents?.length ?? 0} documento(s)` },
      { done: (professional.services?.length ?? 0) > 0, label: 'Serviços configurados', hint: `${professional.services?.length ?? 0} serviço(s)` },
    ]
    return { steps, docPendentes }
  }, [professional, isVerified])

  if (profileLoading) return <Spinner label="A carregar..." />

  return (
    <div className="space-y-6">
      <PageTitle
        title={`Olá, ${user?.nome.split(' ')[0]}!`}
        subtitle={`${user?.tipo_profissional ?? 'Profissional'} • ${professional?.area_atendimento || 'Luanda'}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={user?.estado_profissional ?? 'offline'} />
            <Button variant={user?.estado_profissional === 'online' ? 'outline' : 'primary'} onClick={toggle}>
              {user?.estado_profissional === 'online' ? 'Ficar offline' : 'Estou online'}
            </Button>
          </div>
        }
      />

      {!isVerified && user?.estado_profissional === 'rejeitado' && (
        <Card className="border-error/40 bg-red-50/60">
          <p className="font-bold text-ink">Verificação rejeitada</p>
          <p className="mt-1 text-sm text-muted">
            Motivo: <strong className="text-ink">{user.motivo_rejeicao || 'não indicado'}</strong>. Corrige os documentos em{' '}
            <Link to="/app/documentos" className="font-bold text-primary">Documentos</Link> e submete novamente.
          </p>
        </Card>
      )}

      {!isVerified && user?.estado_profissional === 'submetido_verificacao' && (
        <Card className="border-warn/40 bg-amber-50/60">
          <p className="font-bold text-ink">Verificação em análise</p>
          <p className="mt-1 text-sm text-muted">
            Os teus documentos foram submetidos. A administração está a confirmar se és mesmo um profissional autorizado. Acompanha o estado em{' '}
            <Link to="/app/documentos" className="font-bold text-primary">Documentos</Link>.
          </p>
        </Card>
      )}

      {!isVerified && !['rejeitado', 'submetido_verificacao'].includes(user?.estado_profissional ?? '') && (
        <Card className="border-warn/40 bg-amber-50/60">
          <p className="font-bold text-ink">Conta em verificação</p>
          <p className="mt-1 text-sm text-muted">
            Envia os teus documentos e submete a verificação em <Link to="/app/documentos" className="font-bold text-primary">Documentos</Link> para começares a receber pedidos.
          </p>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="flex flex-col justify-between overflow-hidden lg:col-span-2">
          {activeRequest ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-2 font-bold text-ink"><ListChecks className="h-5 w-5 text-primary" /> Serviço em curso</p>
                <StatusBadge status={activeRequest.status} />
              </div>
              <div className="mt-4 rounded-2xl bg-gray-50 p-4">
                <p className="font-bold text-ink">{activeRequest.categoria_nome} — {activeRequest.numero_req}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {activeRequest.condutor_nome} • {activeRequest.marca ? `${activeRequest.marca} ${activeRequest.modelo} (${activeRequest.placa})` : 'Sem veículo'}
                </p>
                <p className="mt-0.5 text-xs text-muted">{activeRequest.descricao}</p>
              </div>
              <Link to="/app/servico-atual" className="mt-4">
                <Button className="w-full">Abrir serviço atual <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </>
          ) : (
            <>
              <p className="font-bold text-ink">Serviço em curso</p>
              <EmptyState
                icon={<Wrench className="h-10 w-10" />}
                title="Sem serviço ativo"
                description="Quando um condutor pedir ajuda na tua área, vais receber uma notificação."
              />
              <Link to="/app/pedidos-disponiveis" className="mt-2">
                <Button variant="outline" className="w-full">Ver pedidos disponíveis <ArrowRight className="h-4 w-4" /></Button>
              </Link>
            </>
          )}
        </Card>

        {statusAction && (
          <Card>
            <p className="font-bold text-ink">Estado da conta</p>
            <div className="mt-4 space-y-3">
              {statusAction.steps.map((s) => (
                <div key={s.label} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${s.done ? 'bg-primary text-white' : 'bg-gray-100 text-muted'}`}>
                    {s.done ? '✓' : '•'}
                  </span>
                  <div>
                    <p className={`text-sm font-semibold ${s.done ? 'text-ink' : 'text-muted'}`}>{s.label}</p>
                    <p className="text-xs text-muted">{s.hint}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/app/documentos" className="mt-4 inline-block text-xs font-bold text-primary hover:text-primary-dark">Gerir documentos →</Link>
          </Card>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted"><CircleDollarSign className="h-3.5 w-3.5" /> Ganhos hoje</p>
          <p className="mt-2 text-2xl font-extrabold text-primary">{money(earnings?.hoje ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Esta semana</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{money(earnings?.semana ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Este mês</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{money(earnings?.mes ?? 0)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Total recebido</p>
          <p className="mt-2 text-2xl font-extrabold text-ink">{money(earnings?.total ?? 0)}</p>
          <p className="mt-1 text-xs text-muted">Comissões: {money(earnings?.comissao_total ?? 0)}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-bold text-ink">Avaliações recentes</p>
            <Link to="/app/avaliacoes" className="text-xs font-bold text-primary hover:text-primary-dark">Ver todas →</Link>
          </div>
          {professional?.reviews?.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Sem avaliações ainda.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {professional?.reviews?.slice(0, 3).map((r: any) => (
                <div key={r.id} className="rounded-xl bg-gray-50 p-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-ink">{r.condutor_nome}</p>
                    <Rating value={Number(r.nota)} />
                  </div>
                  {r.comentario && <p className="mt-1 text-xs text-muted">"{r.comentario}"</p>}
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-bold text-ink">Serviços e documentos</p>
            <span className="flex items-center gap-2 text-xs font-bold text-primary"><ClipboardCheck className="h-4 w-4" /> {professional?.services?.length ?? 0} serviços</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {professional?.services?.map((s: any) => (
              <span key={s.id} className="rounded-xl bg-primary/10 px-3 py-2 text-xs font-bold text-primary-dark">
                {s.nome || s.categoria_nome} {s.preco != null && `• ${s.preco} Kz`}
              </span>
            ))}
            {professional?.services?.length === 0 && <p className="text-sm text-muted">Configura serviços em <Link to="/app/servicos" className="font-bold text-primary">Meus serviços</Link>.</p>}
          </div>
          <div className="mt-4 rounded-xl bg-gray-50 p-3.5 text-xs text-muted">
            <FileText className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
            {statusAction?.docPendentes ?? 0} documento(s) aguardam verificação pela equipa AutoKamba.
          </div>
        </Card>
      </div>
    </div>
  )
}