export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'partner';
  createdAt: string;
}

export interface Partner extends User {
  totalIndicacoes: number;
  vendasConvertidas: number;
  locacoesConvertidas: number;
  pontuacao: number;
  nivel: 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
}

export interface Indicacao {
  id: string;
  parceiroId: string;
  nomeIndicado: string;
  telefone: string;
  tipo: 'Venda' | 'Locação';
  observacoes?: string;
  status: 'Aguardando Contato' | 'Em Negociação' | 'Fechado' | 'Cancelado';
  pontuacao: number;
  dataIndicacao: string;
  dataAtualizacao?: string;
}

export interface RankingPartner {
  posicao: number;
  nome: string;
  pontos: number;
  vendas: number;
  locacoes: number;
  isCurrentUser?: boolean;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}