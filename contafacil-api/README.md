# ContaFácil API

API backend para o sistema ContaFácil de controle financeiro pessoal, construída com Node.js, Express e Supabase.

## Tecnologias

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **TypeScript**: Superset tipado de JavaScript
- **Supabase**: Alternativa open-source ao Firebase, fornecendo banco de dados PostgreSQL, autenticação e armazenamento
- **Winston**: Sistema de logging
- **Helmet**: Middleware de segurança para Express
- **Cors**: Middleware para habilitar CORS
- **Dotenv**: Carregamento de variáveis de ambiente

## Estrutura do Projeto

```
contafacil-api/
├── src/
│   ├── config/         # Configurações (Supabase, etc)
│   ├── controllers/    # Controladores das rotas
│   ├── middlewares/    # Middlewares Express
│   ├── models/         # Modelos de dados
│   ├── routes/         # Definições de rotas
│   ├── services/       # Lógica de negócios
│   ├── types/          # Definições de tipos TypeScript
│   ├── utils/          # Utilitários
│   └── index.ts        # Ponto de entrada da aplicação
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração do TypeScript
```

## Configuração do Banco de Dados

Este projeto utiliza o Supabase como banco de dados. É necessário criar um projeto no Supabase e configurar as tabelas conforme o esquema definido no arquivo `supabase/schema.sql`.

## Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente:
   ```
   cp .env.example .env
   ```
4. Configure seu projeto Supabase e atualize as variáveis `SUPABASE_URL` e `SUPABASE_KEY` no arquivo `.env`
5. Execute o script de configuração do banco de dados:
   ```
   npm run setup-db
   ```

## Desenvolvimento

Para iniciar o servidor em modo de desenvolvimento:

```
npm run dev
```

## Build e Produção

Para compilar o projeto:

```
npm run build
```

Para iniciar o servidor em produção:

```
npm start
```

## API Endpoints

### Contas
- `GET /api/accounts` - Listar todas as contas
- `GET /api/accounts/:id` - Obter detalhes de uma conta
- `POST /api/accounts` - Criar uma nova conta
- `PUT /api/accounts/:id` - Atualizar uma conta
- `DELETE /api/accounts/:id` - Excluir uma conta

### Transações
- `GET /api/transactions` - Listar todas as transações
- `GET /api/transactions/:id` - Obter detalhes de uma transação
- `POST /api/transactions` - Criar uma nova transação
- `PUT /api/transactions/:id` - Atualizar uma transação
- `DELETE /api/transactions/:id` - Excluir uma transação

### Orçamentos
- `GET /api/budgets` - Listar todos os orçamentos
- `GET /api/budgets/:id` - Obter detalhes de um orçamento
- `POST /api/budgets` - Criar um novo orçamento
- `PUT /api/budgets/:id` - Atualizar um orçamento
- `DELETE /api/budgets/:id` - Excluir um orçamento

### Metas Financeiras
- `GET /api/goals` - Listar todas as metas
- `GET /api/goals/:id` - Obter detalhes de uma meta
- `POST /api/goals` - Criar uma nova meta
- `PUT /api/goals/:id` - Atualizar uma meta
- `DELETE /api/goals/:id` - Excluir uma meta

### Relatórios
- `GET /api/reports` - Listar todos os relatórios
- `GET /api/reports/:id` - Obter detalhes de um relatório
- `POST /api/reports` - Criar um novo relatório
- `PUT /api/reports/:id` - Atualizar um relatório
- `DELETE /api/reports/:id` - Excluir um relatório

### Usuários
- `GET /api/users/me` - Obter perfil do usuário
- `PUT /api/users/me` - Atualizar perfil do usuário
- `PUT /api/users/me/preferences` - Atualizar preferências do usuário
