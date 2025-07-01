-- SCRIPT PARA CORRIGIR USUÁRIOS COM DOMÍNIOS MISTURADOS
-- Execute no SQL Editor do Supabase

-- 1. PRIMEIRO: Verificar situação atual
SELECT 'Usuários no auth.users:' as info;
SELECT id, email, email_confirmed_at FROM auth.users ORDER BY created_at;

SELECT 'Usuários na tabela users:' as info;
SELECT id, email, name, role FROM users ORDER BY created_at;

-- 2. REMOVER usuários com domínio antigo (pedireito.com.br) do auth.users
-- CUIDADO: Isso vai deletar os usuários do Authentication!
DELETE FROM auth.users 
WHERE email IN ('felipe@pedireito.com.br', 'contato@pedireito.com.br');

-- 3. REMOVER usuários com domínio antigo da tabela users também
DELETE FROM users 
WHERE email IN ('felipe@pedireito.com.br', 'contato@pedireito.com.br');

-- 4. VERIFICAR se felipe@pedireitoimoveis.com.br está na tabela users
SELECT 'Felipe na tabela users:' as info;
SELECT * FROM users WHERE email = 'felipe@pedireitoimoveis.com.br';

-- 5. Se não existir ou estiver com role errado, corrigir:
INSERT INTO users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  'Felipe',
  'admin'
FROM auth.users au
WHERE au.email = 'felipe@pedireitoimoveis.com.br'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Felipe';

-- 6. CRIAR usuário contato@pedireitoimoveis.com.br na tabela users se existir no auth
INSERT INTO users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  'Contato',
  'admin'
FROM auth.users au
WHERE au.email = 'contato@pedireitoimoveis.com.br'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Contato';

-- 7. VERIFICAR resultado final
SELECT 'RESULTADO FINAL - auth.users:' as info;
SELECT id, email, email_confirmed_at FROM auth.users WHERE email LIKE '%pedireitoimoveis.com.br%';

SELECT 'RESULTADO FINAL - users table:' as info;
SELECT id, email, name, role FROM users WHERE role = 'admin';

-- 8. APLICAR políticas RLS corretas (sem o trigger que causou erro)
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;

CREATE POLICY "Authenticated users can read users" ON users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id); 