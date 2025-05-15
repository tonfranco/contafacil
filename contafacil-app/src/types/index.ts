export interface Account {
  id: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  parentId?: string;
  children?: Account[];
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  accountId: string;
  destinationAccountId?: string;
  category: string;
  tags?: string[];
  paymentMethod?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELED';
}

export interface Budget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  actual: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW';
  startDate: string;
  endDate: string;
  data: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: {
    currency: string;
    theme: 'LIGHT' | 'DARK';
    language: string;
  };
}
