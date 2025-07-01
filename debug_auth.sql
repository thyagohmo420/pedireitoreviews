-- DEBUG SCRIPT - Execute no SQL Editor do Supabase
-- Este script vai identificar o problema de autenticação

-- 1. Verificar se as tabelas existem
SELECT 'Tabelas existentes:' as info;
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- 2. Verificar usuários no Authentication (auth.users)
SELECT 'Usuários no Authentication:' as info;
SELECT id, email, email_confirmed_at, created_at FROM auth.users ORDER BY created_at;

-- 3. Verificar usuários na tabela users
SELECT 'Usuários na tabela users:' as info;
SELECT * FROM users ORDER BY created_at;

-- 4. Verificar políticas RLS
SELECT 'Políticas RLS:' as info;
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- 5. Verificar se RLS está habilitado
SELECT 'Status RLS:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- SOLUÇÕES TEMPORÁRIAS (se necessário):

-- Solução 1: Desabilitar RLS temporariamente para testar
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Solução 2: Criar política mais permissiva temporária
-- DROP POLICY IF EXISTS "temp_allow_all" ON users;
-- CREATE POLICY "temp_allow_all" ON users FOR ALL TO authenticated USING (true);

-- Solução 3: Inserir manualmente os perfis dos admins (se necessário)
-- Execute apenas se os usuários existem no auth.users mas não na tabela users
-- INSERT INTO users (id, email, name, role)
-- SELECT 
--   au.id,
--   au.email,
--   COALESCE(au.raw_user_meta_data->>'name', split_part(au.email, '@', 1)) as name,
--   CASE 
--     WHEN au.email IN ('felipe@pedireitoimoveis.com.br', 'contato@pedireitoimoveis.com.br') 
--     THEN 'admin' 
--     ELSE 'partner' 
--   END as role
-- FROM auth.users au
-- WHERE au.id NOT IN (SELECT id FROM users)
-- ON CONFLICT (email) DO NOTHING; 