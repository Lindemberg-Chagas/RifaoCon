import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Mail, Shield, Bell, Moon, User } from 'lucide-react';

export function Profile() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) return null;

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-28 pb-32 min-h-screen text-white">
      <div className="flex flex-col items-center mb-10 animate-in fade-in duration-700">
        <div className="relative">
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-[#cfa030] shadow-xl"
          />
          <div className="absolute bottom-1 right-1 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#1e3a8a]" />
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-tight">{user.user_metadata.full_name}</h2>
        <p className="text-[#cfa030] font-black uppercase tracking-[0.2em] text-[10px] mt-1">Super Admin // Rifas Vendidas</p>
      </div>

      <div className="space-y-4">
        <div className="bg-[#1e3a8a] p-6 rounded-[2.5rem] border border-white/10 shadow-lg">
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">Identidade Digital</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-[#cfa030]"><Mail className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">E-mail Principal</p>
                <p className="font-bold">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-[#cfa030]"><Shield className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Nível de Permissão</p>
                <p className="font-bold text-emerald-400">Acesso Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e3a8a] p-6 rounded-[2.5rem] border border-white/10 shadow-lg">
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-4">Preferências</h3>
          <div className="space-y-1">
            <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-white/60 group-hover:text-[#cfa030]" />
                <span className="font-bold">Notificações Push</span>
              </div>
              <div className="w-10 h-6 bg-[#cfa030] rounded-full relative"><div className="absolute right-1 top-1 bg-[#1e3a8a] w-4 h-4 rounded-full" /></div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors group">
              <div className="flex items-center gap-4">
                <Moon className="w-5 h-5 text-white/60 group-hover:text-[#cfa030]" />
                <span className="font-bold">Modo Engenheiro</span>
              </div>
              <div className="w-10 h-6 bg-white/10 rounded-full relative"><div className="absolute left-1 top-1 bg-white/40 w-4 h-4 rounded-full" /></div>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          Encerrar Sessão
        </button>
      </div>
    </main>
  );
}