import React from 'react';
import { Header } from '../components/Header';
import { StatsPanel } from '../components/StatsPanel';
import { IndicacaoForm } from '../components/IndicacaoForm';
import { IndicacoesTable } from '../components/IndicacoesTable';
import { RankingTable } from '../components/RankingTable';
import { Footer } from '../components/Footer';
import { useData } from '../contexts/DataContext';

export const DashboardPage: React.FC = () => {
  const { partner, indicacoes, ranking } = useData();

  if (!partner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando dados do parceiro...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header partner={partner} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <StatsPanel partner={partner} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <IndicacoesTable indicacoes={indicacoes} />
            </div>
            <div>
              <IndicacaoForm />
            </div>
          </div>
          
          <RankingTable ranking={ranking} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};