-- Schema para o banco de dados do ContaFácil no Supabase

-- Tabela de usuários (complementa a tabela auth.users do Supabase)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  preferences JSONB DEFAULT '{"currency": "BRL", "theme": "LIGHT", "language": "pt-BR"}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ASSET', 'LIABILITY', 'EQUITY', 'INCOME', 'EXPENSE')),
  parent_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INCOME', 'EXPENSE', 'TRANSFER')),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  destination_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  payment_method TEXT,
  status TEXT NOT NULL CHECK (status IN ('PENDING', 'COMPLETED', 'CANCELED')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de orçamento
CREATE TABLE IF NOT EXISTS budget_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  planned DECIMAL(12, 2) NOT NULL,
  actual DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de metas financeiras
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  target_amount DECIMAL(12, 2) NOT NULL,
  current_amount DECIMAL(12, 2) DEFAULT 0,
  deadline DATE,
  priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de relatórios financeiros
CREATE TABLE IF NOT EXISTS financial_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('INCOME_STATEMENT', 'BALANCE_SHEET', 'CASH_FLOW')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  data JSONB NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_reports ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY users_policy ON users
  USING (id = auth.uid());

-- Políticas para contas
CREATE POLICY accounts_select_policy ON accounts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY accounts_insert_policy ON accounts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY accounts_update_policy ON accounts FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY accounts_delete_policy ON accounts FOR DELETE
  USING (user_id = auth.uid());

-- Políticas para transações
CREATE POLICY transactions_select_policy ON transactions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY transactions_insert_policy ON transactions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY transactions_update_policy ON transactions FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY transactions_delete_policy ON transactions FOR DELETE
  USING (user_id = auth.uid());

-- Políticas para orçamentos
CREATE POLICY budgets_select_policy ON budgets FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY budgets_insert_policy ON budgets FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY budgets_update_policy ON budgets FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY budgets_delete_policy ON budgets FOR DELETE
  USING (user_id = auth.uid());

-- Políticas para categorias de orçamento (via join com budgets)
CREATE POLICY budget_categories_select_policy ON budget_categories FOR SELECT
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

CREATE POLICY budget_categories_insert_policy ON budget_categories FOR INSERT
  WITH CHECK (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

CREATE POLICY budget_categories_update_policy ON budget_categories FOR UPDATE
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()))
  WITH CHECK (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

CREATE POLICY budget_categories_delete_policy ON budget_categories FOR DELETE
  USING (budget_id IN (SELECT id FROM budgets WHERE user_id = auth.uid()));

-- Políticas para metas financeiras
CREATE POLICY financial_goals_select_policy ON financial_goals FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY financial_goals_insert_policy ON financial_goals FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY financial_goals_update_policy ON financial_goals FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY financial_goals_delete_policy ON financial_goals FOR DELETE
  USING (user_id = auth.uid());

-- Políticas para relatórios financeiros
CREATE POLICY financial_reports_select_policy ON financial_reports FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY financial_reports_insert_policy ON financial_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY financial_reports_update_policy ON financial_reports FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY financial_reports_delete_policy ON financial_reports FOR DELETE
  USING (user_id = auth.uid());

-- Índices para melhorar a performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX idx_financial_goals_user_id ON financial_goals(user_id);
CREATE INDEX idx_financial_reports_user_id ON financial_reports(user_id);
