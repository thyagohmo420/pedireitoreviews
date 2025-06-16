import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Partner, Indicacao, RankingPartner } from '../types';
import { useAuth } from './AuthContext';

interface DataContextType {
  partner: Partner | null;
  indicacoes: Indicacao[];
  ranking: RankingPartner[];
  addIndicacao: (indicacao: Omit<Indicacao, 'id' | 'parceiroId' | 'dataIndicacao' | 'pontuacao'>) => void;
  updateIndicacaoStatus: (id: string, status: Indicacao['status']) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockPartners: Partner[] = [
  {
    id: '2',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-1111',
    role: 'partner',
    totalIndicacoes: 47,
    vendasConvertidas: 12,
    locacoesConvertidas: 8,
    pontuacao: 2840,
    nivel: 'Ouro',
    createdAt: '2024-01-15'
  }
];

let mockIndicacoes: Indicacao[] = [
  {
    id: '1',
    parceiroId: '2',
    nomeIndicado: 'Maria Santos',
    telefone: '(11) 99999-9999',
    tipo: 'Venda',
    observacoes: 'Interessada em apartamento 2 quartos, Zona Sul',
    status: 'Fechado',
    pontuacao: 30,
    dataIndicacao: '2024-01-15'
  },
  {
    id: '2',
    parceiroId: '2',
    nomeIndicado: 'Pedro Oliveira',
    telefone: '(11) 88888-8888',
    tipo: 'Locação',
    observacoes: 'Procura casa para alugar, até R$ 3.000',
    status: 'Em Negociação',
    pontuacao: 10,
    dataIndicacao: '2024-01-20'
  },
  {
    id: '3',
    parceiroId: '2',
    nomeIndicado: 'Ana Costa',
    telefone: '(11) 77777-7777',
    tipo: 'Venda',
    observacoes: 'Primeira compra, jovem casal',
    status: 'Aguardando Contato',
    pontuacao: 15,
    dataIndicacao: '2024-01-25'
  },
  {
    id: '4',
    parceiroId: '2',
    nomeIndicado: 'Carlos Ferreira',
    telefone: '(11) 66666-6666',
    tipo: 'Locação',
    observacoes: 'Empresário, precisa com urgência',
    status: 'Fechado',
    pontuacao: 20,
    dataIndicacao: '2024-01-10'
  }
];

const calculatePoints = (tipo: 'Venda' | 'Locação', status: Indicacao['status']): number => {
  if (status === 'Fechado') {
    return tipo === 'Venda' ? 30 : 20; // Bem sucedidas
  } else {
    return tipo === 'Venda' ? 15 : 10; // Indicação normal
  }
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
  const [ranking, setRanking] = useState<RankingPartner[]>([]);

  useEffect(() => {
    if (user && user.role === 'partner') {
      const foundPartner = mockPartners.find(p => p.id === user.id);
      if (foundPartner) {
        setPartner(foundPartner);
        const userIndicacoes = mockIndicacoes.filter(i => i.parceiroId === user.id);
        setIndicacoes(userIndicacoes);
        updateRanking();
      }
    }
  }, [user]);

  const updateRanking = () => {
    // Calculate ranking based on points
    const partnerStats = mockPartners.map(p => {
      const partnerIndicacoes = mockIndicacoes.filter(i => i.parceiroId === p.id);
      const pontos = partnerIndicacoes.reduce((sum, i) => sum + i.pontuacao, 0);
      const vendas = partnerIndicacoes.filter(i => i.tipo === 'Venda' && i.status === 'Fechado').length;
      const locacoes = partnerIndicacoes.filter(i => i.tipo === 'Locação' && i.status === 'Fechado').length;
      
      return {
        nome: p.name,
        pontos,
        vendas,
        locacoes,
        isCurrentUser: p.id === user?.id
      };
    });

    // Add some mock competitors
    const mockCompetitors = [
      { nome: 'Ana Paula Rodrigues', pontos: 4250, vendas: 18, locacoes: 12 },
      { nome: 'Roberto Mendes', pontos: 3890, vendas: 15, locacoes: 14 },
      { nome: 'Fernanda Lima', pontos: 2650, vendas: 10, locacoes: 11 },
      { nome: 'Carlos Santos', pontos: 2180, vendas: 8, locacoes: 9 },
    ];

    const allStats = [...partnerStats, ...mockCompetitors]
      .sort((a, b) => b.pontos - a.pontos)
      .map((stat, index) => ({
        ...stat,
        posicao: index + 1
      }));

    setRanking(allStats);
  };

  const addIndicacao = (newIndicacao: Omit<Indicacao, 'id' | 'parceiroId' | 'dataIndicacao' | 'pontuacao'>) => {
    if (!user) return;

    const indicacao: Indicacao = {
      ...newIndicacao,
      id: Date.now().toString(),
      parceiroId: user.id,
      dataIndicacao: new Date().toISOString().split('T')[0],
      pontuacao: calculatePoints(newIndicacao.tipo, newIndicacao.status)
    };

    mockIndicacoes.push(indicacao);
    setIndicacoes(prev => [...prev, indicacao]);
    
    // Update partner stats
    if (partner) {
      const updatedPartner = {
        ...partner,
        totalIndicacoes: partner.totalIndicacoes + 1,
        pontuacao: partner.pontuacao + indicacao.pontuacao
      };
      setPartner(updatedPartner);
    }
    
    updateRanking();
  };

  const updateIndicacaoStatus = (id: string, status: Indicacao['status']) => {
    const indicacaoIndex = mockIndicacoes.findIndex(i => i.id === id);
    if (indicacaoIndex === -1) return;

    const indicacao = mockIndicacoes[indicacaoIndex];
    const oldPoints = indicacao.pontuacao;
    const newPoints = calculatePoints(indicacao.tipo, status);
    
    mockIndicacoes[indicacaoIndex] = {
      ...indicacao,
      status,
      pontuacao: newPoints,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    setIndicacoes(prev => prev.map(i => 
      i.id === id ? { ...i, status, pontuacao: newPoints } : i
    ));

    // Update partner stats
    if (partner) {
      const pointsDiff = newPoints - oldPoints;
      let vendasConvertidas = partner.vendasConvertidas;
      let locacoesConvertidas = partner.locacoesConvertidas;

      if (status === 'Fechado') {
        if (indicacao.tipo === 'Venda') vendasConvertidas++;
        else locacoesConvertidas++;
      }

      const updatedPartner = {
        ...partner,
        vendasConvertidas,
        locacoesConvertidas,
        pontuacao: partner.pontuacao + pointsDiff
      };
      setPartner(updatedPartner);
    }

    updateRanking();
  };

  const refreshData = () => {
    updateRanking();
  };

  return (
    <DataContext.Provider value={{
      partner,
      indicacoes,
      ranking,
      addIndicacao,
      updateIndicacaoStatus,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};