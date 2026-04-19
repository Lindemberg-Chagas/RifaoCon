import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Trophy, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('Usuário');

  const TOTAL_NUMEROS = 20000;

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Usuário');
      const { data } = await supabase.from('bondosos').select('*');
      setBondososList(data || []);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }

  const stats = bondososList.reduce((acc, b) => {
    const range = b.range || "0 - 0";
    const [start, end] = range.split(' - ').map(Number);
    const totalNoBloco = isNaN(start) || isNaN(end) ? 0 : (end - start + 1);
    if (b.status === 'paid') {
      acc.vendidos += (b.sold_tickets || 0);
      acc.apurado += (b.collected_amount || 0);
      acc.ranking.set(b.name, (acc.ranking.get(b.name) || 0) + (b.sold_tickets || 0));
    } else {
      acc.pendentes += totalNoBloco;
    }
    return acc;
  }, { vendidos: 0, pendentes: 0, apurado: 0, ranking: new Map() });

  const disponiveis = Math.max(0, TOTAL_NUMEROS - stats.vendidos - stats.pendentes);

  const chartData = [
    { name: 'RIFAS VENDIDAS', value: stats.vendidos, color: '#cfa030' },
    { name: 'RIFAS COM BONDOSOS', value: stats.pendentes, color: '#ffffff' },
    { name: 'RIFAS DISPONÍVEIS', value: disponiveis, color: '#1e3a8a' }
  ];

  const topSellers = Array.from(stats.ranking.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold).slice(0, 3);

  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[70vh] text-[#1e3a8a] font-bold text-xl uppercase animate-pulse">Carregando...</div>;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-40 animate-in fade-in duration-500">

      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight text-[#1e3a8a]">
          Olá, {userName}. <span className="text-[#cfa030]">{greeting}!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">

        {/* Card Principal - Ajustado para mobile */}
        <div className="lg:col-span-8 bg-[#5e85f0] p-6 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden">

          <div className="flex flex-col items-center mb-8 md:mb-12 relative w-full">
            <h2 className="text-2xl md:text-5xl lg:text-6xl font-black uppercase tracking-widest md:tracking-[0.2em] text-[#cfa030] text-center w-full">
              Status Rifas
            </h2>
            <div className="mt-2 md:mt-4 flex flex-col items-center opacity-80">
              <p className="text-lg md:text-xl font-black leading-none">{TOTAL_NUMEROS.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Total da Ação</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">
            {/* Gráfico responsivo: menor no mobile */}
            <div className="w-full max-w-[240px] md:max-w-[320px] aspect-square relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="70%" outerRadius="100%" stroke="none" dataKey="value">
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-black">
                <span className="text-3xl md:text-5xl">20k</span>
                <span className="text-[10px] md:text-xs opacity-50 uppercase tracking-widest">Global</span>
              </div>
            </div>

            {/* Legendas ajustadas para não quebrar no mobile */}
            <div className="grid grid-cols-1 gap-3 md:gap-5 w-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-3 md:gap-5 min-w-0">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full shadow-lg shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] md:text-base font-black uppercase tracking-tight text-white/90 truncate">{item.name}</span>
                  </div>
                  <span className="text-xl md:text-3xl font-black shrink-0 ml-2">{item.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-10">
          {/* Card de Valor */}
          <div className="bg-[#cfa030] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl text-[#1e3a8a] flex flex-col gap-2">
            <Wallet className="w-8 h-8 md:w-10 md:h-10 mb-2 md:mb-4 opacity-40" />
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-none text-[#1e3a8a]/70">Total Apurado</p>
            <p className="text-3xl md:text-5xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
            </p>
          </div>

          {/* Card de Performance */}
          <div className="bg-[#5e85f0] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] shadow-lg text-white">
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[#cfa030]" />
              <h3 className="text-xs md:text-sm font-black uppercase text-white/50 tracking-widest">Performance</h3>
            </div>
            <div className="space-y-3 md:space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-4 md:p-6 bg-white/10 rounded-xl md:rounded-2xl border border-white/10">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[8px] md:text-[10px] font-black text-[#cfa030] uppercase mb-0.5">{i + 1}º Lugar</span>
                    <span className="text-sm md:text-lg font-bold truncate pr-2">{s.name}</span>
                  </div>
                  <span className="text-lg md:text-2xl font-black text-white">{s.sold}</span>
                </div>
              ))}
              {topSellers.length === 0 && <p className="text-center opacity-40 py-2 font-bold text-xs">Sem vendas ainda</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}