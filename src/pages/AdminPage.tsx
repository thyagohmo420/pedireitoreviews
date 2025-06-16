import React, { useState } from 'react';
import { Users, TrendingUp, Award, Settings, Eye, EyeOff } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { DashboardCharts } from '../components/DashboardCharts';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const { ranking, indicacoes } = useData();
  const [showDetails, setShowDetails] = useState(false);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const totalIndicacoes = indicacoes.length;
  const indicacoesFechadas = indicacoes.filter(i => i.status === 'fechada').length;
  const totalPontos = indicacoes.reduce((sum, i) => sum + i.pontuacao, 0);
  const taxaConversao = totalIndicacoes > 0 ? (indicacoesFechadas / totalIndicacoes * 100).toFixed(1) : '0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header partner={user as any} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Admin Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Painel Administrativo</h1>
                <p className="text-primary-100">Visão geral da plataforma Pé Direito Indicações</p>
              </div>
              <Settings className="w-12 h-12 text-primary-200" />
            </div>
          </div>

          {/* Admin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Parceiros</p>
                  <p className="text-3xl font-bold text-primary-600">{ranking.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Indicações</p>
                  <p className="text-3xl font-bold text-primary-600">{totalIndicacoes}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Taxa de Conversão</p>
                  <p className="text-3xl font-bold text-primary-600">{taxaConversao}%</p>
                </div>
                <Award className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pontos Totais</p>
                  <p className="text-3xl font-bold text-primary-600">{totalPontos.toLocaleString()}</p>
                </div>
                <Award className="w-8 h-8 text-primary-600" />
              </div>
            </div>
          </div>

          {/* Gráficos */}
          <DashboardCharts indicacoes={indicacoes} />

          {/* Ranking Completo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Ranking Completo de Parceiros</h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{showDetails ? 'Ocultar' : 'Mostrar'} Detalhes</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parceiro
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pontos
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendas
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Locações
                    </th>
                    {showDetails && (
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ranking.map((partner, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            partner.posicao === 1 ? 'bg-yellow-100 text-yellow-800' :
                            partner.posicao === 2 ? 'bg-gray-100 text-gray-800' :
                            partner.posicao === 3 ? 'bg-amber-100 text-amber-800' :
                            'bg-primary-100 text-primary-800'
                          }`}>
                            {partner.posicao}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {partner.nome}
                          {partner.isCurrentUser && (
                            <span className="ml-2 inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                              Logado
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-gray-900">
                          {partner.pontos.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                          {partner.vendas}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                          {partner.locacoes}
                        </span>
                      </td>
                      {showDetails && (
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                            Ativo
                          </span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};