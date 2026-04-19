import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Mail, Shield, Bell, Moon } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) return null;

  return (
    // MUDANÇA: Removido 'text-white' do main para não sumir no fundo claro
    <main className="flex-1 w-full max-w-2xl mx-auto px-5 pt-20 pb-40 min-h-screen">

      {/* Área do Avatar e Nome */}
      <div className="flex flex-col items-center mb-12 animate-in fade-in duration-700">
        <div className="relative">
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-40 h-40 rounded-full border-8 border-[#cfa030] shadow-2xl"
          />
          <div className="absolute bottom-2 right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white" />
        </div>

        {/* MUDANÇA: Nome agora em Azul Escuro (#1e3a8a) para contraste no fundo branco */}
        <h2 className="mt-8 text-4xl font-black tracking-tight text-[#1e3a8a] text-center">
          {user.user_metadata.full_name}
        </h2>
        <p className="text-[#cfa030] font-black uppercase tracking-[0.2em] text-sm mt-2">
          Administrador // Rifas Vendidas
        </p>
      </div>

      <div className="space-y-6">
        {/* Card de Identidade - Mantido Azul */}
        <div className="bg-[#1e3a8a] p-8 rounded-[3rem] border border-white/10 shadow-lg text-white">
          <h3 className="text-white/30 text-xs font-black uppercase tracking-widest mb-8">Meus Dados</h3>
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl text-[#cfa030]">
                <Mail className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/30">E-mail</p>
                <p className="text-xl font-bold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/5 rounded-2xl text-[#cfa030]">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-white/30">Acesso</p>
                <p className="text-xl font-bold text-emerald-400">Total (Super Admin)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Preferências - Mantido Azul */}
        <div className="bg-[#1e3a8a] p-8 rounded-[3rem] border border-white/10 shadow-lg text-white">
          <h3 className="text-white/30 text-xs font-black uppercase tracking-widest mb-4">Preferências</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-5">
                <Bell className="w-6 h-6 text-white/60 group-hover:text-[#cfa030]" />
                <span className="text-lg font-bold">Notificações Push</span>
              </div>
              <div className="w-12 h-7 bg-[#cfa030] rounded-full relative">
                <div className="absolute right-1 top-1 bg-[#1e3a8a] w-5 h-5 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-5 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-5">
                <Moon className="w-6 h-6 text-white/60 group-hover:text-[#cfa030]" />
                <span className="text-lg font-bold">Modo Engenheiro</span>
              </div>
              <div className="w-12 h-7 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 bg-white/40 w-5 h-5 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Sair - Vermelho no fundo branco fica bem visível */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-4 p-8 bg-red-500/10 border-2 border-red-500/20 text-red-500 rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <LogOut className="w-8 h-8" />
          Sair do Sistema
        </button>
      </div>
    </main>
  );
}