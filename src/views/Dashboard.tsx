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
    { name: 'VENDIDOS', value: stats.vendidos, color: '#cfa030' },
    { name: 'COM REVENDEDORES', value: stats.pendentes, color: '#ffffff' },
    { name: 'DISPONÍVEIS', value: disponiveis, color: '#0f172a' }
  ];

  const topSellers = Array.from(stats.ranking.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold).slice(0, 3);

  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[70vh] text-[#1e3a8a] font-bold">Carregando...</div>;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-40 animate-in fade-in duration-500">

      {/* MUDANÇA: Texto agora é azul escuro (#1e3a8a) */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight leading-tight text-[#1e3a8a]">
          Olá, {userName}. <span className="text-[#cfa030]">{greeting}!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Card Azul Principal */}
        <div className="lg:col-span-8 bg-[#1e3a8a] p-10 md:p-14 rounded-[3.5rem] shadow-2xl text-white">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-base font-black uppercase tracking-[0.25em] text-[#cfa030]">Status Rifas</h3>
            <div className="text-right">
              <p className="text-4xl font-black">{TOTAL_NUMEROS.toLocaleString('pt-BR')}</p>
              <p className="text-xs font-bold text-white/40 uppercase">Total</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-14">
            <div className="w-72 h-72 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="72%" outerRadius="100%" stroke="none" dataKey="value">
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-black">
                <span className="text-5xl">20k</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 w-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-base font-black uppercase text-white/80">{item.name}</span>
                  </div>
                  <span className="text-2xl font-black">{item.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lado Direito */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="bg-[#cfa030] p-10 rounded-[3.5rem] shadow-xl text-[#1e3a8a] flex flex-col gap-2">
            <Wallet className="w-10 h-10 mb-4 opacity-40" />
            <p className="text-xs font-black uppercase tracking-widest">Total Apurado</p>
            <p className="text-5xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
            </p>
          </div>

          <div className="bg-[#1e3a8a] p-10 rounded-[3.5rem] shadow-lg text-white">
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-[#cfa030]" />
              <h3 className="text-sm font-black uppercase text-white/50">Performance</h3>
            </div>
            <div className="space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl">
                  <span className="text-lg font-bold">{i + 1}º {s.name}</span>
                  <span className="text-2xl font-black text-[#cfa030]">{s.sold}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}