import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface Budget {
  category: string;
  amount: number;
  spent: number;
}

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  theme: 'light' | 'dark';
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setBudget: (category: string, amount: number) => void;
  toggleTheme: () => void;
  getMonthlyStats: (month: string) => {
    totalIncome: number;
    totalExpenses: number;
    savings: number;
    categoryBreakdown: Record<string, number>;
  };
}

// Mock initial data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    category: 'Salary',
    description: 'Monthly salary',
    date: '2024-01-01'
  },
  {
    id: '2',
    type: 'expense',
    amount: 1200,
    category: 'Rent',
    description: 'Monthly rent payment',
    date: '2024-01-02'
  },
  {
    id: '3',
    type: 'expense',
    amount: 350,
    category: 'Food',
    description: 'Groceries and dining',
    date: '2024-01-03'
  },
  {
    id: '4',
    type: 'expense',
    amount: 150,
    category: 'Transportation',
    description: 'Gas and public transport',
    date: '2024-01-04'
  },
  {
    id: '5',
    type: 'expense',
    amount: 85,
    category: 'Entertainment',
    description: 'Movies and subscriptions',
    date: '2024-01-05'
  }
];

const mockBudgets: Budget[] = [
  { category: 'Food', amount: 500, spent: 350 },
  { category: 'Transportation', amount: 200, spent: 150 },
  { category: 'Entertainment', amount: 150, spent: 85 },
  { category: 'Shopping', amount: 300, spent: 0 },
  { category: 'Bills', amount: 800, spent: 0 }
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      budgets: mockBudgets,
      theme: 'light',
      
      addTransaction: (transaction) => {
        const newTransaction = {
          ...transaction,
          id: Date.now().toString()
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }));
        
        // Update budget spent amount
        const { budgets } = get();
        const budgetIndex = budgets.findIndex(b => b.category === transaction.category);
        if (budgetIndex !== -1 && transaction.type === 'expense') {
          const updatedBudgets = [...budgets];
          updatedBudgets[budgetIndex].spent += transaction.amount;
          set({ budgets: updatedBudgets });
        }
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
      },
      
      setBudget: (category, amount) => {
        set((state) => {
          const existingBudgetIndex = state.budgets.findIndex(b => b.category === category);
          let updatedBudgets;
          
          if (existingBudgetIndex !== -1) {
            updatedBudgets = [...state.budgets];
            updatedBudgets[existingBudgetIndex].amount = amount;
          } else {
            updatedBudgets = [...state.budgets, { category, amount, spent: 0 }];
          }
          
          return { budgets: updatedBudgets };
        });
      },
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light'
        }));
      },
      
      getMonthlyStats: (month) => {
        const { transactions } = get();
        const monthTransactions = transactions.filter(t => 
          t.date.startsWith(month)
        );
        
        const totalIncome = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const totalExpenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
          
        const categoryBreakdown = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
          }, {} as Record<string, number>);
        
        return {
          totalIncome,
          totalExpenses,
          savings: totalIncome - totalExpenses,
          categoryBreakdown
        };
      }
    }),
    {
      name: 'finguard-storage'
    }
  )
);