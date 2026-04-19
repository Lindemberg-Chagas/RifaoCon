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
  const [activeRaffle, setActiveRaffle] = useState<any>(null);
  const [userName, setUserName] = useState('Usuário');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserName(user.user_metadata?.full_name?.split(' ')[0] || 'Usuário');

      // 1. Buscar a Rifa Ativa
      const { data: raffle } = await supabase
        .from('raffles')
        .select('*')
        .eq('is_active', true)
        .single();

      if (raffle) {
        setActiveRaffle(raffle);
        // 2. Buscar bondosos apenas desta rifa
        const { data: bondosos } = await supabase
          .from('bondosos')
          .select('*')
          .eq('raffle_id', raffle.id);

        setBondososList(bondosos || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  const TOTAL_NUMEROS = activeRaffle?.total_tickets || 0;

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
  }, { vendidos: 0, pendentes: 0, apurado: 0, ranking: new Map<string, number>() });

  const disponiveis = Math.max(0, TOTAL_NUMEROS - stats.vendidos - stats.pendentes);

  const chartData = [
    { name: 'RIFAS VENDIDAS', value: stats.vendidos, color: '#cfa030' },
    { name: 'RIFAS COM BONDOSOS', value: stats.pendentes, color: '#ffffff' },
    { name: 'RIFAS DISPONÍVEIS', value: disponiveis, color: '#1e3a8a' }
  ];

  // Lógica do Ranking (Top 3)
  const topSellers = Array.from(stats.ranking.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3);

  if (isLoading) return <div className="flex-1 flex items-center justify-center min-h-[70vh] text-[#1e3a8a] font-black text-2xl uppercase animate-pulse">Sincronizando...</div>;

  if (!activeRaffle) return <div className="p-20 text-center font-black text-[#1e3a8a] uppercase">Nenhuma rifa ativa. Ative uma no Perfil.</div>;

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-10 pb-40 animate-in fade-in duration-500">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-[#1e3a8a]">
          Olá, {userName}. <span className="text-[#cfa030]">{activeRaffle.name}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-[#5e85f0] p-10 md:p-14 rounded-[3.5rem] shadow-2xl text-white relative">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-[0.2em] text-[#cfa030] text-center">Status Rifas</h2>
            <div className="mt-4 opacity-80 text-center">
              <p className="text-xl font-black">{TOTAL_NUMEROS.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest">Meta desta Campanha</p>
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
                <span className="text-5xl">{TOTAL_NUMEROS > 0 ? Math.floor((stats.vendidos / TOTAL_NUMEROS) * 100) : 0}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 w-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-6 rounded-3xl bg-white/10 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-black uppercase text-white/90">{item.name}</span>
                  </div>
                  <span className="text-2xl font-black">{item.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-10">
          {/* Card de Valor Arrecadado */}
          <div className="bg-[#cfa030] p-10 rounded-[3.5rem] shadow-xl text-[#1e3a8a]">
            <Wallet className="w-10 h-10 mb-4 opacity-40" />
            <p className="text-xs font-black uppercase">Arrecadado</p>
            <p className="text-5xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.apurado)}
            </p>
          </div>

          {/* RESTAURADO: Card de Performance (Ranking Top 3) */}
          <div className="bg-[#5e85f0] p-10 rounded-[3.5rem] shadow-lg text-white">
            <div className="flex items-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-[#cfa030]" />
              <h3 className="text-sm font-black uppercase text-white/50 tracking-widest">Performance</h3>
            </div>
            <div className="space-y-4">
              {topSellers.map((s, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white/10 rounded-2xl border border-white/10">
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-black text-[#cfa030] uppercase mb-1">{i + 1}º Lugar</span>
                    <span className="text-lg font-bold truncate pr-2">{s.name}</span>
                  </div>
                  <span className="text-2xl font-black text-white shrink-0">{s.sold}</span>
                </div>
              ))}
              {topSellers.length === 0 && (
                <p className="text-center opacity-40 py-4 font-bold uppercase text-xs">Sem vendas nesta rifa</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}