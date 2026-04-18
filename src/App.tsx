import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { Resellers } from './views/Resellers';
import { Inventory } from './views/Inventory';
import { Login } from './views/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container font-body flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'resellers' && <Resellers />}
      {activeTab === 'inventory' && <Inventory />}
      
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
