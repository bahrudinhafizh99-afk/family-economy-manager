import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, SavingGoal, AppState, Debt, RecurringTransaction, UserProfile } from '../types';

interface AppStore extends AppState {
  setUser: (user: UserProfile | null) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
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
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id' | 'isActive'>) => void;
  deleteRecurringTransaction: (id: string) => void;
  toggleRecurringActive: (id: string) => void;
  processRecurringTransactions: () => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  resetData: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      user: null,
      transactions: [],
      budgets: [
        { category: 'Makan', limit: 2000000, spent: 0 },
        { category: 'Tagihan', limit: 1000000, spent: 0 },
        { category: 'Transportasi', limit: 500000, spent: 0 },
        { category: 'Hiburan', limit: 300000, spent: 0 },
      ],
      goals: [],
      debts: [],
      recurringTransactions: [],
      settings: {
        language: 'id',
        currency: 'IDR',
        theme: 'soft'
      },

      addTransaction: (transaction) => set((state) => {
        const newTransaction = { ...transaction, id: crypto.randomUUID() };
        const updatedTransactions = [newTransaction, ...state.transactions];
        
        return { 
          transactions: updatedTransactions
        };
      }),

      updateTransaction: (id, updatedFields) => set((state) => {
        const index = state.transactions.findIndex(t => t.id === id);
        if (index === -1) return state;

        const updatedTransaction = { ...state.transactions[index], ...updatedFields };
        const updatedTransactions = [...state.transactions];
        updatedTransactions[index] = updatedTransaction;

        return { 
          transactions: updatedTransactions
        };
      }),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      updateBudget: (category, limit) => set((state) => ({
        budgets: state.budgets.map(b => 
          b.category === category ? { ...b, limit } : b
        )
      })),

      addBudget: (category, limit) => set((state) => {
        if (state.budgets.some(b => b.category.toLowerCase() === category.toLowerCase())) {
          return state;
        }
        return {
          budgets: [...state.budgets, { category, limit, spent: 0 }]
        };
      }),

      deleteBudget: (category) => set((state) => ({
        budgets: state.budgets.filter(b => b.category !== category)
      })),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, { ...goal, id: crypto.randomUUID() }]
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
        debts: [...state.debts, { ...debt, id: crypto.randomUUID() }]
      })),

      deleteDebt: (id) => set((state) => ({
        debts: state.debts.filter(d => d.id !== id)
      })),

      toggleDebtStatus: (id) => set((state) => ({
        debts: state.debts.map(d => 
          d.id === id ? { ...d, status: d.status === 'active' ? 'paid' : 'active' } : d
        )
      })),

      addRecurringTransaction: (recurring) => set((state) => ({
        recurringTransactions: [...state.recurringTransactions, { 
          ...recurring, 
          id: crypto.randomUUID(),
          isActive: true 
        }]
      })),

      deleteRecurringTransaction: (id) => set((state) => ({
        recurringTransactions: state.recurringTransactions.filter(r => r.id !== id)
      })),

      toggleRecurringActive: (id) => set((state) => ({
        recurringTransactions: state.recurringTransactions.map(r => 
          r.id === id ? { ...r, isActive: !r.isActive } : r
        )
      })),

      setUser: (user) => set({ user }),

      processRecurringTransactions: () => {
        const { recurringTransactions, addTransaction } = get();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        recurringTransactions.forEach(rt => {
          if (!rt.isActive) return;

          let lastProcessed = rt.lastprocessed ? new Date(rt.lastprocessed) : new Date(rt.startDate);
          let nextDate = new Date(lastProcessed);

          // Loop to handle multiple missed periods (e.g. weekly app opened after 3 weeks)
          while (true) {
            let potentialNext = new Date(nextDate);
            if (rt.frequency === 'monthly') potentialNext.setMonth(potentialNext.getMonth() + 1);
            else if (rt.frequency === 'weekly') potentialNext.setDate(potentialNext.getDate() + 7);
            else if (rt.frequency === 'yearly') potentialNext.setFullYear(potentialNext.getFullYear() + 1);

            if (potentialNext <= today) {
              nextDate = potentialNext;
              addTransaction({
                amount: rt.amount,
                category: rt.category,
                description: `${rt.title} (Auto)`,
                date: nextDate.toISOString(),
                type: rt.type
              });

              set((state) => ({
                recurringTransactions: state.recurringTransactions.map(r => 
                  r.id === rt.id ? { ...r, lastprocessed: nextDate.toISOString() } : r
                )
              }));
            } else {
              break;
            }
          }
        });
      },

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      resetData: () => set(() => ({
        transactions: [],
        goals: [],
        debts: [],
        recurringTransactions: [],
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
