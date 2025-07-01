# 🚀 Guia de Configuração - Pé Direito Ranking

## ✅ Checklist de Configuração

### 📊 **PASSO 1: Aplicar Migração no Supabase**

1. Acesse o dashboard do seu projeto no Supabase
2. Vá em **SQL Editor**
3. Cole e execute o script completo da migração (já mostrado acima)
4. ✅ Confirme que as tabelas foram criadas: `users`, `partners`, `indicacoes`

### 👤 **PASSO 2: Criar Usuários Administradores**

No dashboard do Supabase, vá em **Authentication** > **Users**:

#### Para felipe@pedireitoimoveis.com.br:
1. Clique em **Add user**
2. Email: `felipe@pedireitoimoveis.com.br`
3. Password: `[DEFINA UMA SENHA FORTE]`
4. ✅ Marque **Email confirmed**
5. Clique em **Create user**

#### Para contato@pedireitoimoveis.com.br:
1. Clique em **Add user**
2. Email: `contato@pedireitoimoveis.com.br`
3. Password: `[DEFINA UMA SENHA FORTE]`
4. ✅ Marque **Email confirmed**
5. Clique em **Create user**

### 🔧 **PASSO 3: Verificar Configuração das Tabelas**

No **SQL Editor**, execute para verificar:

```sql
-- Verificar se os admins foram inseridos na tabela users
SELECT * FROM users WHERE role = 'admin';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 🧪 **PASSO 4: Testar o Sistema Localmente**

1. **Executar o projeto:**
```bash
npm run dev
```

2. **Teste de Login Admin:**
   - Acesse `http://localhost:5173/login`
   - Faça login com `felipe@pedireitoimoveis.com.br` e a senha definida
   - ✅ Deve redirecionar para `/dashboard` e mostrar "Admin" no perfil

3. **Teste de Registro de Parceiro:**
   - Acesse `http://localhost:5173/register`
   - Cadastre um novo parceiro com email diferente
   - ✅ Deve permitir o registro e redirecionar para `/dashboard`

4. **Teste de Permissões:**
   - Admin deve acessar `/admin` ✅
   - Parceiro deve acessar apenas `/dashboard` ✅

### 🚀 **PASSO 5: Deploy no Vercel**

1. **Commit das mudanças:**
```bash
git add .
git commit -m "feat: configurar autenticação real com Supabase e admins"
git push origin main
```

2. **No dashboard do Vercel:**
   - Acesse seu projeto
   - Vá em **Settings** > **Environment Variables**
   - Confirme que estas variáveis estão configuradas:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Triggerar novo deploy:**
   - O push vai triggerar automaticamente
   - Ou force um redeploy no dashboard do Vercel

### 🔍 **PASSO 6: Testar em Produção**

1. **Teste de Login Admin:**
   - Acesse sua URL do Vercel + `/login`
   - Teste login com os emails de admin

2. **Teste de Registro:**
   - Teste criação de nova conta de parceiro
   - Verifique se aparecem no dashboard do Supabase

## 🆘 Troubleshooting

### ❌ "Email ou senha incorretos"
- Verificar se o usuário foi criado no Authentication
- Verificar se o email está confirmado
- Tentar reset de senha

### ❌ "Erro de permissão"
- Verificar se as políticas RLS foram aplicadas
- Verificar se o perfil foi criado na tabela `users`
- Verificar se o `role` está correto

### ❌ "Variáveis de ambiente"
- No Vercel, verificar se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão definidas
- Fazer redeploy após alterar variáveis

## 📝 Status das Configurações

- [ ] Migração aplicada no Supabase
- [ ] Admin felipe@pedireitoimoveis.com.br criado
- [ ] Admin contato@pedireitoimoveis.com.br criado
- [ ] Teste de login local ✅
- [ ] Teste de registro de parceiro ✅
- [ ] Deploy no Vercel ✅
- [ ] Teste em produção ✅

---

## 🎯 Resultado Esperado

Após completar todos os passos:

1. ✅ **Administradores** podem fazer login com seus emails @pedireitoimoveis.com.br
2. ✅ **Parceiros** podem se registrar normalmente via `/register`
3. ✅ **Permissões** funcionando corretamente (admin vs partner)
4. ✅ **Sistema** funcionando em produção no Vercel

**Emails de Admin Configurados:**
- felipe@pedireitoimoveis.com.br
- contato@pedireitoimoveis.com.br 