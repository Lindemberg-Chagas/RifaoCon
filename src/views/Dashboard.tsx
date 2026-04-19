import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Menu, Trophy, Wallet } from 'lucide-react';
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const stats = bondososList.reduce((acc, b) => {
    const range = b.range || "0 - 0";
    const [start, end] = range.split(' - ').map(Number);
    const totalNoBloco = isNaN(start) || isNaN(end) ? 0 : (end - start + 1);

    if (b.status === 'paid') {
      acc.vendidos += (b.sold_tickets || 0);
      acc.apurado += (b.collected_amount || 0);
      const current = acc.ranking.get(b.name) || 0;
      acc.ranking.set(b.name, current + (b.sold_tickets || 0));
    } else {
      acc.pendentes += totalNoBloco;
    }
    return acc;
  }, { vendidos: 0, pendentes: 0, apurado: 0, ranking: new Map() });

  const chartData = [
    { name: 'Vendidos', value: stats.vendidos, color: '#cfa030' },
    { name: 'Com Revendedores', value: stats.pendentes, color: '#ffffff' },
    { name: 'Disponíveis', value: Math.max(0, TOTAL_NUMEROS - stats.vendidos - stats.pendentes), color: '#11224d' }
  ];

  const topSellers = Array.from(stats.ranking.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  const greeting = new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[#cfa030] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-40 text-white animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tight leading-tight">
          Olá, {userName}. <br />
          <span className="text-[#cfa030]">{greeting}!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Card do Gráfico */}
        <div className="lg:col-span-8 bg-[#1e3a8a] p-10 md:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white/50">Status Rifas</h3>
            <div className="text-right">
              <p className="text-3xl font-black leading-none">20.000</p>
              <p className="text-xs font-bold text-[#cfa030] uppercase mt-1">Total</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-64 h-64 relative shrink-0 scale-110">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius="70%" outerRadius="100%" stroke="none" dataKey="value">
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">20k</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-black uppercase tracking-wider text-white/70">{item.name}</span>
                  </div>
                  <span className="text-xl font-black">{item.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="bg-[#cfa030] p-10 rounded-[3.5rem] shadow-lg text-[#1e3a8a] flex flex-col gap-2">
            <Wallet className="w-10 h-10 mb-4 opacity-50" />
            <p className="text-xs font-black uppercase tracking-widest">Total Apurado</p>
            <p className="text-5xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
            </p>
          </div>

          <div className="bg-[#1e3a8a] p-10 rounded-[3.5rem] border border-white/10 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-[#cfa030]" />
              <h3 className="text-sm font-black uppercase tracking-widest">Top Vendedores</h3>
            </div>
            <div className="space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-lg font-bold truncate pr-3">{i + 1}º {s.name}</span>
                  <span className="text-2xl font-black text-[#cfa030] shrink-0">{s.sold}</span>
                </div>
              ))}
              {topSellers.length === 0 && <p className="text-base text-center text-white/30 py-6 font-bold uppercase tracking-widest">Sem vendas</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}