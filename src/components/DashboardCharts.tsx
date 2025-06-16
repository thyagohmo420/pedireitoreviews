import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Indicacao } from '../config/supabase';

interface DashboardChartsProps {
  indicacoes: Indicacao[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ indicacoes }) => {
  // Preparar dados para o gráfico de indicações por status
  const indicacoesPorStatus = {
    pendente: indicacoes.filter(i => i.status === 'pendente').length,
    em_analise: indicacoes.filter(i => i.status === 'em_analise').length,
    aprovada: indicacoes.filter(i => i.status === 'aprovada').length,
    fechada: indicacoes.filter(i => i.status === 'fechada').length,
    cancelada: indicacoes.filter(i => i.status === 'cancelada').length,
  };

  const statusData = [
    { name: 'Pendente', value: indicacoesPorStatus.pendente },
    { name: 'Em Análise', value: indicacoesPorStatus.em_analise },
    { name: 'Aprovada', value: indicacoesPorStatus.aprovada },
    { name: 'Fechada', value: indicacoesPorStatus.fechada },
    { name: 'Cancelada', value: indicacoesPorStatus.cancelada },
  ];

  // Preparar dados para o gráfico de evolução mensal
  const indicacoesPorMes = indicacoes.reduce((acc, indicacao) => {
    const mes = format(new Date(indicacao.created_at), 'MMM yyyy', { locale: ptBR });
    if (!acc[mes]) {
      acc[mes] = { total: 0, vendas: 0, locacoes: 0 };
    }
    acc[mes].total += 1;
    if (indicacao.tipo === 'venda') {
      acc[mes].vendas += 1;
    } else {
      acc[mes].locacoes += 1;
    }
    return acc;
  }, {} as Record<string, { total: number; vendas: number; locacoes: number }>);

  const evolucaoData = Object.entries(indicacoesPorMes).map(([mes, dados]) => ({
    mes,
    ...dados,
  }));

  return (
    <div className="space-y-8">
      {/* Gráfico de Status das Indicações */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status das Indicações</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#8b5cf6"
                name="Quantidade"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Evolução Mensal</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evolucaoData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#8b5cf6"
                name="Total"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="vendas"
                stroke="#10b981"
                name="Vendas"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="locacoes"
                stroke="#3b82f6"
                name="Locações"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 