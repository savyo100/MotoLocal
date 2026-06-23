export interface Concessionaria {
  id: string;
  nome: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  endereco: string;
  latitude: number;
  longitude: number;
  marca?: string;
  horario_abertura?: string;
  horario_fechamento?: string;
  foto_url?: string;
  destaque: boolean;
  media_preco?: number;
  score: number;
  tempo_estimado_medio?: number;
  ativa: boolean;
  distancia_km?: number;
  servicos?: Servico[];
  reviews?: Review[];
  media_reviews?: number;
  total_reviews?: number;
  created_at: string;
  updated_at: string;
}

export interface Servico {
  id: string;
  concessionaria_id: string;
  nome: string;
  tipo: string;
  descricao?: string;
  preco: number;
  tempo_estimado?: number;
  disponivel: boolean;
}

export interface Agendamento {
  id: string;
  usuario_id: string;
  concessionaria_id: string;
  servico_id: string;
  data: string;
  horario: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  observacao?: string;
  concessionaria_nome?: string;
  servico_nome?: string;
  preco?: number;
  created_at: string;
}

export interface Review {
  id: string;
  usuario_id: string;
  concessionaria_id: string;
  agendamento_id: string;
  nota: number;
  comentario?: string;
  usuario_nome?: string;
  created_at: string;
}

export interface Favorito {
  id: string;
  usuario_id: string;
  concessionaria_id: string;
  nome?: string;
  endereco?: string;
  score?: number;
  foto_url?: string;
}

export interface Promocao {
  id: string;
  concessionaria_id: string;
  titulo: string;
  descricao?: string;
  desconto_percentual?: number;
  data_inicio: string;
  data_fim: string;
  ativa: boolean;
  concessionaria_nome?: string;
  concessionaria_endereco?: string;
  foto_url?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
}

export interface AuthResponse {
  usuario: Usuario;
  token: string;
}
