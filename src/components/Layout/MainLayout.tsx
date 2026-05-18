import React from 'react';
import { Home, Receipt, PieChart, PlusCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const { settings } = useAppStore();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: settings.language === 'id' ? 'Beranda' : 'Home' },
    { id: 'transactions', icon: Receipt, label: settings.language === 'id' ? 'Transaksi' : 'Transactions' },
    { id: 'add', icon: PlusCircle, label: settings.language === 'id' ? 'Tambah' : 'Add', primary: true },
    { id: 'budget', icon: PieChart, label: settings.language === 'id' ? 'Rencana' : 'Planning' },
    { id: 'settings', icon: Settings, label: settings.language === 'id' ? 'Atur' : 'Settings' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      paddingBottom: '110px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      backgroundColor: 'var(--bg-color)',
      transition: 'background-color 0.5s ease'
    }}>
      <header style={{ padding: '32px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <motion.div
          key={settings.language}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ margin: 0, fontSize: '1.7rem', color: 'var(--text-primary)', fontWeight: 800 }}>
            {settings.language === 'id' ? 'Halo, Keluarga! 👋' : 'Hello, Family! 👋'}
          </h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {settings.language === 'id' ? 'Kelola ekonomi jadi lebih hangat.' : 'Manage finances with warmth.'}
          </p>
        </motion.div>
      </header>

      <main style={{ padding: '0 20px' }}>
        {children}
      </main>

      <nav style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        height: '75px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        zIndex: 1000,
        maxWidth: '560px',
        margin: '0 auto',
        border: '1px solid rgba(255,255,255,0.3)'
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
              position: 'relative',
              width: '60px'
            }}
          >
            {activeTab === item.id && !item.primary && (
              <motion.div
                layoutId="nav-pill"
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '40px',
                  height: '4px',
                  backgroundColor: 'var(--primary-color)',
                  borderRadius: '2px'
                }}
              />
            )}
            
            {item.primary ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  backgroundColor: 'var(--primary-color)',
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '-40px',
                  boxShadow: '0 8px 20px rgba(255, 180, 153, 0.4)',
                  color: 'white'
                }}
              >
                <item.icon size={32} />
              </motion.div>
            ) : (
              <>
                <item.icon 
                  size={24} 
                  strokeWidth={activeTab === item.id ? 2.5 : 2} 
                  style={{ transition: 'color 0.3s ease' }}
                />
                <span style={{ 
                  fontSize: '0.65rem', 
                  marginTop: '4px', 
                  fontWeight: activeTab === item.id ? 700 : 500,
                  opacity: activeTab === item.id ? 1 : 0.7
                }}>
                  {item.label}
                </span>
              </>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};
