import React from 'react';
import { Building2, LogOut, User } from 'lucide-react';
import { Partner } from '../types';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  partner: Partner;
}

export const Header: React.FC<HeaderProps> = ({ partner }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Pé Direito
              </h1>
              <p className="text-xs text-gray-500">Plataforma de Indicações</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full">
                <User className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{partner.name}</p>
                <p className="text-gray-500">{partner.email}</p>
              </div>
            </div>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};