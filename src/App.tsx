import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './views/Dashboard';
import { Resellers } from './views/Resellers';
import { Profile } from './views/Profile';
import { Login } from './views/Login';
import { supabase } from './lib/supabase';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Verifica a sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Monitoriza mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
    if (session) {
      setIsAuthenticated(true);
      const user = session.user;

      // Sincroniza dados do administrador no banco
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

  // Ecrã de Carregamento com o novo azul claro (#5e85f0)
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#5e85f0] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#cfa030] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Se não estiver autenticado, mostra o Login
  if (!isAuthenticated) return <Login />;

  return (
    // Fundo Off-white para descanso visual em todo o projeto
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">

      {/* Cabeçalho e Rodapé permanecem fixos */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 overflow-x-hidden">
        {/* Navegação entre as abas principais */}
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'resellers' && <Resellers />}
        {activeTab === 'profile' && <Profile />}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}