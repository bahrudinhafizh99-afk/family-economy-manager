import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Card } from '../ui/Base';
import { motion } from 'framer-motion';
import { Globe, Palette, Coins, Trash2, ShieldAlert, FileText, Download, Share2, LogOut, User } from 'lucide-react';
import { exportToPDF, exportToCSV } from '../../utils/exportUtils';
import { supabase } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const store = useAppStore();
  const { settings, updateSettings, resetData, transactions, user } = store;

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

  const balance = totalIncome - totalExpense;

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const themes = [
    { id: 'soft', label: 'Soft Peach', color: '#FFB499' },
    { id: 'dark', label: 'Midnight', color: '#2D3436' },
    { id: 'nature', label: 'Nature Green', color: '#B5EAD7' }
  ];

  const handleReset = () => {
    if (confirm(settings.language === 'id' ? 'Hapus SEMUA data transaksi dan anggaran? Tindakan ini tidak bisa dibatalkan.' : 'Reset ALL transaction and budget data? This action cannot be undone.')) {
      resetData();
      alert(settings.language === 'id' ? 'Data telah dibersihkan.' : 'Data has been reset.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
        {settings.language === 'id' ? 'Pengaturan' : 'Settings'}
      </h3>

      {/* ACCOUNT */}
      {user && (
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'var(--secondary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={20} color="var(--text-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{user.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Akun Terhubung' : 'Connected Account'}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={14} />
              {settings.language === 'id' ? 'Keluar' : 'Logout'}
            </button>
          </div>
        </Card>
      )}

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Globe size={20} color="var(--primary-color)" />
              <div>
                <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Bahasa' : 'Language'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Pilih bahasa aplikasi' : 'Choose app language'}</div>
              </div>
            </div>
            <select 
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as 'id' | 'en' })}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #F0F0F0', fontWeight: 700, outline: 'none' }}
            >
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Currency */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Coins size={20} color="var(--primary-color)" />
              <div>
                <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Mata Uang' : 'Currency'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Format uang yang digunakan' : 'Used currency format'}</div>
              </div>
            </div>
            <select 
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value as 'IDR' | 'USD' })}
              style={{ padding: '8px 12px', borderRadius: '10px', border: '2px solid #F0F0F0', fontWeight: 700, outline: 'none' }}
            >
              <option value="IDR">IDR (Rp)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* Theme */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Palette size={20} color="var(--primary-color)" />
              <div>
                <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Tema Warna' : 'Color Theme'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Sesuaikan tampilan aplikasi' : 'Customize app look'}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id as any })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: settings.theme === t.id ? '2px solid var(--primary-color)' : '2px solid #F0F0F0',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: t.color }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* EXPORT DATA */}
      <div style={{ marginTop: '10px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Share2 size={18} color="var(--secondary-color)" />
          {settings.language === 'id' ? 'Ekspor Data' : 'Export Data'}
        </h4>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Laporan PDF' : 'PDF Report'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Laporan rapi dengan ringkasan' : 'Clean report with summary'}</div>
              </div>
              <button 
                onClick={() => exportToPDF(transactions, totalIncome, totalExpense, balance, settings.language)}
                style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 180, 153, 0.1)', color: 'var(--primary-color)', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={16} />
                {settings.language === 'id' ? 'Unduh PDF' : 'Download PDF'}
              </button>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F0F0F0' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Format Excel (CSV)' : 'Excel Format (CSV)'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Data mentah untuk diolah lanjut' : 'Raw data for further processing'}</div>
              </div>
              <button 
                onClick={() => exportToCSV(transactions, settings.language)}
                style={{ padding: '10px 16px', backgroundColor: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <FileText size={16} />
                {settings.language === 'id' ? 'Ekspor Excel' : 'Export Excel'}
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#FF5252', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldAlert size={18} />
          {settings.language === 'id' ? 'Zona Berbahaya' : 'Danger Zone'}
        </h4>
        <Card style={{ border: '1px solid rgba(255, 82, 82, 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{settings.language === 'id' ? 'Reset Data' : 'Reset Data'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{settings.language === 'id' ? 'Hapus semua transaksi & anggaran' : 'Delete all transactions & budgets'}</div>
            </div>
            <button 
              onClick={handleReset}
              style={{ 
                padding: '10px 16px', 
                backgroundColor: 'rgba(255, 82, 82, 0.1)', 
                color: '#FF5252', 
                border: 'none', 
                borderRadius: '12px', 
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Trash2 size={16} />
              {settings.language === 'id' ? 'Reset' : 'Reset'}
            </button>
          </div>
        </Card>
      </div>

      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '20px' }}>
        Family Economy Manager v1.1 • {settings.language === 'id' ? 'Dibuat dengan hangat' : 'Made with warmth'}
      </div>
    </motion.div>
  );
};
