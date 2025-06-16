import React, { useState } from 'react';
import { Trophy, User } from 'lucide-react';

interface RankingPartner {
  id: string;
  nome: string;
  email: string;
  pontos: number;
  vendas: number;
  locacoes: number;
  isCurrentUser?: boolean;
}

interface RankingTableProps {
  ranking: RankingPartner[];
  currentUserId: string;
}

export const RankingTable: React.FC<RankingTableProps> = ({ ranking, currentUserId }) => {
  const [period, setPeriod] = useState('month');

  const getRowStyle = (index: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return 'bg-purple-50 border-purple-200';
    if (index === 0) return 'bg-yellow-50 border-yellow-200';
    if (index === 1) return 'bg-gray-100 border-gray-200';
    if (index === 2) return 'bg-orange-50 border-orange-200';
    return '';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Ranking de Parceiros</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Período:</span>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="month">Este Mês</option>
              <option value="year">Este Ano</option>
              <option value="all">Todo Período</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Posição</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Parceiro</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Pontos</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Vendas</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Locações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ranking.map((partner, index) => (
                <tr
                  key={partner.id}
                  className={`${getRowStyle(index, partner.isCurrentUser || false)} transition-colors`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      {index < 3 ? (
                        <Trophy className={`w-5 h-5 ${
                          index === 0 ? 'text-yellow-500' :
                          index === 1 ? 'text-gray-400' :
                          'text-orange-500'
                        }`} />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{index + 1}º</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{partner.nome}</p>
                        <p className="text-xs text-gray-500">{partner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      {partner.pontos} pts
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-sm text-gray-900">{partner.vendas}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                      {partner.locacoes}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};