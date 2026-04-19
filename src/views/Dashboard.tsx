import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, Calendar, Menu, Trophy, Wallet, Ticket, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');
  const [userAvatar, setUserAvatar] = useState('');

  const TOTAL_NUMEROS = 20000;

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  const fetchDadosIniciais = async () => {
    setIsLoading(true);
    try {
      // 1. Dados do Usuário
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || 'Usuário';
        setUserName(fullName.split(' ')[0]);
        setUserAvatar(user.user_metadata?.avatar_url || '');
      }

      // 2. Dados dos Bondosos
      const { data, error } = await supabase.from('bondosos').select('*');
      if (error) throw error;
      setBondososList(data || []);
    } catch (err) {
      console.error("Erro no Dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // --- CÁLCULOS OTIMIZADOS ---
  const stats = bondososList.reduce((acc, b) => {
    const [start, end] = (b.range || "0 - 0").split(' - ').map(Number);
    const totalNoBloco = (end - start + 1);

    if (b.status === 'paid') {
      acc.vendidos += (b.sold_tickets || 0);
      acc.apurado += (b.collected_amount || 0);
      acc.blocos += (totalNoBloco / 12);

      const current = acc.ranking.get(b.name) || 0;
      acc.ranking.set(b.name, current + b.sold_tickets);
    } else {
      acc.pendentes += totalNoBloco;
    }
    return acc;
  }, { vendidos: 0, pendentes: 0, apurado: 0, blocos: 0, ranking: new Map() });

  const disponiveis = Math.max(0, TOTAL_NUMEROS - stats.vendidos - stats.pendentes);

  const chartData = [
    { name: 'Vendidos', value: stats.vendidos, color: '#cfa030' },
    { name: 'Com Revendedores', value: stats.pendentes, color: '#ffffff' },
    { name: 'Disponíveis', value: disponiveis, color: '#1e3a8a' }
  ];

  const topSellers = Array.from(stats.ranking.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-[#cfa030] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter']">
      <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-[#cfa030]" />
          <span className="text-xl font-black tracking-tighter uppercase">RifaoCon</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5 text-white/50" />
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className="w-10 h-10 rounded-full border-2 border-[#cfa030] overflow-hidden bg-slate-700 flex items-center justify-center shadow-inner"
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{userName[0]}</span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-24">
        <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-500">
          <h1 className="text-4xl font-black text-[#1e3a8a] tracking-tight">
            Olá, <span className="text-[#1e3a8a]">{userName}.</span> <br />
            <span className="text-[#cfa030]">{greeting}!</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Card do Gráfico */}
          <div className="lg:col-span-8 bg-[#5e85f0] p-8 md:p-10 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-xs font-black tracking-widest opacity-60 uppercase mb-1">Status de Distribuição</h3>
                  <p className="text-3xl font-black">Resumo Geral</p>
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black">{TOTAL_NUMEROS.toLocaleString('pt-BR')}</span>
                  <span className="text-[10px] font-bold text-[#cfa030] uppercase tracking-widest">Total da Ação</span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="w-64 h-64 relative shrink-0 drop-shadow-2xl">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius="70%" outerRadius="100%" stroke="none" dataKey="value" animationBegin={0} animationDuration={1200}>
                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', fontWeight: 'bold' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black">{(TOTAL_NUMEROS / 1000)}k</span>
                    <span className="text-[10px] font-bold opacity-60 uppercase">Tickets</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 w-full">
                  {chartData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                        <span className="text-xs font-black uppercase tracking-wider">{item.name}</span>
                      </div>
                      <span className="font-black text-lg">{item.value.toLocaleString('pt-BR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Valor Arrecadado */}
            <div className="bg-[#1e3a8a] p-8 rounded-[2.5rem] shadow-lg text-white group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg text-[#cfa030]">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-widest">Total Arrecadado</p>
              </div>
              <p className="text-4xl font-black tracking-tight">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
              </p>
            </div>

            {/* Top Vendedores */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-[#cfa030]" />
                <h3 className="text-sm font-black text-[#1e3a8a] uppercase tracking-widest">Top Vendedores</h3>
              </div>

              <div className="flex flex-col gap-3">
                {topSellers.length > 0 ? topSellers.map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`w-6 text-center font-black ${i === 0 ? 'text-[#cfa030]' : 'text-slate-400'}`}>{i + 1}º</span>
                      <span className="text-sm font-bold text-[#1e3a8a]">{s.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-black text-[#1e3a8a]">{s.sold}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Rifas</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-center text-slate-400 text-xs font-bold py-4">Nenhuma venda registrada</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}