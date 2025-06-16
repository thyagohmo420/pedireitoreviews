import React, { useState } from 'react';
import { List, Search, Eye } from 'lucide-react';
import { Indicacao } from '../types';
import { formatDate } from '../utils/helpers';

interface IndicacoesTableProps {
  indicacoes: Indicacao[];
  onViewDetails: (indicacao: Indicacao) => void;
}

export const IndicacoesTable: React.FC<IndicacoesTableProps> = ({ indicacoes, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredIndicacoes = indicacoes.filter(indicacao => {
    const matchesSearch = indicacao.nomeIndicado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicacao.telefone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || indicacao.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <List className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Minhas Indicações</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar indicações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todos os Status</option>
              <option value="Aguardando Contato">Aguardando Contato</option>
              <option value="Em Negociação">Em Negociação</option>
              <option value="Fechado">Fechado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cliente</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Tipo</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Data</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredIndicacoes.map((indicacao) => (
                <tr key={indicacao.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{indicacao.nomeIndicado}</p>
                      <p className="text-xs text-gray-500">{indicacao.telefone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      indicacao.tipo === 'Venda'
                        ? 'text-purple-700 bg-purple-100'
                        : 'text-purple-700 bg-purple-100'
                    }`}>
                      {indicacao.tipo}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{formatDate(indicacao.dataIndicacao)}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      indicacao.status === 'Fechado'
                        ? 'text-green-700 bg-green-100'
                        : indicacao.status === 'Em Negociação'
                        ? 'text-purple-700 bg-purple-100'
                        : indicacao.status === 'Cancelado'
                        ? 'text-red-700 bg-red-100'
                        : 'text-gray-700 bg-gray-100'
                    }`}>
                      {indicacao.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onViewDetails(indicacao)}
                      className="text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredIndicacoes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhuma indicação encontrada</p>
          </div>
        )}
      </div>
    </div>
  );
};