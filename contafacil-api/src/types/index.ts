export interface Account {
  id: string;
  name: string;
  type: 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
  parentId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  name: string;
  planned: number;
  actual: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialReport {
  id: string;
  name: string;
  type: 'INCOME_STATEMENT' | 'BALANCE_SHEET' | 'CASH_FLOW';
  startDate: string;
  endDate: string;
  data: any;
  userId: string;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  status: 'success' | 'error';
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
}
