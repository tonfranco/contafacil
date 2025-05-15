import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Account, 
  Transaction, 
  Budget, 
  FinancialGoal, 
  FinancialReport 
} from '../types';
import { 
  mockAccounts, 
  mockTransactions, 
  mockBudget, 
  mockFinancialGoals, 
  mockFinancialReports,
  mockMonthlyData
} from '../mocks/data';

interface AppContextType {
  accounts: Account[];
  transactions: Transaction[];
  budget: Budget;
  financialGoals: FinancialGoal[];
  financialReports: FinancialReport[];
  monthlyData: any[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (account: Account) => void;
  deleteAccount: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id'>) => void;
  updateFinancialGoal: (goal: FinancialGoal) => void;
  deleteFinancialGoal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [budget, setBudget] = useState<Budget>(mockBudget);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(mockFinancialGoals);
  const [financialReports, setFinancialReports] = useState<FinancialReport[]>(mockFinancialReports);
  const [monthlyData, setMonthlyData] = useState(mockMonthlyData);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (transaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transaction.id ? transaction : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const addAccount = (account: Omit<Account, 'id'>) => {
    const newAccount = {
      ...account,
      id: Date.now().toString(),
    };
    setAccounts(prev => [...prev, newAccount]);
  };

  const updateAccount = (account: Account) => {
    setAccounts(prev => 
      prev.map(a => a.id === account.id ? account : a)
    );
  };

  const deleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudget(updatedBudget);
  };

  const addFinancialGoal = (goal: Omit<FinancialGoal, 'id'>) => {
    const newGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setFinancialGoals(prev => [...prev, newGoal]);
  };

  const updateFinancialGoal = (goal: FinancialGoal) => {
    setFinancialGoals(prev => 
      prev.map(g => g.id === goal.id ? goal : g)
    );
  };

  const deleteFinancialGoal = (id: string) => {
    setFinancialGoals(prev => prev.filter(g => g.id !== id));
  };

  const value = {
    accounts,
    transactions,
    budget,
    financialGoals,
    financialReports,
    monthlyData,
    theme,
    toggleTheme,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addAccount,
    updateAccount,
    deleteAccount,
    updateBudget,
    addFinancialGoal,
    updateFinancialGoal,
    deleteFinancialGoal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
