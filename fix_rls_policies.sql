-- SCRIPT PARA CORRIGIR PROBLEMAS DE RLS
-- Execute no SQL Editor do Supabase

-- 1. Remover políticas antigas e criar mais simples
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- 2. Criar políticas mais permissivas temporariamente
CREATE POLICY "Authenticated users can read users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Corrigir políticas de partners
DROP POLICY IF EXISTS "Partners can view their own data" ON partners;
DROP POLICY IF EXISTS "Partners can update their own data" ON partners;
DROP POLICY IF EXISTS "Admins can view all partners" ON partners;

CREATE POLICY "Authenticated users can read partners" ON partners
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their partner profile" ON partners
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their partner profile" ON partners
  FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Corrigir políticas de indicacoes
DROP POLICY IF EXISTS "Partners can view their own indicacoes" ON indicacoes;
DROP POLICY IF EXISTS "Partners can insert their own indicacoes" ON indicacoes;
DROP POLICY IF EXISTS "Partners can update their own indicacoes" ON indicacoes;
DROP POLICY IF EXISTS "Admins can manage all indicacoes" ON indicacoes;

CREATE POLICY "Authenticated users can manage indicacoes" ON indicacoes
  FOR ALL TO authenticated USING (true);

-- 5. Criar função para sincronizar perfis automaticamente
CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE 
      WHEN NEW.email IN ('felipe@pedireitoimoveis.com.br', 'contato@pedireitoimoveis.com.br') 
      THEN 'admin' 
      ELSE 'partner' 
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, sync_user_profile.name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Criar trigger para sincronização automática
DROP TRIGGER IF EXISTS sync_user_profile_trigger ON auth.users;
CREATE TRIGGER sync_user_profile_trigger
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION sync_user_profile();

-- 7. Sincronizar usuários existentes
INSERT INTO public.users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
  CASE 
    WHEN au.email IN ('felipe@pedireitoimoveis.com.br', 'contato@pedireitoimoveis.com.br') 
    THEN 'admin' 
    ELSE 'partner' 
  END as role
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING; 