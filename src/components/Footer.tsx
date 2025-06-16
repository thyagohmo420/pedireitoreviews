import React from 'react';
import { Building2, Phone, Mail, FileText, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Pé Direito</h2>
                <p className="text-sm text-gray-300">Plataforma de Indicações</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Conectamos parceiros e clientes de forma eficiente, 
              criando oportunidades de negócio no mercado imobiliário.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contato da Imobiliária</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-gray-300">contato@pedireito.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Building2 className="w-4 h-4 text-purple-400 mt-0.5" />
                <span className="text-sm text-gray-300">São Paulo, SP</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Links Importantes</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Termos de Uso</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                <Shield className="w-4 h-4" />
                <span>Política de Privacidade</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-sm text-gray-300 hover:text-purple-400 transition-colors">
                <Building2 className="w-4 h-4" />
                <span>Sobre a Imobiliária</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 IndicaFácil. Todos os direitos reservados. 
            <span className="mx-2">•</span>
            Desenvolvido com ❤️ para conectar pessoas e oportunidades.
          </p>
        </div>
      </div>
    </footer>
  );
};