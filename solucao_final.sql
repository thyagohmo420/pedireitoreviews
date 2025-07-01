-- SOLUÇÃO FINAL - Execute no SQL Editor do Supabase

-- 1. DESABILITAR RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes DISABLE ROW LEVEL SECURITY;

-- 2. LIMPAR usuários com domínio antigo
DELETE FROM auth.users WHERE email LIKE '%@pedireito.com.br';
DELETE FROM users WHERE email LIKE '%@pedireito.com.br';

-- 3. GARANTIR que felipe está correto na tabela users
DELETE FROM users WHERE email = 'felipe@pedireitoimoveis.com.br';

INSERT INTO users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  'Felipe Admin',
  'admin'
FROM auth.users au
WHERE au.email = 'felipe@pedireitoimoveis.com.br';

-- 4. CRIAR contato se existir no auth
INSERT INTO users (id, email, name, role)
SELECT 
  au.id,
  au.email,
  'Contato Admin',
  'admin'
FROM auth.users au
WHERE au.email = 'contato@pedireitoimoveis.com.br';

-- 5. REABILITAR RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicacoes ENABLE ROW LEVEL SECURITY;

-- 6. CRIAR políticas muito permissivas
DROP POLICY IF EXISTS "Allow all for authenticated users" ON users;
CREATE POLICY "Allow all for authenticated users" ON users
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all partners" ON partners;  
CREATE POLICY "Allow all partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all indicacoes" ON indicacoes;
CREATE POLICY "Allow all indicacoes" ON indicacoes
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7. VERIFICAR resultado
SELECT 'ADMINS CRIADOS:' as info;
SELECT id, email, name, role FROM users WHERE role = 'admin'; 