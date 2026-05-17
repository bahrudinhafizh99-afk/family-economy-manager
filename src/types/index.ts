export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: TransactionType;
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface AppState {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingGoal[];
}
