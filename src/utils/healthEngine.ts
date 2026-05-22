import type { AppState } from '../types';

export interface HealthReport {
  score: number;
  status: 'Sehat' | 'Waspada' | 'Bahaya';
  color: string;
  tips: string[];
  metrics: {
    savingsRatio: number;
    budgetAdherence: number;
    debtLoad: number;
  };
}

export const calculateFinancialHealth = (state: AppState): HealthReport => {
  const { transactions, budgets, debts } = state;
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // 1. Get Monthly Data
  const monthlyTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expense = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  
  // METRIC 1: SAVINGS RATIO (Target: > 20% of income)
  // We count actual savings or surplus as potential savings
  const surplus = Math.max(0, income - expense);
  const savingsRatio = income > 0 ? (surplus / income) * 100 : 0;
  let savingsScore = Math.min(100, (savingsRatio / 20) * 100);

  // METRIC 2: BUDGET ADHERENCE
  const budgetsWithSpent = budgets.map(b => {
    const spent = monthlyTransactions
      .filter(t => t.category === b.category && t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return { ...b, spent };
  });

  const budgetsExceeded = budgetsWithSpent.filter(b => b.spent > b.limit).length;
  const totalBudgets = budgets.length;
  const budgetAdherence = totalBudgets > 0 ? ((totalBudgets - budgetsExceeded) / totalBudgets) * 100 : 100;
  
  // METRIC 3: DEBT LOAD
  const activeDebts = debts.filter(d => d.status === 'active' && d.type === 'to_pay');
  const totalDebtAmount = activeDebts.reduce((sum, d) => sum + d.amount, 0);
  // Healthy if total debt < 30% of monthly income
  const debtToIncome = income > 0 ? (totalDebtAmount / income) : (totalDebtAmount > 0 ? 1 : 0);
  const debtScore = Math.max(0, 100 - (debtToIncome * 200)); // Steep penalty for debt

  // OVERALL SCORE CALCULATION
  const score = Math.round((savingsScore * 0.4) + (budgetAdherence * 0.4) + (debtScore * 0.2));

  // Determine Status & Tips
  let status: HealthReport['status'] = 'Sehat';
  let color = '#2E7D32';
  const tips: string[] = [];

  if (score < 40) {
    status = 'Bahaya';
    color = '#D32F2F';
  } else if (score < 75) {
    status = 'Waspada';
    color = '#FFA502';
  }

  // Generate Smart Tips
  if (savingsRatio < 10) tips.push('Tabungan Anda rendah. Cobalah metode 50/30/20.');
  if (budgetsExceeded > 0) tips.push(`Ada ${budgetsExceeded} anggaran yang jebol. Evaluasi belanja bulanan Anda.`);
  if (debtToIncome > 0.3) tips.push('Beban hutang Anda cukup tinggi. Fokus pelunasan sebelum belanja besar.');
  if (income === 0) tips.push('Belum ada data pemasukan bulan ini.');
  if (tips.length === 0) tips.push('Keuangan Anda sangat baik! Pertahankan disiplin ini.');

  return {
    score,
    status,
    color,
    tips: tips.slice(0, 2), // Max 2 tips
    metrics: {
      savingsRatio,
      budgetAdherence,
      debtLoad: debtToIncome * 100
    }
  };
};
