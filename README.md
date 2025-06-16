# Pé Direito Indicações

Sistema de indicações imobiliárias com ranking, pontuação e recompensas.

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Banco de dados, Autenticação e Storage)
- Chart.js e Recharts para gráficos
- React Router para navegação
- Lucide React para ícones

## Requisitos

- Node.js 18+
- NPM ou Yarn
- Conta no Supabase

## Configuração do Ambiente

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Copie o arquivo `.env.example` para `.env` e configure as variáveis:
```bash
cp .env.example .env
```

4. Configure as variáveis do Supabase no arquivo `.env`:
```bash
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## Desenvolvimento Local

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

2. Acesse http://localhost:3000 no navegador

## Deploy no Vercel

1. Crie uma conta no Vercel (https://vercel.com)
2. Instale a CLI do Vercel:
```bash
npm i -g vercel
```

3. Faça login na sua conta:
```bash
vercel login
```

4. Deploy do projeto:
```bash
vercel
```

5. Configure as variáveis de ambiente no dashboard do Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_APP_NAME
- VITE_APP_URL

## Deploy no Railway

1. Crie uma conta no Railway (https://railway.app)
2. Instale a CLI do Railway:
```bash
npm i -g @railway/cli
```

3. Faça login:
```bash
railway login
```

4. Inicie um novo projeto:
```bash
railway init
```

5. Deploy do projeto:
```bash
railway up
```

6. Configure as variáveis de ambiente no dashboard do Railway:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_APP_NAME
- VITE_APP_URL

## Estrutura do Banco de Dados

O sistema utiliza o Supabase como banco de dados e possui as seguintes tabelas:

### Users
- Estende a tabela auth.users do Supabase
- Armazena informações adicionais dos usuários
- Tipos de usuário: admin e partner

### Indicações
- Registra todas as indicações feitas pelos parceiros
- Status: pendente, em_analise, aprovada, fechada, cancelada
- Tipos: venda e locação
- Sistema automático de pontuação

### Ranking
- Ranking mensal dos parceiros
- Atualizado automaticamente via triggers
- Contabiliza vendas, locações e pontos totais

### Recompensas
- Catálogo de recompensas disponíveis
- Tipos: produto, serviço, bonus
- Pontuação necessária para resgate

### Resgates
- Registro dos resgates de recompensas
- Status: pendente, aprovado, rejeitado, entregue

## Segurança

O sistema utiliza Row Level Security (RLS) do Supabase para garantir:

- Usuários só podem ver e editar seus próprios dados
- Admins têm acesso total ao sistema
- Ranking é visível para todos os usuários autenticados
- Recompensas disponíveis são visíveis para todos os usuários autenticados

## Funcionalidades Principais

1. Dashboard Administrativo
- Visão geral do sistema
- Gráficos e estatísticas
- Gestão de usuários e indicações

2. Área do Parceiro
- Cadastro de indicações
- Acompanhamento do ranking
- Resgate de recompensas

3. Sistema de Pontuação
- Indicação de Venda: 15 pontos
- Indicação de Locação: 10 pontos
- Venda Fechada: +30 pontos
- Locação Fechada: +20 pontos

4. Ranking e Recompensas
- Ranking mensal automático
- Sistema de recompensas por pontuação
- Histórico de resgates

## Suporte

Para suporte ou dúvidas, abra uma issue no repositório. 