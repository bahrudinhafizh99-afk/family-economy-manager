import type { RecurringTransaction } from '../types';

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  isOverdue: boolean;
}

export const getUpcomingBills = (recurring: RecurringTransaction[]): BillReminder[] => {
  const reminders: BillReminder[] = [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  recurring.forEach(rt => {
    if (!rt.isActive) return;

    // Calculate next due date
    const lastProcessed = rt.lastprocessed ? new Date(rt.lastprocessed) : new Date(rt.startDate);
    let nextDate = new Date(lastProcessed);

    if (rt.frequency === 'monthly') nextDate.setMonth(nextDate.getMonth() + 1);
    else if (rt.frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (rt.frequency === 'yearly') nextDate.setFullYear(nextDate.getFullYear() + 1);

    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Show reminders for bills due within 3 days or already overdue
    if (diffDays <= 3) {
      reminders.push({
        id: rt.id,
        title: rt.title,
        amount: rt.amount,
        dueDate: nextDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        daysRemaining: diffDays,
        isOverdue: diffDays < 0
      });
    }
  });

  return reminders.sort((a, b) => a.daysRemaining - b.daysRemaining);
};
