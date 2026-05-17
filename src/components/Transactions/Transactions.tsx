import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card, Button } from '../ui/Base';
import type { TransactionType } from '../../types';

export const TransactionForm: React.FC<{ onSave: () => void }> = ({ onSave }) => {
  const { addTransaction, budgets } = useAppStore();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Makan');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    addTransaction({
      amount: parseFloat(amount),
      category,
      description,
      date: new Date().toISOString(),
      type
    });

    setAmount('');
    setDescription('');
    onSave();
  };

  return (
    <Card title="Tambah Transaksi Baru">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type="button"
            variant={type === 'income' ? 'secondary' : 'ghost'} 
            fullWidth 
            onClick={() => setType('income')}
          >
            Pemasukan
          </Button>
          <Button 
            type="button"
            variant={type === 'expense' ? 'primary' : 'ghost'} 
            fullWidth 
            onClick={() => setType('expense')}
          >
            Pengeluaran
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Jumlah (Rp)</label>
          <input 
            type="number" 
            placeholder="Contoh: 50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              border: '1px solid #EEE',
              fontSize: '1rem'
            }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Kategori</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              border: '1px solid #EEE',
              fontSize: '1rem'
            }}
          >
            {type === 'expense' ? (
              budgets.map(b => <option key={b.category} value={b.category}>{b.category}</option>)
            ) : (
              <>
                <option value="Gaji">Gaji</option>
                <option value="Bonus">Bonus</option>
                <option value="Investasi">Investasi</option>
                <option value="Lainnya">Lainnya</option>
              </>
            )}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 600 }}>Catatan (Opsional)</label>
          <input 
            type="text" 
            placeholder="Makan siang di kantor..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ 
              padding: '12px', 
              borderRadius: '12px', 
              border: '1px solid #EEE',
              fontSize: '1rem'
            }}
          />
        </div>

        <Button type="submit" fullWidth style={{ marginTop: '10px' }}>
          Simpan Transaksi
        </Button>
      </form>
    </Card>
  );
};

export const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useAppStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <h3 style={{ margin: '10px 0' }}>Riwayat Transaksi</h3>
      {transactions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          Belum ada transaksi tercatat.
        </Card>
      ) : (
        transactions.map((t) => (
          <Card key={t.id} style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                backgroundColor: t.type === 'income' ? 'var(--secondary-color)' : 'var(--warning-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {t.type === 'income' ? '💰' : '💸'}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{t.category}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {t.description || 'Tidak ada catatan'} • {formatDate(t.date)}
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontWeight: 700, 
                color: t.type === 'income' ? '#4CAF50' : 'var(--text-primary)'
              }}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </div>
              <button 
                onClick={() => deleteTransaction(t.id)}
                style={{ background: 'none', border: 'none', color: '#FF5252', fontSize: '0.7rem', cursor: 'pointer', padding: '4px 0' }}
              >
                Hapus
              </button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};
