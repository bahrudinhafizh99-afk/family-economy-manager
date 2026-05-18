import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui/Base';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, Check, X, Target, TrendingUp, Trash2, 
  Handshake, Calendar 
} from 'lucide-react';

// --- SUB-VIEW: BUDGET ---
export const BudgetView: React.FC = () => {
  const { budgets, updateBudget, addBudget, deleteBudget, settings } = useAppStore();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addLimit, setAddLimit] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(settings.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleUpdate = (category: string) => {
    if (!newLimit || isNaN(parseFloat(newLimit))) return;
    updateBudget(category, parseFloat(newLimit));
    setEditingCategory(null);
    setNewLimit('');
  };

  const handleAdd = () => {
    if (!addName || !addLimit) return;
    addBudget(addName, parseFloat(addLimit));
    setAddName('');
    setAddLimit('');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TrendingUp size={24} color="var(--primary-color)" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
            {settings.language === 'id' ? 'Batas Anggaran Bulanan' : 'Monthly Budget Limits'}
          </h3>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)} 
          style={{ 
            padding: '8px 16px', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            borderRadius: '12px',
            border: 'none',
            backgroundColor: showAdd ? 'rgba(0,0,0,0.05)' : 'var(--primary-color)',
            color: 'var(--text-primary)',
            cursor: 'pointer'
          }}
        >
          {showAdd ? (settings.language === 'id' ? 'Batal' : 'Cancel') : (settings.language === 'id' ? '+ Kategori' : '+ Category')}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <Card title={settings.language === 'id' ? 'Tambah Kategori Anggaran' : 'Add Budget Category'}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input 
                  placeholder={settings.language === 'id' ? 'Nama Kategori (misal: Kesehatan)' : 'Category Name (e.g. Health)'} 
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }}
                />
                <input 
                  type="number" 
                  placeholder={settings.language === 'id' ? 'Batas Bulanan (Rp)' : 'Monthly Limit'} 
                  value={addLimit}
                  onChange={(e) => setAddLimit(e.target.value)}
                  style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }}
                />
                <Button onClick={handleAdd} fullWidth style={{ padding: '14px', borderRadius: '14px', fontWeight: 800 }}>
                  {settings.language === 'id' ? 'Simpan Kategori' : 'Save Category'}
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {budgets.map((budget, index) => {
          const percent = budget.limit > 0 ? Math.min(100, (budget.spent / budget.limit) * 100) : (budget.spent > 0 ? 100 : 0);
          const isEditing = editingCategory === budget.category;

          return (
            <motion.div
              key={budget.category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{budget.category}</div>
                    {!isEditing && (
                      <button 
                        onClick={() => {
                          if (confirm(settings.language === 'id' ? `Hapus kategori "${budget.category}"?` : `Delete category "${budget.category}"?`)) {
                            deleteBudget(budget.category);
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#FF5252', padding: 0, cursor: 'pointer', opacity: 0.5 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div key="edit" initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ display: 'flex', gap: '6px' }}>
                        <input 
                          type="number" 
                          value={newLimit} 
                          onChange={(e) => setNewLimit(e.target.value)}
                          autoFocus
                          style={{ width: '100px', padding: '8px', borderRadius: '10px', border: '2px solid var(--primary-color)', fontWeight: 700, outline: 'none' }}
                        />
                        <button onClick={() => handleUpdate(budget.category)} style={{ background: 'var(--primary-color)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Check size={16} /></button>
                        <button onClick={() => setEditingCategory(null)} style={{ background: '#F5F5F5', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="view" 
                        onClick={() => { setEditingCategory(budget.category); setNewLimit(budget.limit.toString()); }}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(0,0,0,0.03)', padding: '6px 12px', borderRadius: '10px' }}
                      >
                        <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{formatCurrency(budget.limit)}</span>
                        <Edit3 size={14} color="var(--text-secondary)" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{settings.language === 'id' ? 'Terpakai' : 'Spent'}: {formatCurrency(budget.spent)}</span>
                  <span style={{ fontWeight: 800, color: percent > 90 ? '#D32F2F' : 'var(--text-primary)' }}>{Math.round(percent)}%</span>
                </div>
                <div style={{ height: '10px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1 }} style={{ height: '100%', backgroundColor: percent > 90 ? '#FF5252' : 'var(--secondary-color)' }} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- SUB-VIEW: GOALS ---
export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoalAmount, settings } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(settings.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAdd = () => {
    if (!title || !target) return;
    addGoal({ title, targetAmount: parseFloat(target), currentAmount: 0 });
    setTitle(''); setTarget(''); setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={24} color="var(--accent-color)" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
            {settings.language === 'id' ? 'Target Tabungan' : 'Savings Goals'}
          </h3>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)} 
          style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '12px', border: 'none', backgroundColor: showAdd ? 'rgba(0,0,0,0.05)' : 'var(--accent-color)', color: 'var(--text-primary)', cursor: 'pointer' }}
        >
          {showAdd ? (settings.language === 'id' ? 'Batal' : 'Cancel') : (settings.language === 'id' ? '+ Target' : '+ Goal')}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <Card title={settings.language === 'id' ? 'Buat Target Baru' : 'Create New Goal'}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input placeholder={settings.language === 'id' ? 'Nama Target (misal: Liburan)' : 'Goal Name'} value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }} />
                <input type="number" placeholder={settings.language === 'id' ? 'Target Jumlah (Rp)' : 'Target Amount'} value={target} onChange={(e) => setTarget(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }} />
                <Button onClick={handleAdd} fullWidth style={{ padding: '14px', borderRadius: '14px', fontWeight: 800 }}>{settings.language === 'id' ? 'Simpan Target' : 'Save Goal'}</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {goals.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{settings.language === 'id' ? 'Belum ada target' : 'No goals yet'}</div>
          </Card>
        ) : (
          goals.map((goal) => {
            const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
            return (
              <Card key={goal.id} style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{goal.title}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} style={{ background: 'rgba(255, 82, 82, 0.05)', border: 'none', color: '#FF5252', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer' }}><X size={16} /></button>
                </div>
                <div style={{ height: '14px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '7px', overflow: 'hidden', marginBottom: '16px' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', backgroundColor: 'var(--accent-color)' }} />
                </div>
                <input type="number" placeholder={settings.language === 'id' ? 'Update jumlah...' : 'Update amount...'} defaultValue={goal.currentAmount} onBlur={(e) => { const val = parseFloat(e.target.value); if (!isNaN(val)) updateGoalAmount(goal.id, val); }} style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '2px solid #F9F9F9', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }} />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

// --- SUB-VIEW: DEBTS ---
export const DebtView: React.FC = () => {
  const { debts, addDebt, deleteDebt, toggleDebtStatus, settings } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'to_pay' | 'to_receive'>('to_pay');
  const [dueDate, setDueDate] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(settings.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAdd = () => {
    if (!title || !amount) return;
    addDebt({ title, amount: parseFloat(amount), type, dueDate, status: 'active' });
    setTitle(''); setAmount(''); setDueDate(''); setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Handshake size={24} color="#A29BFE" />
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
            {settings.language === 'id' ? 'Manajemen Hutang' : 'Debt Management'}
          </h3>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAdd(!showAdd)} 
          style={{ padding: '8px 16px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '12px', border: 'none', backgroundColor: showAdd ? 'rgba(0,0,0,0.05)' : '#A29BFE', color: showAdd ? 'var(--text-primary)' : 'white', cursor: 'pointer' }}
        >
          {showAdd ? (settings.language === 'id' ? 'Batal' : 'Cancel') : (settings.language === 'id' ? '+ Hutang' : '+ Debt')}
        </motion.button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
            <Card title={settings.language === 'id' ? 'Catat Hutang/Piutang' : 'Record Debt'}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#F5F5F5', padding: '6px', borderRadius: '12px' }}>
                  <button onClick={() => setType('to_pay')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: type === 'to_pay' ? 'white' : 'transparent', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>{settings.language === 'id' ? 'Saya Berhutang' : 'I Owe'}</button>
                  <button onClick={() => setType('to_receive')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: type === 'to_receive' ? 'white' : 'transparent', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>{settings.language === 'id' ? 'Orang Berhutang' : 'Others Owe Me'}</button>
                </div>
                <input placeholder={settings.language === 'id' ? 'Nama Orang / Keperluan' : 'Title / Name'} value={title} onChange={(e) => setTitle(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }} />
                <input type="number" placeholder={settings.language === 'id' ? 'Jumlah (Rp)' : 'Amount'} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }} />
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ padding: '14px', borderRadius: '14px', border: '2px solid #F0F0F0', fontSize: '1rem', outline: 'none' }} />
                <Button onClick={handleAdd} fullWidth style={{ background: '#A29BFE', color: 'white' }}>{settings.language === 'id' ? 'Simpan' : 'Save'}</Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {debts.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            {settings.language === 'id' ? 'Belum ada catatan hutang.' : 'No debt records yet.'}
          </Card>
        ) : (
          debts.map((debt) => (
            <Card key={debt.id} style={{ padding: '16px', opacity: debt.status === 'paid' ? 0.6 : 1, border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: debt.type === 'to_pay' ? 'rgba(255, 180, 153, 0.2)' : 'rgba(181, 234, 215, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {debt.type === 'to_pay' ? <Handshake size={20} color="#FFB499" /> : <Handshake size={20} color="#B5EAD7" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, textDecoration: debt.status === 'paid' ? 'line-through' : 'none' }}>{debt.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {debt.dueDate ? new Date(debt.dueDate).toLocaleDateString() : '-'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: debt.type === 'to_pay' ? '#FF5252' : '#2E7D32' }}>
                    {debt.type === 'to_pay' ? '-' : '+'}{formatCurrency(debt.amount)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button onClick={() => toggleDebtStatus(debt.id)} style={{ background: debt.status === 'paid' ? 'var(--secondary-color)' : '#F5F5F5', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}>
                      {debt.status === 'paid' ? (settings.language === 'id' ? 'Lunas' : 'Paid') : (settings.language === 'id' ? 'Belum' : 'Active')}
                    </button>
                    <button onClick={() => deleteDebt(debt.id)} style={{ background: 'none', border: 'none', color: '#FF5252', padding: 0, cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

// --- MAIN PLANNING COMPONENT ---
export const PlanningView: React.FC = () => {
  const { settings } = useAppStore();
  const [tab, setTab] = useState<'budget' | 'goals' | 'debts'>('budget');

  const tabs = [
    { id: 'budget', label: settings.language === 'id' ? 'Anggaran' : 'Budget' },
    { id: 'goals', label: settings.language === 'id' ? 'Tabungan' : 'Goals' },
    { id: 'debts', label: settings.language === 'id' ? 'Hutang' : 'Debts' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ 
        display: 'flex', 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        padding: '6px', 
        borderRadius: '16px',
        marginBottom: '10px'
      }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: tab === t.id ? 'white' : 'transparent',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: tab === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: tab === t.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {tab === 'budget' && <BudgetView />}
          {tab === 'goals' && <GoalsView />}
          {tab === 'debts' && <DebtView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
