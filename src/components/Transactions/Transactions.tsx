import React, { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Base';
import type { TransactionType } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { getCategoryIcon } from '../../utils/categoryIcons';
import { suggestCategory } from '../../utils/aiUtils';

export const TransactionForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const { addTransaction, budgets, settings } = useAppStore();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makan');
  const [description, setDescription] = useState('');

  const allCategories = useMemo(() => {
    const expenseCats = budgets.map(b => b.category);
    const incomeCats = ['Gaji', 'Bonus', 'Investasi', 'Lainnya'];
    return [...expenseCats, ...incomeCats];
  }, [budgets]);

  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (val.length > 2) {
      const suggestion = suggestCategory(val, allCategories);
      if (suggestion) {
        // Auto switch type if suggested category is an income category
        const isIncomeCat = ['Gaji', 'Bonus', 'Investasi'].includes(suggestion);
        if (isIncomeCat && type === 'expense') setType('income');
        if (!isIncomeCat && type === 'income') setType('expense');
        
        setCategory(suggestion);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || (type === 'expense' && budgets.length === 0)) return;

    addTransaction({
      amount: parseFloat(amount),
      category: type === 'expense' ? category : (category || 'Lainnya'),
      description,
      date: new Date().toISOString(),
      type
    });

    setAmount('');
    setDescription('');
    onSave();
  };

  return (
    <Card title={settings.language === 'id' ? 'Tambah Transaksi Baru' : 'Add New Transaction'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          backgroundColor: 'rgba(0,0,0,0.05)', 
          padding: '6px', 
          borderRadius: '16px' 
        }}>
          <button 
            type="button"
            onClick={() => { setType('expense'); if(budgets.length > 0) setCategory(budgets[0].category); }}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: 'none',
              backgroundColor: type === 'expense' ? 'white' : 'transparent',
              color: type === 'expense' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: type === 'expense' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Minus size={18} /> {settings.language === 'id' ? 'Pengeluaran' : 'Expense'}
          </button>
          <button 
            type="button"
            onClick={() => { setType('income'); setCategory('Gaji'); }}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: 'none',
              backgroundColor: type === 'income' ? 'white' : 'transparent',
              color: type === 'income' ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: type === 'income' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Plus size={18} /> {settings.language === 'id' ? 'Pemasukan' : 'Income'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {settings.language === 'id' ? 'Jumlah' : 'Amount'} ({settings.currency})
          </label>
          <input 
            type="number" 
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              padding: '16px', 
              borderRadius: '16px', 
              border: '2px solid #F0F0F0',
              fontSize: '1.5rem',
              fontWeight: 800,
              textAlign: 'center',
              outline: 'none',
              color: 'var(--text-primary)',
              backgroundColor: 'white'
            }}
            required
            autoFocus
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {settings.language === 'id' ? 'Kategori' : 'Category'}
          </label>
          {type === 'expense' && budgets.length === 0 ? (
            <div style={{ padding: '14px', borderRadius: '16px', border: '2px dashed var(--primary-color)', color: '#FF5252', fontSize: '0.85rem', textAlign: 'center', fontWeight: 600 }}>
              {settings.language === 'id' ? '⚠ Tambah kategori di menu Rencana dahulu' : '⚠ Add categories in Planning menu first'}
            </div>
          ) : (
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                padding: '14px', 
                borderRadius: '16px', 
                border: '2px solid #F0F0F0',
                fontSize: '1rem',
                fontWeight: 600,
                backgroundColor: 'white',
                outline: 'none'
              }}
            >
              {type === 'expense' ? (
                budgets.map(b => <option key={b.category} value={b.category}>{b.category}</option>)
              ) : (
                <>
                  <option value="Gaji">{settings.language === 'id' ? '💰 Gaji' : '💰 Salary'}</option>
                  <option value="Bonus">{settings.language === 'id' ? '✨ Bonus' : '✨ Bonus'}</option>
                  <option value="Investasi">{settings.language === 'id' ? '📈 Investasi' : '📈 Investment'}</option>
                  <option value="Lainnya">{settings.language === 'id' ? '🍃 Lainnya' : '🍃 Others'}</option>
                </>
              )}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {settings.language === 'id' ? 'Catatan' : 'Note'}
          </label>
          <input 
            type="text" 
            placeholder={settings.language === 'id' ? 'Tulis keterangan singkat...' : 'Short description...'}
            value={description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            style={{ 
              padding: '14px', 
              borderRadius: '16px', 
              border: '2px solid #F0F0F0',
              fontSize: '1rem',
              outline: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit" 
          disabled={type === 'expense' && budgets.length === 0}
          style={{ 
            marginTop: '10px',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--text-primary)',
            fontSize: '1.1rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(var(--primary-color), 0.3)',
            opacity: (type === 'expense' && budgets.length === 0) ? 0.5 : 1
          }}
        >
          {settings.language === 'id' ? 'Simpan Transaksi' : 'Save Transaction'}
        </motion.button>
      </form>
    </Card>
  );
};

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction, settings } = useAppStore();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());

  const months = useMemo(() => {
    const monthsID = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const monthsEN = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return settings.language === 'id' ? monthsID : monthsEN;
  }, [settings.language]);

  const filteredTransactions = useMemo(() => transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === filterMonth && d.getFullYear() === filterYear;
  }), [transactions, filterMonth, filterYear]);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(settings.language === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: 0
    }).format(amount);
  }, [settings.language, settings.currency]);

  const formatDate = useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(settings.language === 'id' ? 'id-ID' : 'en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, [settings.language]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
          {settings.language === 'id' ? 'Riwayat Transaksi' : 'Transaction History'}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(parseInt(e.target.value))}
            style={{ 
              flex: 1, 
              padding: '12px', 
              borderRadius: '12px', 
              border: '2px solid #F0F0F0',
              fontWeight: 700,
              outline: 'none',
              backgroundColor: 'white',
              fontSize: '0.9rem'
            }}
          >
            {months.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select 
            value={filterYear}
            onChange={(e) => setFilterYear(parseInt(e.target.value))}
            style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              border: '2px solid #F0F0F0',
              fontWeight: 700,
              outline: 'none',
              backgroundColor: 'white',
              fontSize: '0.9rem'
            }}
          >
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          {filteredTransactions.length} {settings.language === 'id' ? 'transaksi di' : 'transactions in'} {months[filterMonth]} {filterYear}
        </span>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            {settings.language === 'id' ? 'Tidak ada transaksi' : 'No transactions'}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '0.9rem' }}>
            {settings.language === 'id' ? 'Belum ada data untuk periode ini.' : 'No data for this period.'}
          </p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <AnimatePresence initial={false}>
            {filteredTransactions.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <Card style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '16px', 
                      backgroundColor: t.type === 'income' ? 'rgba(181, 234, 215, 0.3)' : 'rgba(255, 180, 153, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: t.type === 'income' ? '#2E7D32' : '#D32F2F'
                    }}>
                      {getCategoryIcon(t.category, 24)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem' }}>{t.category}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {t.description || (settings.language === 'id' ? 'Tidak ada catatan' : 'No note')}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {formatDate(t.date)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ 
                      fontWeight: 800, 
                      fontSize: '1.05rem',
                      color: t.type === 'income' ? '#2E7D32' : 'var(--text-primary)'
                    }}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </div>
                    <button 
                      onClick={() => deleteTransaction(t.id)}
                      style={{ 
                        background: 'rgba(255, 82, 82, 0.05)', 
                        border: 'none', 
                        color: '#FF5252', 
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 82, 82, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 82, 82, 0.05)'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
