import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui/Base';

export const BudgetView: React.FC = () => {
  const { budgets, updateBudget } = useAppStore();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newLimit, setNewLimit] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleUpdate = (category: string) => {
    updateBudget(category, parseFloat(newLimit));
    setEditingCategory(null);
    setNewLimit('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{ margin: '10px 0' }}>Batas Anggaran Bulanan</h3>
      {budgets.map((budget) => {
        const percent = Math.min(100, (budget.spent / budget.limit) * 100);
        const isEditing = editingCategory === budget.category;

        return (
          <Card key={budget.category}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700 }}>{budget.category}</div>
              {isEditing ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    value={newLimit} 
                    onChange={(e) => setNewLimit(e.target.value)}
                    style={{ width: '100px', padding: '4px 8px', borderRadius: '8px', border: '1px solid #DDD' }}
                  />
                  <Button onClick={() => handleUpdate(budget.category)} style={{ padding: '4px 8px', fontSize: '0.8rem' }}>Simpan</Button>
                </div>
              ) : (
                <div 
                  onClick={() => { setEditingCategory(budget.category); setNewLimit(budget.limit.toString()); }}
                  style={{ cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                >
                  {formatCurrency(budget.limit)} ✏️
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Terpakai: {formatCurrency(budget.spent)}</span>
              <span style={{ fontWeight: 600, color: percent > 90 ? '#F44336' : 'inherit' }}>{Math.round(percent)}%</span>
            </div>
            
            <div style={{ height: '12px', backgroundColor: '#F0F0F0', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${percent}%`, 
                backgroundColor: percent > 90 ? '#F44336' : percent > 70 ? 'var(--warning-color)' : 'var(--secondary-color)',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const GoalsView: React.FC = () => {
  const { goals, addGoal, deleteGoal, updateGoalAmount } = useAppStore();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleAdd = () => {
    if (!title || !target) return;
    addGoal({
      title,
      targetAmount: parseFloat(target),
      currentAmount: 0
    });
    setTitle('');
    setTarget('');
    setShowAdd(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: '10px 0' }}>Target Tabungan</h3>
        <Button onClick={() => setShowAdd(!showAdd)} style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
          {showAdd ? 'Batal' : '+ Target'}
        </Button>
      </div>

      {showAdd && (
        <Card title="Buat Target Baru">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input 
              placeholder="Nama Target (misal: Liburan)" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #EEE' }}
            />
            <input 
              type="number" 
              placeholder="Target Jumlah (Rp)" 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              style={{ padding: '12px', borderRadius: '12px', border: '1px solid #EEE' }}
            />
            <Button onClick={handleAdd}>Simpan Target</Button>
          </div>
        </Card>
      )}

      {goals.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Belum ada target tabungan.
        </Card>
      ) : (
        goals.map((goal) => {
          const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
          return (
            <Card key={goal.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{goal.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </div>
                </div>
                <button onClick={() => deleteGoal(goal.id)} style={{ background: 'none', border: 'none', color: '#FF5252', cursor: 'pointer' }}>✕</button>
              </div>

              <div style={{ height: '16px', backgroundColor: '#F0F0F0', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${percent}%`, 
                  backgroundColor: 'var(--accent-color)',
                  transition: 'width 0.5s ease'
                }} />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="number" 
                  placeholder="Update jumlah..." 
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) updateGoalAmount(goal.id, val);
                  }}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #EEE', fontSize: '0.8rem' }}
                />
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};
