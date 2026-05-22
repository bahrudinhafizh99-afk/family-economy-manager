import { useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../store/useAppStore';

export const useSync = () => {
  const { user, transactions, budgets, goals, debts, recurringTransactions, settings, updateSettings } = useAppStore();

  // 1. SYNC UP (Push local changes to Supabase)
  // We use simple upsert. In a real production app, we might want to track 'dirty' flags.
  // For this project, we'll keep it simple: any change to local state triggers an upsert.
  
  const syncUp = useCallback(async () => {
    if (!user) return;

    try {
      // Sync Settings
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        settings: settings,
        updated_at: new Date().toISOString()
      });

      // Upsert Transactions
      if (transactions.length > 0) {
        await supabase.from('transactions').upsert(
          transactions.map(t => ({ ...t, user_id: user.id }))
        );
      }

      // Upsert Budgets
      if (budgets.length > 0) {
        // We omit 'spent' as it is calculated dynamically now
        await supabase.from('budgets').upsert(
          budgets.map(b => ({ user_id: user.id, category: b.category, limit: b.limit }))
        );
      }

      // Upsert Goals
      if (goals.length > 0) {
        await supabase.from('goals').upsert(
          goals.map(g => ({ 
            id: g.id, 
            user_id: user.id, 
            title: g.title, 
            target_amount: g.targetAmount, 
            current_amount: g.currentAmount 
          }))
        );
      }

      // Upsert Debts
      if (debts.length > 0) {
        await supabase.from('debts').upsert(
          debts.map(d => ({ ...d, user_id: user.id }))
        );
      }

      // Upsert Recurring
      if (recurringTransactions.length > 0) {
        await supabase.from('recurring_transactions').upsert(
          recurringTransactions.map(rt => ({
            id: rt.id,
            user_id: user.id,
            title: rt.title,
            amount: rt.amount,
            category: rt.category,
            type: rt.type,
            frequency: rt.frequency,
            start_date: rt.startDate,
            lastprocessed: rt.lastprocessed,
            is_active: rt.isActive
          }))
        );
      }
    } catch (err) {
      console.error('Sync up failed:', err);
    }
  }, [user, transactions, budgets, goals, debts, recurringTransactions, settings]);

  // Trigger sync on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      syncUp();
    }, 2000); // Debounce sync by 2 seconds

    return () => clearTimeout(timer);
  }, [syncUp]);

  // 2. SYNC DOWN (Initial Pull)
  const syncDown = useCallback(async () => {
    if (!user) return;

    try {
      const [
        { data: profile },
        { data: remoteTransactions },
        { data: remoteBudgets },
        { data: remoteGoals },
        { data: remoteDebts },
        { data: remoteRecurring }
      ] = await Promise.all([
        supabase.from('profiles').select('settings').eq('id', user.id).single(),
        supabase.from('transactions').select('*'),
        supabase.from('budgets').select('*'),
        supabase.from('goals').select('*'),
        supabase.from('debts').select('*'),
        supabase.from('recurring_transactions').select('*')
      ]);

      // Merge logic
      if (profile?.settings) {
        updateSettings(profile.settings);
      }
      
      if (remoteTransactions) {
        useAppStore.setState({ transactions: remoteTransactions.map(({ user_id, created_at, ...t }: any) => t) });
      }
      if (remoteBudgets) {
        useAppStore.setState({ budgets: remoteBudgets.map((b: any) => ({ category: b.category, limit: b.limit, spent: 0 })) });
      }
      if (remoteGoals) {
        useAppStore.setState({ goals: remoteGoals.map((g: any) => ({ id: g.id, title: g.title, targetAmount: g.target_amount, currentAmount: g.current_amount })) });
      }
      if (remoteDebts) {
        useAppStore.setState({ debts: remoteDebts.map(({ user_id, created_at, ...d }: any) => d) });
      }
      if (remoteRecurring) {
        useAppStore.setState({ recurringTransactions: remoteRecurring.map((r: any) => ({
          id: r.id,
          title: r.title,
          amount: r.amount,
          category: r.category,
          type: r.type,
          frequency: r.frequency,
          startDate: r.start_date,
          lastprocessed: r.lastprocessed,
          isActive: r.is_active
        })) });
      }

    } catch (err) {
      console.error('Sync down failed:', err);
    }
  }, [user]);

  // Fetch data when user logs in
  useEffect(() => {
    if (user) {
      syncDown();
    }
  }, [user]);
};
