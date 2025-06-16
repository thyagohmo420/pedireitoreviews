import { Partner, Indicacao, RankingPartner } from '../types';

export const currentPartner: Partner = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@email.com',
  totalIndicacoes: 47,
  vendasConvertidas: 12,
  locacoesConvertidas: 8,
  pontuacao: 2840,
  nivel: 'Ouro'
};

export const indicacoes: Indicacao[] = [
  {
    id: '1',
    parceiroId: '1',
    nomeIndicado: 'Maria Santos',
    telefone: '(11) 99999-9999',
    tipo: 'Venda',
    observacoes: 'Interessada em apartamento 2 quartos, Zona Sul',
    status: 'Fechado',
    pontuacao: 150,
    dataIndicacao: '2024-01-15'
  },
  {
    id: '2',
    parceiroId: '1',
    nomeIndicado: 'Pedro Oliveira',
    telefone: '(11) 88888-8888',
    tipo: 'Locação',
    observacoes: 'Procura casa para alugar, até R$ 3.000',
    status: 'Em Negociação',
    pontuacao: 80,
    dataIndicacao: '2024-01-20'
  },
  {
    id: '3',
    parceiroId: '1',
    nomeIndicado: 'Ana Costa',
    telefone: '(11) 77777-7777',
    tipo: 'Venda',
    observacoes: 'Primeira compra, jovem casal',
    status: 'Aguardando Contato',
    pontuacao: 0,
    dataIndicacao: '2024-01-25'
  },
  {
    id: '4',
    parceiroId: '1',
    nomeIndicado: 'Carlos Ferreira',
    telefone: '(11) 66666-6666',
    tipo: 'Locação',
    observacoes: 'Empresário, precisa com urgência',
    status: 'Fechado',
    pontuacao: 100,
    dataIndicacao: '2024-01-10'
  }
];

export const ranking: RankingPartner[] = [
  { posicao: 1, nome: 'Ana Paula Rodrigues', pontos: 4250, vendas: 18, locacoes: 12 },
  { posicao: 2, nome: 'Roberto Mendes', pontos: 3890, vendas: 15, locacoes: 14 },
  { posicao: 3, nome: 'João Silva', pontos: 2840, vendas: 12, locacoes: 8, isCurrentUser: true },
  { posicao: 4, nome: 'Fernanda Lima', pontos: 2650, vendas: 10, locacoes: 11 },
  { posicao: 5, nome: 'Carlos Santos', pontos: 2180, vendas: 8, locacoes: 9 },
  { posicao: 6, nome: 'Juliana Costa', pontos: 1950, vendas: 7, locacoes: 8 },
  { posicao: 7, nome: 'Ricardo Alves', pontos: 1720, vendas: 6, locacoes: 7 },
  { posicao: 8, nome: 'Mariana Silva', pontos: 1580, vendas: 5, locacoes: 8 }
];