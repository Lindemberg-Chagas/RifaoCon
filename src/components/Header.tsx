import { Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [userAvatar, setUserAvatar] = useState('');

  useEffect(() => {
    async function getAvatar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.user_metadata?.avatar_url) {
        setUserAvatar(user.user_metadata.avatar_url);
      }
    }
    getAvatar();
  }, []);

  return (
    <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-white/5">
      <div className="flex items-center gap-4">
        <Menu className="w-6 h-6 text-[#cfa030] cursor-pointer" />
        <span className="text-xl font-black tracking-tighter uppercase">Rifas Vendidas</span>
      </div>

      {/* Menu Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'dashboard' ? 'text-[#cfa030]' : 'text-white/60 hover:text-white'}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('resellers')}
          className={`text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'resellers' ? 'text-[#cfa030]' : 'text-white/60 hover:text-white'}`}
        >
          Revendedores
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-10 h-10 rounded-full border-2 transition-all overflow-hidden bg-slate-800 flex items-center justify-center ${activeTab === 'profile' ? 'border-[#cfa030] scale-110' : 'border-white/20'}`}
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#5e85f0] flex items-center justify-center text-xs font-bold">L</div>
          )}
        </button>
      </div>
    </header>
  );
}