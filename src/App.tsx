import { useState } from 'react';
import { Layout } from './components/Layout/MainLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionForm, TransactionList } from './components/Transactions/Transactions';
import { BudgetView, GoalsView } from './components/Budget/Budget';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <TransactionList />;
      case 'add':
        return <TransactionForm onSave={() => setActiveTab('transactions')} />;
      case 'budget':
        return <BudgetView />;
      case 'goals':
        return <GoalsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
