import React, { useMemo, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Base';
import { ArrowUpRight, ArrowDownLeft, Wallet, FileText, Download, Sparkles, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { motion } from 'framer-motion';
import { calculateFinancialHealth } from '../../utils/healthEngine';

export const Dashboard: React.FC = () => {
  const store = useAppStore();
  const { transactions, budgets, settings } = store;
  
  const healthReport = useMemo(() => calculateFinancialHealth(store), [store]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }), [transactions, currentMonth, currentYear]);

  const totalIncome = useMemo(() => monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0), [monthlyTransactions]);

  const totalExpense = useMemo(() => monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0), [monthlyTransactions]);

  const balance = useMemo(() => totalIncome - totalExpense, [totalIncome, totalExpense]);

  const chartData = useMemo(() => {
    const expenseByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});

    return Object.keys(expenseByCategory).map(name => ({
      name,
      value: expenseByCategory[name]
    }));
  }, [monthlyTransactions]);

  const COLORS = ['#FFB499', '#B5EAD7', '#C7CEEA', '#FFDAC1', '#E2F0CB', '#FF9AA2'];

  const budgetsWithSpent = useMemo(() => {
    return budgets.map(b => {
      const spent = monthlyTransactions
        .filter(t => t.category === b.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }, [budgets, monthlyTransactions]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(settings.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0
    }).format(amount);
  }, [settings.language, settings.currency]);

  // --- SMART INSIGHTS ENGINE ---
  const insight = useMemo(() => {
    const isID = settings.language === 'id';
    
    // 1. Deficit Check
    if (totalExpense > totalIncome && totalIncome > 0) {
      return {
        type: 'danger',
        icon: <AlertTriangle size={20} color="#FF5252" />,
        title: isID ? 'Peringatan Defisit!' : 'Deficit Alert!',
        message: isID 
          ? 'Pengeluaran bulan ini sudah melebihi pemasukan. Sebaiknya tunda belanja yang kurang mendesak.' 
          : 'Expenses this month have exceeded income. Consider postponing non-essential purchases.',
        color: '#FF5252'
      };
    }

    // 2. Budget Threshold Check
    const nearLimitBudgets = budgets.filter(b => (b.spent / b.limit) > 0.9);
    if (nearLimitBudgets.length > 0) {
      return {
        type: 'warning',
        icon: <AlertTriangle size={20} color="#FFA502" />,
        title: isID ? 'Anggaran Hampir Habis' : 'Budget Nearly Empty',
        message: isID 
          ? `Anggaran untuk ${nearLimitBudgets[0].category} sudah lebih dari 90%. Ayo lebih hemat!` 
          : `Budget for ${nearLimitBudgets[0].category} is over 90%. Time to save!`,
        color: '#FFA502'
      };
    }

    // 3. Healthy Balance
    if (balance > 0 && monthlyTransactions.length > 5) {
      return {
        type: 'success',
        icon: <CheckCircle size={20} color="#2E7D32" />,
        title: isID ? 'Keuangan Sehat' : 'Healthy Finance',
        message: isID 
          ? 'Bagus! Saldo Anda positif bulan ini. Pertahankan pola hidup hemat ini.' 
          : 'Great! You have a positive balance this month. Keep up the good work.',
        color: '#2E7D32'
      };
    }

    // Default
    return {
      type: 'info',
      icon: <Sparkles size={20} color="var(--primary-color)" />,
      title: isID ? 'Tips Hari Ini' : 'Today\'s Tip',
      message: isID 
        ? 'Selalu catat setiap pengeluaran sekecil apapun untuk mempermudah evaluasi keuangan.' 
        : 'Always record every single expense to make financial evaluation easier.',
      color: 'var(--primary-color)'
    };
  }, [totalIncome, totalExpense, balance, budgets, monthlyTransactions.length, settings.language]);

  const labels = useMemo(() => ({
    balance: settings.language === 'id' ? 'Total Saldo Keluarga' : 'Total Family Balance',
    income: settings.language === 'id' ? 'Pemasukan' : 'Income',
    expense: settings.language === 'id' ? 'Pengeluaran' : 'Expense',
    analysis: settings.language === 'id' ? 'Analisis Pengeluaran' : 'Expense Analysis',
    trend: settings.language === 'id' ? 'Tren 6 Bulan Terakhir' : 'Last 6 Months Trend',
    budget: settings.language === 'id' ? 'Status Anggaran' : 'Budget Status',
    spent: settings.language === 'id' ? 'Terpakai' : 'Spent'
  }), [settings.language]);

  const trendData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = d.toLocaleDateString(settings.language === 'id' ? 'id-ID' : 'en-US', { month: 'short' });
      
      const monthlySum = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }).reduce((acc, curr) => {
        if (curr.type === 'income') acc.income += curr.amount;
        else acc.expense += curr.amount;
        return acc;
      }, { income: 0, expense: 0 });

      months.push({
        name: monthLabel,
        income: monthlySum.income,
        expense: monthlySum.expense
      });
    }
    return months;
  }, [transactions, settings.language]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {/* FINANCIAL HEALTH SCORE CARD */}
      <motion.div variants={itemVariants}>
        <Card style={{ 
          padding: '20px', 
          border: 'none',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, fontSize: '0.85rem', fontWeight: 600 }}>
                <Activity size={16} /> 
                {settings.language === 'id' ? 'SKOR KESEHATAN KEUANGAN' : 'FINANCIAL HEALTH SCORE'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 900, color: healthReport.color }}>{healthReport.score}</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: healthReport.color, opacity: 0.9 }}>/ 100</span>
              </div>
              <div style={{ 
                display: 'inline-block', 
                padding: '4px 12px', 
                borderRadius: '20px', 
                backgroundColor: `${healthReport.color}22`, 
                color: healthReport.color,
                fontSize: '0.8rem',
                fontWeight: 800,
                width: 'fit-content'
              }}>
                {healthReport.status.toUpperCase()}
              </div>
            </div>

            <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {healthReport.tips.map((tip, i) => (
                <div key={i} style={{ fontSize: '0.7rem', opacity: 0.8, backgroundColor: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '8px', borderLeft: `3px solid ${healthReport.color}` }}>
                  {tip}
                </div>
              ))}
            </div>
          </div>
          
          {/* Subtle Background Circle */}
          <div style={{ 
            position: 'absolute', 
            right: '-30px', 
            top: '-30px', 
            width: '150px', 
            height: '150px', 
            borderRadius: '50%', 
            background: `${healthReport.color}11`,
            zIndex: 0 
          }} />
        </Card>
      </motion.div>

      {/* SMART INSIGHT CARD */}
      <motion.div variants={itemVariants}>
        <Card style={{ 
          border: `1.5px solid ${insight.color}33`, 
          background: `${insight.color}08`,
          padding: '16px 20px'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ marginTop: '2px' }}>{insight.icon}</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: insight.color, marginBottom: '2px' }}>
                {insight.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', fontWeight: 500 }}>
                {insight.message}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="balance-card" style={{ 
          background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
          color: 'var(--text-primary)',
          padding: '30px 24px',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.5s ease'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            zIndex: 0
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Wallet size={20} />
              <span style={{ fontSize: '0.95rem', fontWeight: 600, opacity: 0.9 }}>{labels.balance}</span>
            </div>
            <h2 style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-1px' }}>{formatCurrency(balance)}</h2>
            
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', display: 'flex', gap: '8px' }}>
              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => exportToCSV(transactions, settings.language)}
                style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                title="CSV"
              >
                <FileText size={20} />
              </motion.button>

              <motion.button 
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.4)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => exportToPDF(transactions, totalIncome, totalExpense, balance, settings.language)}
                style={{ background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
                title="PDF"
              >
                <Download size={20} />
              </motion.button>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '15px' 
      }}>
        <Card style={{ padding: '20px', border: '1px solid rgba(var(--secondary-color), 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary-color)', marginBottom: '8px' }}>
            <ArrowUpRight size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{labels.income}</span>
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>{formatCurrency(totalIncome)}</span>
        </Card>
        
        <Card style={{ padding: '20px', border: '1px solid rgba(255, 180, 153, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D32F2F', marginBottom: '8px' }}>
            <ArrowDownLeft size={18} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{labels.expense}</span>
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#D32F2F' }}>{formatCurrency(totalExpense)}</span>
        </Card>
      </motion.div>

      {/* MONTHLY TREND CHART */}
      <motion.div variants={itemVariants}>
        <Card title={labels.trend}>
          <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: 'var(--text-secondary)' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: 'var(--text-secondary)' }}
                  tickFormatter={(value) => `${value/1000}k`}
                />
                <Tooltip 
                  formatter={(value: ValueType | undefined) => value ? formatCurrency(Number(value)) : ''}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '12px' }}
                />
                <Legend verticalAlign="top" height={36} align="right" iconType="circle" />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  name={labels.income} 
                  stroke="#2E7D32" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#2E7D32' }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  name={labels.expense} 
                  stroke="#D32F2F" 
                  strokeWidth={4} 
                  dot={{ r: 4, fill: '#D32F2F' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card title={labels.analysis}>
            <div style={{ height: '260px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value" cornerRadius={6}>
                    {chartData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value: ValueType | undefined) => value ? formatCurrency(Number(value)) : ''} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', padding: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card title={labels.budget}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {budgetsWithSpent.slice(0, 4).map(budget => {
              const percent = budget.limit > 0 ? Math.min(100, (budget.spent / budget.limit) * 100) : (budget.spent > 0 ? 100 : 0);
              return (
                <div key={budget.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 600 }}>{budget.category}</span>
                    <span style={{ fontWeight: 700, color: percent > 90 ? '#D32F2F' : 'var(--text-secondary)' }}>{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} style={{ height: '100%', backgroundColor: percent > 90 ? '#FF5252' : 'var(--secondary-color)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};
