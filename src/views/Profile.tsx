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
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-5 pt-10 md:pt-20 pb-40 min-h-screen">

      {/* Área do Avatar e Nome - Ajustada para não flutuar textos soltos */}
      <div className="flex flex-col items-center mb-8 md:mb-12 animate-in fade-in duration-700">
        <div className="relative">
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-28 h-28 md:w-40 md:h-40 rounded-full border-4 md:border-8 border-[#cfa030] shadow-2xl"
          />
          <div className="absolute bottom-1 right-1 md:bottom-2 md:right-2 bg-emerald-500 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white" />
        </div>

        <h2 className="mt-6 md:mt-8 text-2xl md:text-4xl font-black tracking-tight text-[#1e3a8a] text-center px-4">
          {user.user_metadata.full_name}
        </h2>
        <p className="text-[#cfa030] font-black uppercase tracking-[0.2em] text-[10px] md:text-sm mt-2">
          Administrador // Rifas Vendidas
        </p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {/* Card de Identidade - Ajustado para e-mails longos */}
        <div className="bg-[#5e85f0] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white">
          <h3 className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-8">Meus Dados</h3>
          <div className="space-y-6 md:space-y-8">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 md:p-4 bg-white/10 rounded-xl md:rounded-2xl text-[#cfa030] shrink-0">
                <Mail className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-white/40">E-mail Principal</p>
                {/* break-all impede que o e-mail saia do card */}
                <p className="text-sm md:text-xl font-bold break-all">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 md:gap-6">
              <div className="p-3 md:p-4 bg-white/10 rounded-xl md:rounded-2xl text-[#cfa030] shrink-0">
                <Shield className="w-5 h-5 md:w-7 md:h-7" />
              </div>
              <div>
                <p className="text-[9px] md:text-xs font-black uppercase tracking-widest text-white/40">Nível de Acesso</p>
                <p className="text-sm md:text-xl font-bold text-white uppercase">Total (Super Admin)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Preferências - Otimizado para Mobile */}
        <div className="bg-[#5e85f0] p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl text-white">
          <h3 className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2 md:mb-4">Configurações</h3>
          <div className="space-y-1 md:space-y-2">
            <div className="flex items-center justify-between p-3 md:p-5 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4 md:gap-5">
                <Bell className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white" />
                <span className="text-sm md:text-lg font-bold">Notificações</span>
              </div>
              <div className="w-10 h-6 md:w-12 md:h-7 bg-[#cfa030] rounded-full relative shrink-0">
                <div className="absolute right-1 top-1 bg-[#1e3a8a] w-4 h-4 md:w-5 md:h-5 rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between p-3 md:p-5 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4 md:gap-5">
                <Moon className="w-5 h-5 md:w-6 md:h-6 text-white/60 group-hover:text-white" />
                <span className="text-sm md:text-lg font-bold">Modo Escuro</span>
              </div>
              <div className="w-10 h-6 md:w-12 md:h-7 bg-white/10 rounded-full relative shrink-0">
                <div className="absolute left-1 top-1 bg-white/40 w-4 h-4 md:w-5 md:h-5 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 md:gap-4 p-6 md:p-8 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] md:rounded-[2.5rem] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm text-xs md:text-base"
        >
          <LogOut className="w-6 h-6 md:w-8 md:h-8" />
          Sair do Sistema
        </button>
      </div>
    </main>
  );
}