export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  type: TransactionType;
}

export interface BudgetCategory {
  category: string;
  limit: number;
  spent: number;
}

export interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

export type DebtType = 'to_pay' | 'to_receive';

export interface Debt {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  type: DebtType;
  status: 'active' | 'paid';
}

export type RecurrenceFrequency = 'monthly' | 'weekly' | 'yearly';

export interface RecurringTransaction {
  id: string;
  title: string;
  amount: number;
  category: string;
  type: TransactionType;
  frequency: RecurrenceFrequency;
  startDate: string;
  lastprocessed?: string;
  isActive: boolean;
}

export interface AppSettings {
  language: 'id' | 'en';
  currency: 'IDR' | 'USD';
  theme: 'soft' | 'dark' | 'nature';
}

export interface UserProfile {
  id: string;
  email: string;
}

export interface AppState {
  user: UserProfile | null;
  transactions: Transaction[];
  budgets: BudgetCategory[];
  goals: SavingGoal[];
  debts: Debt[];
  recurringTransactions: RecurringTransaction[];
  settings: AppSettings;
}
