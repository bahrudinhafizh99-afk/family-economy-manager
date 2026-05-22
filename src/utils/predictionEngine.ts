import type { AppState } from '../types';

export interface PredictionResult {
  goalId: string;
  monthsRemaining: number | 'infinite';
  estimatedDate: string | null;
  monthlySurplus: number;
}

export const calculateSavingsPrediction = (state: AppState): PredictionResult[] => {
  const { transactions, goals } = state;
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 1. Calculate current monthly surplus
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const surplus = income - expense;

  return goals.map(goal => {
    const remaining = goal.targetAmount - goal.currentAmount;
    
    if (remaining <= 0) {
      return { goalId: goal.id, monthsRemaining: 0, estimatedDate: 'Selesai', monthlySurplus: surplus };
    }

    if (surplus <= 0) {
      return { goalId: goal.id, monthsRemaining: 'infinite', estimatedDate: null, monthlySurplus: surplus };
    }

    // Basic prediction: Assume all surplus goes to this goal (simplistic but helpful)
    // Or we can assume surplus is distributed? Let's assume user focuses on one or distribute?
    // Most users want to know "if I save like this month, when will it finish?"
    const months = Math.ceil(remaining / surplus);
    const estDate = new Date();
    estDate.setMonth(estDate.getMonth() + months);

    return {
      goalId: goal.id,
      monthsRemaining: months,
      estimatedDate: estDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      monthlySurplus: surplus
    };
  });
};
