import { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { Resellers } from './views/Resellers';
import { Inventory } from './views/Inventory';
import { Login } from './views/Login';
import { Admin } from './views/Admin';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container font-body flex flex-col">

      {/* Oculta o Header global na tela de Admin */}
      {activeTab !== 'admin' && <Header activeTab={activeTab} setActiveTab={setActiveTab} />}

      <div className="flex-1">
        {/* Passamos o setActiveTab como propriedade para eles poderem mudar a aba */}
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'resellers' && <Resellers />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'admin' && <Admin setActiveTab={setActiveTab} />}
      </div>

      {/* Oculta o BottomNav global na tela de Admin */}
      {activeTab !== 'admin' && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}