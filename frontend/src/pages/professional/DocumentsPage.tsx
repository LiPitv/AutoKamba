import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Clock, FileText, Send, ShieldCheck, UploadCloud, XCircle } from 'lucide-react'
import { professionalApi } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import { useFetch } from '../../hooks/useFetch'
import { Badge, Button, Card, EmptyState, PageTitle, Select, Spinner } from '../../components/ui'
import { apiError, dateTime } from '../../utils/format'
import { useToast } from '../../components/Toast'

const tipos = [
  { valor: 'bi', nome: 'Bilhete de Identidade' },
  { valor: 'profissional', nome: 'Certificado de Mecânico' },
  { valor: 'carta_conducao', nome: 'Carta de Condução' },
  { valor: 'viatura', nome: 'Documentos da viatura' },
]

const tipoNome: Record<string, string> = Object.fromEntries(tipos.map((t) => [t.valor, t.nome]))

export default function DocumentsPage() {
  const { user, refreshUser } = useAuth()
  const { toast } = useToast()
  const { data, loading, refetch } = useFetch(() => professionalApi.documents(), [])
  const fileRef = useRef<HTMLInputElement>(null)
  const [tipo, setTipo] = useState('profissional')
  const [file, setFile] = useState<File | null>(null)
  const [busy, setBusy] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const documents: any[] = data?.documents ?? []
  const estado = user?.estado_profissional ?? 'pendente_verificacao'
  const motivoRejeicao = user?.motivo_rejeicao ?? ''
  const temBI = documents.some((d) => d.tipo === 'bi')
  const biOk = documents.some((d) => d.tipo === 'bi' && d.estado === 'verificado')
  const temCertificado = documents.some((d) => d.tipo === 'profissional')
  const certificadoOk = documents.some((d) => d.tipo === 'profissional' && d.estado === 'verificado')
  const emAnalise = estado === 'submetido_verificacao'
  const autorizado = ['verificado', 'online'].includes(estado)
  const rejeitado = estado === 'rejeitado'
  const rascunho = ['pendente_verificacao', 'rejeitado'].includes(estado)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file || busy) return
    setBusy(true)
    try {
      await professionalApi.uploadDocument(tipo, file)
      toast('Documento enviado. Será analisado pela administração.', 'success')
      setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      refetch()
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  const submitVerification = async () => {
    setSubmitting(true)
    try {
      await professionalApi.submitVerification()
      await refreshUser()
      toast('Verificação submetida. Aguarda a autorização do administrador.', 'success')
    } catch (err) {
      toast(apiError(err), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <PageTitle
        title="Documentos"
        subtitle="Prova que és mesmo um profissional autorizado antes de receberes pedidos."
        actions={
          autorizado ? (
            <Badge tone="green"><ShieldCheck className="h-3.5 w-3.5" /> Autorizado</Badge>
          ) : emAnalise ? (
            <Badge tone="yellow"><Clock className="h-3.5 w-3.5" /> Em análise</Badge>
          ) : rejeitado ? (
            <Badge tone="red"><XCircle className="h-3.5 w-3.5" /> Rejeitado</Badge>
          ) : (
            <Badge tone="yellow"><UploadCloud className="h-3.5 w-3.5" /> Verificação obrigatória</Badge>
          )
        }
      />

      {emAnalise && (
        <Card className="border-warn/40 bg-amber-50/60">
          <p className="flex items-center gap-2 font-bold text-ink"><Clock className="h-5 w-5 text-warn" /> Verificação em análise</p>
          <p className="mt-1 text-sm text-muted">
            Os teus documentos já foram submetidos. A administração está a confirmar se és mesmo um profissional autorizado. Assim que aprovar, poderás ficar online.
          </p>
        </Card>
      )}

      {rejeitado && (
        <Card className="border-error/40 bg-red-50/60">
          <p className="flex items-center gap-2 font-bold text-ink"><XCircle className="h-5 w-5 text-error" /> Verificação rejeitada</p>
          <p className="mt-1 text-sm text-muted">Motivo: <strong className="text-ink">{motivoRejeicao || 'não indicado'}</strong></p>
          <p className="mt-1 text-sm text-muted">Corrige o que foi pedido e submete novamente para nova análise.</p>
        </Card>
      )}

      {autorizado && (
        <Card className="border-primary/30 bg-primary/5">
          <p className="flex items-center gap-2 font-bold text-primary-dark"><CheckCircle2 className="h-5 w-5" /> Conta autorizada</p>
          <p className="mt-1 text-sm text-muted">
            A administração confirmou que és um profissional autêntico. Já podes ficar online e receber pedidos —{' '}
            <Link to="/app" className="font-bold text-primary">ir para o painel →</Link>
          </p>
        </Card>
      )}

      <Card>
        <p className="flex items-center gap-2 font-bold text-ink"><UploadCloud className="h-5 w-5 text-primary" /> Enviar documento</p>
        <p className="mt-1 flex items-start gap-1.5 text-xs font-semibold text-warn">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {!biOk && !certificadoOk
            ? 'O Bilhete de Identidade e o Certificado de Mecânico são obrigatórios para a conta ser autorizada.'
            : !biOk && !temBI
              ? 'O Bilhete de Identidade ainda não foi enviado — é obrigatório para a conta ser autorizada.'
              : !biOk
                ? 'O Bilhete de Identidade ainda não foi aprovado pela administração.'
                : !certificadoOk && !temCertificado
                  ? 'O Certificado de Mecânico ainda não foi enviado — é obrigatório para a conta ser autorizada.'
                  : !certificadoOk
                    ? 'O Certificado de Mecânico ainda não foi aprovado pela administração.'
                    : 'Documentos obrigatórios já enviados.'}
        </p>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <Select label="Tipo de documento" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            {tipos.map((t) => <option key={t.valor} value={t.valor}>{t.nome}</option>)}
          </Select>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-xl border-2 border-dashed border-gray-200 p-5 text-sm font-semibold text-muted hover:border-primary hover:text-primary"
          >
            {file ? <span className="text-primary">📄 {file.name}</span> : 'Clica para escolher o ficheiro (PDF ou imagem)'}
          </button>
          <input ref={fileRef} type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <Button type="submit" disabled={!file} loading={busy}>Enviar documento</Button>
        </form>
      </Card>

      {rascunho && (
        <Card className="mt-5 border-primary/30 bg-primary/5">
          <p className="flex items-center gap-2 font-bold text-ink"><Send className="h-5 w-5 text-primary" /> Submeter para verificação</p>
          <p className="mt-1 text-sm text-muted">
            {rejeitado
              ? 'Depois de corrigires os documentos, submete de novo para a administração analisar.'
              : 'Envia o Bilhete de Identidade e o Certificado de Mecânico e submete. A administração vai confirmar se és mesmo um profissional autorizado antes de ativares a tua conta.'}
          </p>
          <Button className="mt-3" loading={submitting} disabled={documents.length === 0} onClick={submitVerification}>
            <Send className="h-4 w-4" /> {rejeitado ? 'Submeter novamente' : 'Submeter para verificação'}
          </Button>
          {documents.length === 0 && <p className="mt-2 text-xs text-warn">Envia pelo menos um documento primeiro.</p>}
        </Card>
      )}

      <div className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-ink"><FileText className="h-5 w-5 text-primary" /> Documentos enviados</h2>
        {loading ? (
          <Spinner label="A carregar documentos..." />
        ) : documents.length === 0 ? (
          <EmptyState title="Nenhum documento enviado" description="Quanto mais documentos enviares, mais rápido a autorização." />
        ) : (
          <div className="space-y-3">
            {documents.map((d) => (
              <Card key={d.id} className="flex flex-wrap items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-ink">{tipoNome[d.tipo] ?? d.tipo}</p>
                  <p className="text-xs text-muted">{dateTime(d.criado_em)}</p>
                  {d.estado === 'rejeitado' && d.motivo_rejeicao && (
                    <p className="mt-1 text-xs font-semibold text-error">Motivo: {d.motivo_rejeicao}</p>
                  )}
                </div>
                <Badge tone={d.estado === 'verificado' ? 'green' : d.estado === 'rejeitado' ? 'red' : 'yellow'}>
                  {d.estado === 'verificado' ? 'Aprovado' : d.estado === 'rejeitado' ? 'Rejeitado' : 'Pendente'}
                </Badge>
                {d.caminho && (
                  <a href={d.caminho} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:text-primary-dark">Ver ficheiro →</a>
                )}
              </Card>
            ))}
          </div>
        )}

        {certificadoOk && biOk && !autorizado && (
          <Card className="mt-5 border-primary/30 bg-primary/5">
            <p className="flex items-center gap-2 font-bold text-primary-dark"><ShieldCheck className="h-5 w-5" /> B.I. e Certificado aprovados</p>
            <p className="mt-1 text-sm text-muted">
              {emAnalise
                ? 'A administração está a concluir a análise. Em breve sabes o resultado.'
                : 'Submete a verificação acima para a administração autorizar a tua conta.'}
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
