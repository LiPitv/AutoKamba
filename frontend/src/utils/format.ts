export function money(value: number | string | null | undefined): string {
  const num = Number(value ?? 0)
  return num.toLocaleString('pt-PT', { maximumFractionDigits: 0 }) + ' Kz'
}

export function dateTime(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value.replace(' ', 'T'))
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function date(value?: string | null): string {
  if (!value) return '—'
  return new Date(value.replace(' ', 'T')).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function kwanza(value: number | string | null | undefined): string {
  const num = Number(value ?? 0)
  return num.toLocaleString('pt-PT', { minimumFractionDigits: num % 1 ? 2 : 0, maximumFractionDigits: 2 }) + ' Kz'
}

export function tipoProfissionalLabel(tipo: string | null | undefined): string {
  const map: Record<string, string> = {
    mecanico: 'Mecânico',
    tecnico: 'Técnico automóvel',
    eletricista: 'Eletricista automóvel',
    reboque: 'Reboque',
    chaveiro: 'Chaveiro automóvel',
    pneus: 'Técnico de pneus',
    bateria: 'Técnico de baterias',
    combustivel: 'Combustível',
    outro: 'Outro',
  }
  return map[tipo ?? ''] ?? 'Profissional'
}

export function distanciaKm(value?: number | string | null): string {
  if (value == null) return '—'
  const num = Number(value)
  return num < 1 ? `${Math.round(num * 1000)} m` : `${num.toFixed(1).replace('.', ',')} km`
}

export function apiError(err: unknown): string {
  const anyErr = err as { response?: { data?: { message?: string } }; message?: string }
  if (anyErr?.response?.data?.message) return anyErr.response.data.message
  if (anyErr?.message) return anyErr.message
  return 'Não foi possível concluir esta operação. Tente novamente.'
}