export interface User {
  id: number
  role: 'condutor' | 'prestador' | 'admin'
  nome: string
  email: string
  telefone: string
  avatar: string | null
  disponivel: boolean
  criado_em: string
  tipo_profissional?: string | null
  especialidade?: string | null
  experiencia?: number | null
  area_atendimento?: string | null
  preco_base?: number | null
  descricao?: string | null
  estado_profissional?: string | null
  motivo_rejeicao?: string | null
  submetido_verificacao?: boolean
  estado?: string | null
  latitude?: number | null
  longitude?: number | null
  endereco_base?: string | null
  avaliacao_media?: number | null
  numero_avaliacoes?: number
}

export type UserRole = User['role']

export type EstadoProfissional =
  | 'pendente_verificacao'
  | 'submetido_verificacao'
  | 'verificado'
  | 'rejeitado'
  | 'online'
  | 'offline'
  | 'suspenso'
  | 'bloqueado'

export interface ServiceCategory {
  id: number
  slug: string
  nome: string
  icone: string
  descricao: string | null
  ativo: boolean
}

export interface Vehicle {
  id: number
  user_id: number
  placa: string
  marca: string
  modelo: string
  cor: string | null
  tipo?: string | null
  ano: number | null
  foto?: string | null
  principal?: boolean
  criado_em: string
}

export type RequestStatus =
  | 'procurando'
  | 'aceite'
  | 'a_caminho'
  | 'chegou'
  | 'em_atendimento'
  | 'concluido'
  | 'cancelado'

export interface SosRequest {
  id: number
  numero_req: string
  user_id: number
  vehicle_id: number | null
  category_id: number | null
  provider_id: number | null
  status: RequestStatus
  descricao: string | null
  latitude: number
  longitude: number
  endereco?: string | null
  referencia?: string | null
  valor?: number | null
  valor_final?: number | null
  metodo_pagamento?: string | null
  estado_pagamento?: 'pendente' | 'pago' | null
  criado_em: string
  atualizado_em?: string
  historico?: RequestHistorico[]
  condutor_nome?: string
  profissional_nome?: string
  categoria_nome?: string
}

export interface RequestHistorico {
  id: number
  status: RequestStatus
  observacao?: string | null
  criado_em: string
}

export interface Professional extends User {
  distancia_km?: number
  numero_servicos?: number
  services?: Service[]
  reviews?: Review[]
  documents?: ProfessionalDocument[]
  ganhos?: Earnings
  pedidos?: SosRequest[]
  avaliacoes?: Review[]
  servicos?: Service[]
}

export interface Service {
  id: number
  provider_id: number
  category_id: number
  nome: string
  descricao: string | null
  preco: number
  ativo?: boolean
  categoria_nome?: string
  categoria_icone?: string
  criado_em?: string
}

export type DocumentTipo = 'bi' | 'carta_conducao' | 'profissional' | 'viatura'

export interface ProfessionalDocument {
  id: number
  professional_id: number
  tipo: DocumentTipo
  caminho: string
  estado: 'pendente' | 'verificado' | 'rejeitado'
  motivo_rejeicao?: string | null
  criado_em: string
}

export interface Review {
  id: number
  request_id: number
  user_id?: number
  provider_id?: number
  nota: number
  rapidez?: number
  atendimento?: number
  qualidade?: number
  preco?: number
  comentario?: string | null
  criado_em?: string
}

export interface Earnings {
  hoje: number
  semana: number
  mes: number
  total: number
  comissao_total?: number
  servicos_hoje?: number
  serie?: Array<{ dia: string; total: number }>
}

export interface Notification {
  id: number
  user_id?: number
  titulo: string
  mensagem: string
  tipo: string
  link?: string | null
  lida: boolean
  criado_em: string
}

export interface Message {
  id: number
  request_id: number
  remetente_id: number
  destinatario_id?: number
  mensagem: string
  anexo?: string | null
  lida?: boolean
  criado_em: string
}

export interface Payment {
  id: number
  request_id: number
  user_id: number
  provider_id: number
  metodo: string
  valor: number
  comissao: number
  valor_liquido: number
  estado: 'pendente' | 'pago'
  criado_em: string
}

export interface Complaint {
  id: number
  user_id?: number
  request_id?: number | null
  categoria: string
  descricao: string
  evidencias?: string | null
  estado: 'aberto' | 'em_analise' | 'resolvido' | 'encerrado'
  criado_em: string
  utilizador_nome?: string
  utilizador_telefone?: string
  numero_req?: string
}

export interface Favorite {
  id: number
  user_id: number
  provider_id: number
  professional?: Professional
  criado_em?: string
}

export interface Promotion {
  id: number
  titulo: string
  descricao?: string | null
  codigo?: string | null
  percentual?: number | null
  ativo?: boolean
  inicio_em?: string | null
  fim_em?: string | null
  criado_em: string
}

export interface Settings {
  [key: string]: string
}

export interface AdminLog {
  id: number
  admin_id: number | null
  acao: string
  detalhes?: string
  ip?: string | null
  criado_em: string
  admin_nome?: string | null
}

export interface Proposal {
  id: number
  request_id: number
  provider_id: number
  valor?: number | null
  observacao?: string | null
  estado: 'pendente' | 'aceite' | 'recusado'
  criado_em: string
}

export interface AdminStats {
  condutores: number
  profissionais: number
  profissionais_pendentes: number
  profissionais_verificados: number
  servicos: number
  servicos_hoje: number
  servicos_concluidos: number
  volume: number
  reclamacoes_abertas: number
  receita_ultimos_14_dias: Array<{ data: string; valor: number }>
  novos_usuarios_ultimos_14_dias: Array<{ data: string; total: number }>
  servicos_por_categoria: Array<{ categoria: string; total: number }>
}

export interface ApiError {
  error: boolean
  message: string
  code: string
  details?: Record<string, unknown>
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiResponse<T = unknown> {
  data: T
}