import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { Resellers } from './views/Resellers';
import { Profile } from './views/Profile'; // Importação corrigida aqui
import { Login } from './views/Login';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Checa sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Escuta mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
    if (session) {
      setIsAuthenticated(true);
      const user = session.user;

      // Upsert dos dados do admin logado
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
    setIsAuthLoading(false);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#cfa030] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Login />;

  return (
    <div className="bg-[#1e3a8a] min-h-screen flex flex-col font-sans">
      {/* O Header e a BottomNav agora usam a lógica de 'profile' */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-x-hidden">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'resellers' && <Resellers />}
        {activeTab === 'profile' && <Profile />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}