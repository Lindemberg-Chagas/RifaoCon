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
    <header className="bg-[#1e3a8a] text-white px-5 md:px-8 py-5 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-white/5">
      <div className="flex items-center gap-4">
        <Menu className="w-7 h-7 text-[#cfa030] cursor-pointer" />
        {/* Nome da Marca aumentado para acompanhar o equilíbrio */}
        <span className="text-2xl font-black tracking-tighter uppercase">Rifas Vendidas</span>
      </div>

      {/* Menu Desktop - AUMENTADO EM 10% */}
      <nav className="hidden md:flex items-center gap-10">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'dashboard' ? 'text-[#cfa030]' : 'text-white/70 hover:text-white'}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('resellers')}
          className={`text-sm font-black uppercase tracking-widest transition-colors ${activeTab === 'resellers' ? 'text-[#cfa030]' : 'text-white/70 hover:text-white'}`}
        >
          Bondosos
        </button>
      </nav>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setActiveTab('profile')}
          className={`w-12 h-12 rounded-full border-2 transition-all overflow-hidden bg-slate-800 flex items-center justify-center ${activeTab === 'profile' ? 'border-[#cfa030] scale-110' : 'border-white/20'}`}
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#5e85f0] flex items-center justify-center text-sm font-bold uppercase">L</div>
          )}
        </button>
      </div>
    </header>
  );
}