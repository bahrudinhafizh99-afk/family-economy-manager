import { useState, useEffect } from 'react';
import { Layout } from './components/Layout/MainLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionForm, TransactionList } from './components/Transactions/Transactions';
import { PlanningView } from './components/Planning/Planning';
import { SettingsView } from './components/Settings/Settings';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { settings } = useAppStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

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

export default App;
