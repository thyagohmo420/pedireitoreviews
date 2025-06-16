import React, { useState } from 'react';
import { Plus, Loader2, CheckCircle } from 'lucide-react';
import { formatPhone } from '../utils/helpers';
import { useData } from '../contexts/DataContext';

interface FormData {
  nomeIndicado: string;
  telefone: string;
  tipo: 'Venda' | 'Locação';
  observacoes: string;
}

export const IndicacaoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeIndicado: '',
    telefone: '',
    tipo: 'Venda',
    observacoes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  
  const { addIndicacao } = useData();

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.nomeIndicado.trim()) {
      newErrors.nomeIndicado = 'Nome é obrigatório';
    }
    
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    } else if (formData.telefone.replace(/\D/g, '').length < 10) {
      newErrors.telefone = 'Telefone deve ter pelo menos 10 dígitos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simular envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Adicionar indicação com status inicial
    addIndicacao({
      nomeIndicado: formData.nomeIndicado,
      telefone: formData.telefone,
      tipo: formData.tipo,
      observacoes: formData.observacoes,
      status: 'Aguardando Contato'
    });
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form
    setFormData({
      nomeIndicado: '',
      telefone: '',
      tipo: 'Venda',
      observacoes: ''
    });
    
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, telefone: formatted }));
    
    if (errors.telefone) {
      setErrors(prev => ({ ...prev, telefone: undefined }));
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Indicação Enviada!</h3>
          <p className="text-gray-600 mb-4">A indicação foi registrada com sucesso.</p>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Pontos ganhos:</strong> {formData.tipo === 'Venda' ? '15' : '10'} pontos
            </p>
            <p className="text-xs text-purple-600 mt-1">
              Ganhe mais pontos quando a indicação for fechada!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {showSuccess && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-800">
            Indicação enviada com sucesso!
          </p>
          <p className="text-xs text-purple-600 mt-1">
            Você receberá atualizações sobre o status da sua indicação.
          </p>
        </div>
      )}

      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Plus className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Nova Indicação</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nomeIndicado" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo do Indicado *
          </label>
          <input
            type="text"
            id="nomeIndicado"
            value={formData.nomeIndicado}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, nomeIndicado: e.target.value }));
              if (errors.nomeIndicado) setErrors(prev => ({ ...prev, nomeIndicado: undefined }));
            }}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
              errors.nomeIndicado ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Digite o nome completo"
          />
          {errors.nomeIndicado && (
            <p className="mt-1 text-sm text-red-600">{errors.nomeIndicado}</p>
          )}
        </div>

        <div>
          <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
            Telefone *
          </label>
          <input
            type="tel"
            id="telefone"
            value={formData.telefone}
            onChange={handlePhoneChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
              errors.telefone ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="(00) 00000-0000"
          />
          {errors.telefone && (
            <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
          )}
          <div className="text-xs text-purple-600 font-medium mt-1">
            Formato: (00) 00000-0000
          </div>
        </div>

        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Interesse *
          </label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'Venda' | 'Locação' }))}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
              errors.tipo ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="Venda">Venda</option>
            <option value="Locação">Locação</option>
          </select>
        </div>

        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
            Observações
          </label>
          <textarea
            id="observacoes"
            value={formData.observacoes}
            onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
            rows={4}
            placeholder="Informações adicionais sobre o interesse do cliente..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Enviar Indicação</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};