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

  // Cálculos consolidados
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
    { name: 'DISPONÍVEIS', value: disponiveis, color: '#11224d' }
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
    <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-40 text-white animate-in fade-in duration-500">

      {/* 1. Saudação Reduzida */}
      <div className="mb-10 opacity-90">
        <h1 className="text-3xl font-bold tracking-tight leading-tight">
          Olá, {userName}. <span className="text-[#cfa030]">{greeting}!</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* 2. Card de Status das Rifas (Enfatizado e 10% maior) */}
        <div className="lg:col-span-8 bg-[#1e3a8a] p-10 md:p-14 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-base font-black uppercase tracking-[0.25em] text-[#cfa030]">Status Rifas</h3>
            <div className="text-right">
              <p className="text-4xl font-black leading-none">{TOTAL_NUMEROS.toLocaleString('pt-BR')}</p>
              <p className="text-xs font-bold text-white/40 uppercase mt-1 tracking-widest">Capacidade Total</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-14">
            {/* Gráfico ligeiramente maior (w-72 h-72 em vez de w-64) */}
            <div className="w-72 h-72 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius="72%"
                    outerRadius="100%"
                    stroke="none"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black">20k</span>
                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Total</span>
              </div>
            </div>

            {/* Itens de Dados 10% maiores (text-2xl e p-6) */}
            <div className="grid grid-cols-1 gap-5 w-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: item.color }} />
                    <span className="text-base font-black uppercase tracking-[0.1em] text-white/80">{item.name}</span>
                  </div>
                  <span className="text-2xl font-black">{item.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Coluna Lateral */}
        <div className="lg:col-span-4 flex flex-col gap-10">

          {/* Total Apurado */}
          <div className="bg-[#cfa030] p-10 rounded-[3.5rem] shadow-xl text-[#1e3a8a] flex flex-col gap-2 group transition-transform hover:scale-[1.02]">
            <Wallet className="w-10 h-10 mb-4 opacity-40" />
            <p className="text-xs font-black uppercase tracking-widest leading-none">Total Apurado</p>
            <p className="text-5xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
            </p>
          </div>

          {/* Top Vendedores */}
          <div className="bg-[#1e3a8a] p-10 rounded-[3.5rem] border border-white/10 shadow-lg relative">
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-[#cfa030]" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white/50">Performance</h3>
            </div>

            <div className="space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-[#cfa030] uppercase mb-1">{i + 1}º Lugar</span>
                    <span className="text-lg font-bold truncate pr-3">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white leading-none">{s.sold}</span>
                    <p className="text-[9px] font-bold text-white/30 uppercase">Números</p>
                  </div>
                </div>
              ))}
              {topSellers.length === 0 && (
                <p className="text-base text-center text-white/20 py-8 font-bold uppercase tracking-widest italic">Aguardando vendas...</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}