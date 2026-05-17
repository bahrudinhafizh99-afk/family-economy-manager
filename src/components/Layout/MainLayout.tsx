import React from 'react';
import { Home, Receipt, PieChart, Target, PlusCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Beranda' },
    { id: 'transactions', icon: Receipt, label: 'Transaksi' },
    { id: 'add', icon: PlusCircle, label: 'Tambah', primary: true },
    { id: 'budget', icon: PieChart, label: 'Anggaran' },
    { id: 'goals', icon: Target, label: 'Tabungan' },
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>Halo, Keluarga! 👋</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kelola ekonomi jadi lebih hangat.</p>
        </div>
      </header>

      <main style={{ padding: '0 20px' }}>
        {children}
      </main>

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        zIndex: 1000,
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              padding: '8px',
              color: activeTab === item.id ? 'var(--primary-color)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              transform: item.primary ? 'translateY(-10px)' : 'none',
            }}
          >
            <item.icon size={item.primary ? 40 : 24} strokeWidth={activeTab === item.id ? 2.5 : 2} 
              style={{ 
                color: item.primary ? 'var(--primary-color)' : 'inherit',
                filter: item.primary ? 'drop-shadow(0 4px 10px rgba(255, 180, 153, 0.4))' : 'none'
              }} 
            />
            {!item.primary && <span style={{ fontSize: '0.7rem', marginTop: '4px' }}>{item.label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
};
