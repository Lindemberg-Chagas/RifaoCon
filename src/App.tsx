import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { Resellers } from './views/Resellers';
import { Inventory } from './views/Inventory';
import { Login } from './views/Login';
import { Admin } from './views/Profile';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // 1. Checa se o usuário já estava logado antes
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // 2. Escuta quando a pessoa volta do Google após clicar em "Entrar"
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
    if (session) {
      setIsAuthenticated(true);

      const user = session.user;
      // 3. Salva ou Atualiza a FOTO e DADOS da pessoa no banco!
      await supabase.from('admin_users').upsert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || 'Usuário',
        avatar_url: user.user_metadata?.avatar_url || '',
        last_login: new Date().toISOString()
      });

    } else {
      setIsAuthenticated(false);
    }
    setIsAuthLoading(false); // Libera a tela de carregamento
  };

  // Tela de carregamento enquanto checa a sessão
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#cfa030] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Se não tem sessão ativa, mostra a tela de Login
  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container font-body flex flex-col">
      {activeTab !== 'admin' && <Header activeTab={activeTab} setActiveTab={setActiveTab} />}

      <div className="flex-1">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'resellers' && <Resellers />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'admin' && <Admin setActiveTab={setActiveTab} />}
      </div>

      {activeTab !== 'admin' && <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
}