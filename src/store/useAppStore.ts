import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, SavingGoal, AppState, Debt } from '../types';

interface AppStore extends AppState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, limit: number) => void;
  addBudget: (category: string, limit: number) => void;
  deleteBudget: (category: string) => void;
  addGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  updateGoalAmount: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  addDebt: (debt: Omit<Debt, 'id'>) => void;
  deleteDebt: (id: string) => void;
  toggleDebtStatus: (id: string) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [
        { category: 'Makan', limit: 2000000, spent: 0 },
        { category: 'Tagihan', limit: 1000000, spent: 0 },
        { category: 'Transportasi', limit: 500000, spent: 0 },
        { category: 'Hiburan', limit: 300000, spent: 0 },
      ],
      goals: [],
      debts: [],
      settings: {
        language: 'id',
        currency: 'IDR',
        theme: 'soft'
      },

      addTransaction: (transaction) => set((state) => {
        const newTransaction = { ...transaction, id: Math.random().toString(36).substring(2, 9) };
        const updatedTransactions = [newTransaction, ...state.transactions];
        
        let updatedBudgets = state.budgets;
        if (transaction.type === 'expense') {
          updatedBudgets = state.budgets.map(b => 
            b.category === transaction.category 
              ? { ...b, spent: b.spent + transaction.amount } 
              : b
          );
        }

        return { 
          transactions: updatedTransactions,
          budgets: updatedBudgets
        };
      }),

      deleteTransaction: (id) => set((state) => {
        const transaction = state.transactions.find(t => t.id === id);
        if (!transaction) return state;

        const updatedTransactions = state.transactions.filter(t => t.id !== id);
        
        let updatedBudgets = state.budgets;
        if (transaction.type === 'expense') {
          updatedBudgets = state.budgets.map(b => 
            b.category === transaction.category 
              ? { ...b, spent: Math.max(0, b.spent - transaction.amount) } 
              : b
          );
        }

        return { 
          transactions: updatedTransactions,
          budgets: updatedBudgets
        };
      }),

      updateBudget: (category, limit) => set((state) => ({
        budgets: state.budgets.map(b => 
          b.category === category ? { ...b, limit } : b
        )
      })),

      addBudget: (category, limit) => set((state) => ({
        budgets: [...state.budgets, { category, limit, spent: 0 }]
      })),

      deleteBudget: (category) => set((state) => ({
        budgets: state.budgets.filter(b => b.category !== category)
      })),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: Math.random().toString(36).substring(2, 9) }]
      })),

      updateGoalAmount: (id, amount) => set((state) => ({
        goals: state.goals.map(g => 
          g.id === id ? { ...g, currentAmount: amount } : g
        )
      })),

      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(g => g.id !== id)
      })),

      addDebt: (debt) => set((state) => ({
        debts: [...state.debts, { ...debt, id: Math.random().toString(36).substring(2, 9) }]
      })),

      deleteDebt: (id) => set((state) => ({
        debts: state.debts.filter(d => d.id !== id)
      })),

      toggleDebtStatus: (id) => set((state) => ({
        debts: state.debts.map(d => 
          d.id === id ? { ...d, status: d.status === 'active' ? 'paid' : 'active' } : d
        )
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      resetData: () => set(() => ({
        transactions: [],
        goals: [],
        debts: [],
        budgets: [
          { category: 'Makan', limit: 2000000, spent: 0 },
          { category: 'Tagihan', limit: 1000000, spent: 0 },
          { category: 'Transportasi', limit: 500000, spent: 0 },
          { category: 'Hiburan', limit: 300000, spent: 0 },
        ],
      }))
    }),
    {
      name: 'family-economy-storage',
    }
  )
);
