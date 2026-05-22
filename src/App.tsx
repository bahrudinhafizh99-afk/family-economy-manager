import { useState, useEffect } from 'react';
import { Layout } from './components/Layout/MainLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionForm, TransactionList } from './components/Transactions/Transactions';
import { PlanningView } from './components/Planning/Planning';
import { SettingsView } from './components/Settings/Settings';
import { AuthView } from './components/Auth/Auth';
import { AuthProvider } from './components/Auth/AuthProvider';
import { useSync } from './hooks/useSync';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { settings, processRecurringTransactions, user } = useAppStore();
  
  useSync(); // Background Sync

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    processRecurringTransactions();
  }, []);

  if (!user) {
    return <AuthView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'add':
        return <TransactionForm onSave={() => setActiveTab('transactions')} />;
      case 'budget':
        return <PlanningView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
