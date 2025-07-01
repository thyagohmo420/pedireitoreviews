# Configuração de Administradores - Pé Direito

## Administradores Configurados

Os seguintes emails estão configurados como administradores no sistema:

- `felipe@pedireitoimoveis.com.br`
- `contato@pedireitoimoveis.com.br`

## Como Configurar o Acesso dos Administradores

### 1. Executar as Migrações

Primeiro, certifique-se de que as migrações do banco foram aplicadas:

```bash
npx supabase migration up
```

### 2. Configurar Senhas no Supabase Auth

Para cada administrador, você precisa criar/configurar a senha no painel do Supabase:

#### Opção A: Via Dashboard do Supabase
1. Acesse o dashboard do Supabase do seu projeto
2. Vá em **Authentication** > **Users**
3. Procure pelos emails dos administradores
4. Se não existirem, clique em **Add user** e:
   - Email: `felipe@pedireitoimoveis.com.br` ou `contato@pedireitoimoveis.com.br`
   - Password: (defina uma senha segura)
   - Confirm email: ✅ (marque para confirmar automaticamente)

#### Opção B: Via SQL no Supabase
Execute no SQL Editor do Supabase:

```sql
-- Para inserir usuários no auth.users (se não existirem)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'felipe@pedireitoimoveis.com.br',
  crypt('SUA_SENHA_AQUI', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  '',
  '',
  ''
);
```

### 3. Verificar Perfis na Tabela Users

O sistema automaticamente criará os perfis na tabela `users` quando os administradores fizerem login pela primeira vez. Os emails listados acima serão automaticamente detectados como administradores.

### 4. Permitir Registro de Parceiros

O sistema já está configurado para permitir que novos parceiros se registrem através da página `/register`. Quando alguém se registra:

1. É criado um usuário no Supabase Auth
2. É criado um perfil na tabela `users` com role `partner`
3. É criado um registro na tabela `partners` com pontuação inicial

## Como Testar

1. **Teste de Login Admin**: Acesse `/login` e tente fazer login com um dos emails de admin e a senha configurada
2. **Teste de Registro Parceiro**: Acesse `/register` e crie uma nova conta de parceiro
3. **Teste de Permissões**: Admins devem ter acesso à página `/admin` e parceiros à página `/dashboard`

## Estrutura de Permissões

### Administradores (`role: 'admin'`)
- ✅ Acesso completo a todos os dados
- ✅ Podem ver todos os parceiros e indicações
- ✅ Acesso à página `/admin`
- ✅ Podem gerenciar status das indicações

### Parceiros (`role: 'partner'`)
- ✅ Podem ver apenas seus próprios dados
- ✅ Podem criar novas indicações
- ✅ Acesso à página `/dashboard`
- ❌ Não podem ver dados de outros parceiros

## Problemas Comuns

### "Email ou senha incorretos"
- Verifique se o usuário existe no Supabase Auth
- Verifique se a senha está correta
- Verifique se o email está confirmado

### "Usuário sem permissões"
- Verifique se o perfil foi criado na tabela `users`
- Verifique se o `role` está definido como `admin` ou `partner`

### Variáveis de Ambiente
Certifique-se de que as seguintes variáveis estão configuradas:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
``` 