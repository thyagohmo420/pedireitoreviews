import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Emails de administradores (apenas domínio correto)
const ADMIN_EMAILS = [
  'felipe@pedireitoimoveis.com.br',
  'contato@pedireitoimoveis.com.br'
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verifica sessão existente
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user);
      }
      setIsLoading(false);
    };

    getSession();

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: AuthUser) => {
    try {
      console.log('🔍 Carregando perfil para:', authUser.email);
      console.log('🔑 Auth User ID:', authUser.id);
      
      // Busca ou cria o perfil do usuário
      let { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      console.log('📝 Resultado da busca profile:', { profile, error });

      if (error && error.code === 'PGRST116') {
        // Usuário não existe, vamos criar
        console.log('👤 Usuário não existe, criando perfil...');
        const isAdmin = ADMIN_EMAILS.includes(authUser.email || '');
        console.log('🔐 É admin?', isAdmin, 'Email:', authUser.email);
        
        // Para admins, apenas dar erro - eles devem ser criados manualmente
        if (isAdmin) {
          console.error('❌ Admin não encontrado na tabela users. Execute o script SQL primeiro.');
          return;
        }
        
        const { data: newProfile, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Usuário',
            phone: authUser.user_metadata?.phone || '',
            role: 'partner'
          })
          .select()
          .single();

        console.log('✅ Perfil criado:', { newProfile, insertError });

        if (insertError) {
          console.error('❌ Erro ao criar perfil:', insertError);
          return;
        }

        profile = newProfile;

        // Criar registro na tabela partners
        console.log('👥 Criando registro de parceiro...');
        const partnerResult = await supabase
          .from('partners')
          .insert({
            user_id: authUser.id,
            rank: 'Bronze',
            points: 0,
            total_indicacoes: 0,
            indicacoes_fechadas: 0
          });
        console.log('👥 Resultado parceiro:', partnerResult);
      } else if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        return;
      }

      if (profile) {
        const userProfile = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          role: profile.role,
          createdAt: profile.created_at
        };
        console.log('✅ Perfil carregado:', userProfile);
        setUser(userProfile);
      }
    } catch (error) {
      console.error('💥 Erro geral ao carregar perfil:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Erro no login:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone
          }
        }
      });

      if (error) {
        console.error('Erro no registro:', error);
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }

      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};