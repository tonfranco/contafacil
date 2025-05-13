import { Account, Transaction, Budget, FinancialGoal, FinancialReport } from '../types';

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Ativos',
    type: 'ASSET',
    children: [
      {
        id: '1.1',
        name: 'Conta Corrente',
        type: 'ASSET',
        parentId: '1'
      },
      {
        id: '1.2',
        name: 'Poupança', 
        type: 'ASSET',
        parentId: '1'
      },
      {
        id: '1.3',
        name: 'Investimentos',
        type: 'ASSET',
        parentId: '1',
        children: [
          {
            id: '1.3.1',
            name: 'Renda Fixa',
            type: 'ASSET',
            parentId: '1.3'
          },
          {
            id: '1.3.2',
            name: 'Renda Variável',
            type: 'ASSET',
            parentId: '1.3'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Passivos',
    type: 'LIABILITY',
    children: [
      {
        id: '2.1',
        name: 'Cartão de Crédito',
        type: 'LIABILITY',
        parentId: '2'
      },
      {
        id: '2.2',
        name: 'Empréstimos',
        type: 'LIABILITY',
        parentId: '2'
      }
    ]
  },
  {
    id: '3',
    name: 'Receitas',
    type: 'INCOME',
    children: [
      {
        id: '3.1',
        name: 'Salário',
        type: 'INCOME',
        parentId: '3'
      },
      {
        id: '3.2',
        name: 'Investimentos',
        type: 'INCOME',
        parentId: '3'
      },
      {
        id: '3.3',
        name: 'Outras Receitas',
        type: 'INCOME',
        parentId: '3'
      }
    ]
  },
  {
    id: '4',
    name: 'Despesas',
    type: 'EXPENSE',
    children: [
      {
        id: '4.1',
        name: 'Moradia',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.1.1',
            name: 'Aluguel',
            type: 'EXPENSE',
            parentId: '4.1'
          },
          {
            id: '4.1.2',
            name: 'Condomínio',
            type: 'EXPENSE',
            parentId: '4.1'
          },
          {
            id: '4.1.3',
            name: 'Água',
            type: 'EXPENSE',
            parentId: '4.1'
          },
          {
            id: '4.1.4',
            name: 'Luz',
            type: 'EXPENSE',
            parentId: '4.1'
          },
          {
            id: '4.1.5',
            name: 'Internet',
            type: 'EXPENSE',
            parentId: '4.1'
          }
        ]
      },
      {
        id: '4.2',
        name: 'Alimentação',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.2.1',
            name: 'Supermercado',
            type: 'EXPENSE',
            parentId: '4.2'
          },
          {
            id: '4.2.2',
            name: 'Restaurantes',
            type: 'EXPENSE',
            parentId: '4.2'
          }
        ]
      },
      {
        id: '4.3',
        name: 'Transporte',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.3.1',
            name: 'Combustível',
            type: 'EXPENSE',
            parentId: '4.3'
          },
          {
            id: '4.3.2',
            name: 'Transporte Público',
            type: 'EXPENSE',
            parentId: '4.3'
          },
          {
            id: '4.3.3',
            name: 'Manutenção',
            type: 'EXPENSE',
            parentId: '4.3'
          }
        ]
      },
      {
        id: '4.4',
        name: 'Saúde',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.4.1',
            name: 'Plano de Saúde',
            type: 'EXPENSE',
            parentId: '4.4'
          },
          {
            id: '4.4.2',
            name: 'Medicamentos',
            type: 'EXPENSE',
            parentId: '4.4'
          },
          {
            id: '4.4.3',
            name: 'Consultas',
            type: 'EXPENSE',
            parentId: '4.4'
          }
        ]
      },
      {
        id: '4.5',
        name: 'Educação',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.5.1',
            name: 'Mensalidades',
            type: 'EXPENSE',
            parentId: '4.5'
          },
          {
            id: '4.5.2',
            name: 'Cursos',
            type: 'EXPENSE',
            parentId: '4.5'
          },
          {
            id: '4.5.3',
            name: 'Materiais',
            type: 'EXPENSE',
            parentId: '4.5'
          }
        ]
      },
      {
        id: '4.6',
        name: 'Lazer',
        type: 'EXPENSE',
        parentId: '4',
        children: [
          {
            id: '4.6.1',
            name: 'Viagens',
            type: 'EXPENSE',
            parentId: '4.6'
          },
          {
            id: '4.6.2',
            name: 'Restaurantes',
            type: 'EXPENSE',
            parentId: '4.6'
          },
          {
            id: '4.6.3',
            name: 'Entretenimento',
            type: 'EXPENSE',
            parentId: '4.6'
          }
        ]
      }
    ]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-05-01',
    description: 'Salário',
    amount: 5000,
    type: 'INCOME',
    accountId: '1.1',
    category: 'Salário',
    status: 'COMPLETED'
  },
  {
    id: '2',
    date: '2025-05-05',
    description: 'Aluguel',
    amount: 1500,
    type: 'EXPENSE',
    accountId: '1.1',
    category: 'Moradia',
    status: 'COMPLETED'
  },
  {
    id: '3',
    date: '2025-05-08',
    description: 'Supermercado',
    amount: 600,
    type: 'EXPENSE',
    accountId: '1.1',
    category: 'Alimentação',
    status: 'COMPLETED'
  },
  {
    id: '4',
    date: '2025-05-10',
    description: 'Transferência para Poupança',
    amount: 1000,
    type: 'TRANSFER',
    accountId: '1.1',
    destinationAccountId: '1.2',
    category: 'Transferência',
    status: 'COMPLETED'
  },
  {
    id: '5',
    date: '2025-05-15',
    description: 'Fatura Cartão de Crédito',
    amount: 1200,
    type: 'EXPENSE',
    accountId: '1.1',
    category: 'Cartão de Crédito',
    status: 'COMPLETED'
  },
  {
    id: '6',
    date: '2025-05-20',
    description: 'Restaurante',
    amount: 150,
    type: 'EXPENSE',
    accountId: '2.1',
    category: 'Alimentação',
    status: 'COMPLETED'
  },
  {
    id: '7',
    date: '2025-05-25',
    description: 'Combustível',
    amount: 200,
    type: 'EXPENSE',
    accountId: '2.1',
    category: 'Transporte',
    status: 'COMPLETED'
  },
  {
    id: '8',
    date: '2025-05-28',
    description: 'Rendimento Poupança',
    amount: 50,
    type: 'INCOME',
    accountId: '1.2',
    category: 'Investimentos',
    status: 'COMPLETED'
  }
];

