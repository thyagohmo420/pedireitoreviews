import React from 'react';
import { TrendingUp, Home, Key, Award, Star, Trophy, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { Partner } from '../types';
import { getNivelColor } from '../utils/helpers';

interface StatsPanelProps {
  partner: Partner;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ partner }) => {
  const calculateConversionRate = () => {
    const total = partner.vendasConvertidas + partner.locacoesConvertidas;
    const rate = partner.totalIndicacoes > 0 ? (total / partner.totalIndicacoes) * 100 : 0;
    return Math.round(rate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard do Parceiro</h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getNivelColor(partner.nivel)}`}>
          <Star className="w-4 h-4 mr-1" />
          Nível {partner.nivel}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total de Pontos"
          value={partner.pontuacao}
          icon={<Trophy className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatsCard
          title="Indicações"
          value={partner.totalIndicacoes}
          icon={<Users className="w-5 h-5" />}
          color="text-purple-600"
        />
        <StatsCard
          title="Taxa de Conversão"
          value={calculateConversionRate()}
          icon={<TrendingUp className="w-5 h-5" />}
          color="text-purple-600"
        />
      </div>
    </div>
  );
};