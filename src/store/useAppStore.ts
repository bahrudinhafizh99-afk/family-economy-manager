import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, SavingGoal, AppState } from '../types';

interface AppStore extends AppState {
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, limit: number) => void;
  addGoal: (goal: Omit<SavingGoal, 'id'>) => void;
  updateGoalAmount: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
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

      addTransaction: (transaction) => set((state) => {
        const newTransaction = { ...transaction, id: Math.random().toString(36).substring(2, 9) };
        const updatedTransactions = [newTransaction, ...state.transactions];
        
        // Update budget spent amount if it's an expense
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
        
        // Update budget spent amount if it was an expense
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
      }))
    }),
    {
      name: 'family-economy-storage',
    }
  )
);
