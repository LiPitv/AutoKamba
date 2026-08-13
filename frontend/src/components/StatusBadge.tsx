import { Badge } from './ui'

const statusMap: Record<string, { label: string; tone: 'green' | 'red' | 'yellow' | 'gray' | 'blue' }> = {
  pendente: { label: 'Pendente', tone: 'yellow' },
  procurando: { label: 'A procurar profissional', tone: 'yellow' },
  aceite: { label: 'Aceite', tone: 'blue' },
  a_caminho: { label: 'A caminho', tone: 'blue' },
  chegou: { label: 'Chegou', tone: 'blue' },
  em_atendimento: { label: 'Em andamento', tone: 'blue' },
  concluido: { label: 'Concluído', tone: 'green' },
  cancelado: { label: 'Cancelado', tone: 'red' },
  rejeitado: { label: 'Recusado', tone: 'red' },
  pendente_verificacao: { label: 'Pendente de verificação', tone: 'yellow' },
  submetido_verificacao: { label: 'Em análise', tone: 'blue' },
  verificado: { label: 'Verificado', tone: 'green' },
  online: { label: 'Online', tone: 'green' },
  offline: { label: 'Offline', tone: 'gray' },
  ocupado: { label: 'Ocupado', tone: 'blue' },
  suspenso: { label: 'Suspenso', tone: 'yellow' },
  bloqueado: { label: 'Bloqueado', tone: 'red' },
  ativo: { label: 'Ativo', tone: 'green' },
  aberto: { label: 'Aberto', tone: 'yellow' },
  em_analise: { label: 'Em análise', tone: 'blue' },
  resolvido: { label: 'Resolvido', tone: 'green' },
  encerrado: { label: 'Encerrado', tone: 'gray' },
  pendente_pagamento: { label: 'Pagamento pendente', tone: 'yellow' },
  pago: { label: 'Pago', tone: 'green' },
  verificado_doc: { label: 'Verificado', tone: 'green' },
  rejeitado_doc: { label: 'Rejeitado', tone: 'red' },
}

export default function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const item = statusMap[status] ?? { label: status, tone: 'gray' as const }
  return (
    <Badge tone={item.tone} className={className}>
      {item.label}
    </Badge>
  )
}

export function statusLabel(status: string): string {
  return statusMap[status]?.label ?? status
}