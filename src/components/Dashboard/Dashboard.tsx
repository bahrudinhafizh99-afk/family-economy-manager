import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Base';
import { ArrowUpRight, ArrowDownLeft, Wallet, Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { exportToPDF } from '../../utils/exportUtils';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

export const Dashboard: React.FC = () => {
  const { transactions, budgets, goals } = useAppStore();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = totalIncome - totalExpense;

  // Data for Pie Chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: any, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

  const chartData = Object.keys(expenseByCategory).map(name => ({
    name,
    value: expenseByCategory[name]
  }));

  const COLORS = ['#FFB499', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB', '#FF9AA2'];

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
        padding: '30px 24px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Wallet size={20} />
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Total Saldo Keluarga</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 800 }}>{formatCurrency(balance)}</h2>
        
        <button 
          onClick={() => exportToPDF(transactions, balance)}
          style={{ 
            position: 'absolute', 
            top: '20px', 
            right: '20px', 
            background: 'rgba(255,255,255,0.3)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '40px', 
            height: '40px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Unduh PDF"
        >
          <Download size={20} />
        </button>
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

      {chartData.length > 0 && (
        <Card title="Analisis Pengeluaran">
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: ValueType | undefined) => value ? formatCurrency(Number(value)) : ''}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

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
