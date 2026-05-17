import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Base';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { transactions, budgets, goals } = useAppStore();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card className="balance-card" style={{ 
        background: 'linear-gradient(135deg, var(--primary-color), #FFD1C1)',
        color: 'var(--text-primary)',
        padding: '30px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Wallet size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Total Saldo Keluarga</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(balance)}</h2>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4CAF50', marginBottom: '8px' }}>
            <ArrowUpRight size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pemasukan</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(totalIncome)}</span>
        </Card>
        
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F44336', marginBottom: '8px' }}>
            <ArrowDownLeft size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pengeluaran</span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatCurrency(totalExpense)}</span>
        </Card>
      </div>

      <Card title="Anggaran Bulan Ini">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {budgets.slice(0, 3).map(budget => {
            const percent = Math.min(100, (budget.spent / budget.limit) * 100);
            return (
              <div key={budget.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                  <span>{budget.category}</span>
                  <span style={{ fontWeight: 600 }}>{Math.round(percent)}%</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F0F0F0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percent}%`, 
                    backgroundColor: percent > 90 ? '#F44336' : 'var(--secondary-color)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {goals.length > 0 && (
        <Card title="Target Tabungan">
          {goals.slice(0, 1).map(goal => {
            const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <div key={goal.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{goal.title}</span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
                <div style={{ height: '12px', backgroundColor: '#F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${percent}%`, 
                    backgroundColor: 'var(--accent-color)',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};