export const mockBudget: Budget = {
  id: '1',
  name: 'Orçamento Maio 2025',
  startDate: '2025-05-01',
  endDate: '2025-05-31',
  categories: [
    {
      id: '1',
      name: 'Moradia',
      planned: 1800,
      actual: 1500
    },
    {
      id: '2',
      name: 'Alimentação',
      planned: 1000,
      actual: 750
    },
    {
      id: '3',
      name: 'Transporte',
      planned: 500,
      actual: 200
    },
    {
      id: '4',
      name: 'Saúde',
      planned: 400,
      actual: 0
    },
    {
      id: '5',
      name: 'Educação',
      planned: 300,
      actual: 300
    },
    {
      id: '6',
      name: 'Lazer',
      planned: 500,
      actual: 150
    }
  ]
};

export const mockFinancialGoals: FinancialGoal[] = [
  {
    id: '1',
    name: 'Fundo de Emergência',
    targetAmount: 20000,
    currentAmount: 10000,
    deadline: '2025-12-31',
    priority: 'HIGH'
  },
  {
    id: '2',
    name: 'Viagem de Férias',
    targetAmount: 8000,
    currentAmount: 3000,
    deadline: '2025-07-31',
    priority: 'MEDIUM'
  },
  {
    id: '3',
    name: 'Compra de Carro',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: '2026-12-31',
    priority: 'LOW'
  }
];

export const mockFinancialReports: FinancialReport[] = [
  {
    id: '1',
    name: 'DRE Maio 2025',
    type: 'INCOME_STATEMENT',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    data: {
      income: {
        total: 5050,
        categories: {
          'Salário': 5000,
          'Investimentos': 50
        }
      },
      expenses: {
        total: 3650,
        categories: {
          'Moradia': 1500,
          'Alimentação': 750,
          'Transporte': 200,
          'Cartão de Crédito': 1200
        }
      },
      netIncome: 1400
    }
  },
  {
    id: '2',
    name: 'Balanço Maio 2025',
    type: 'BALANCE_SHEET',
    startDate: '2025-05-01',
    endDate: '2025-05-31',
    data: {
      assets: {
        total: 15000,
        categories: {
          'Conta Corrente': 2350,
          'Poupança': 11050,
          'Investimentos': 1600
        }
      },
      liabilities: {
        total: 2000,
        categories: {
          'Cartão de Crédito': 0,
          'Empréstimos': 2000
        }
      },
      equity: 13000
    }
  }
];

export const mockMonthlyData = [
  { month: 'Jan', receitas: 4800, despesas: 3500 },
  { month: 'Fev', receitas: 4900, despesas: 3600 },
  { month: 'Mar', receitas: 5000, despesas: 3700 },
  { month: 'Abr', receitas: 5100, despesas: 3800 },
  { month: 'Mai', receitas: 5050, despesas: 3650 },
  { month: 'Jun', receitas: 0, despesas: 0 },
  { month: 'Jul', receitas: 0, despesas: 0 },
  { month: 'Ago', receitas: 0, despesas: 0 },
  { month: 'Set', receitas: 0, despesas: 0 },
  { month: 'Out', receitas: 0, despesas: 0 },
  { month: 'Nov', receitas: 0, despesas: 0 },
  { month: 'Dez', receitas: 0, despesas: 0 },
];
