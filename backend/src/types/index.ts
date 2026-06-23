export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha_hash: string;
  telefone?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  created_at: Date;
  updated_at: Date;
}

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
  created_at: Date;
  updated_at: Date;
}

export interface Servico {
  id: string;
  concessionaria_id: string;
  nome: string;
  tipo: 'revisao_completa' | 'oleo' | 'freios' | 'suspensao' | 'eletrica' | 'pneus';
  descricao?: string;
  preco: number;
  tempo_estimado?: number;
  disponivel: boolean;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface Review {
  id: string;
  usuario_id: string;
  concessionaria_id: string;
  agendamento_id: string;
  nota: number;
  comentario?: string;
  created_at: Date;
}

export interface Favorito {
  id: string;
  usuario_id: string;
  concessionaria_id: string;
  created_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  usuarioId: string;
  tipo: 'motociclista' | 'concessionaria';
}
