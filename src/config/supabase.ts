import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key são necessários.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  nome: string;
  role: 'admin' | 'partner';
  created_at: string;
  avatar_url?: string;
};

export type Indicacao = {
  id: string;
  user_id: string;
  cliente_nome: string;
  cliente_email: string;
  cliente_telefone: string;
  tipo: 'venda' | 'locacao';
  valor_aproximado: number;
  detalhes: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'fechada' | 'cancelada';
  pontuacao: number;
  created_at: string;
  updated_at: string;
};

export type Ranking = {
  id: string;
  user_id: string;
  nome: string;
  pontos: number;
  vendas: number;
  locacoes: number;
  posicao: number;
  periodo: string;
  created_at: string;
  updated_at: string;
};

export type Recompensa = {
  id: string;
  nome: string;
  descricao: string;
  pontos_necessarios: number;
  tipo: 'produto' | 'servico' | 'bonus';
  disponivel: boolean;
  imagem_url?: string;
  created_at: string;
}; 