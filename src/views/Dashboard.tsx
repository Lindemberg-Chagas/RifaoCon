import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, Calendar, Menu, Trophy, Wallet, Ticket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentRifa = {
    id: 1,
    name: 'Rifão de Inverno',
    startDate: '15 Junho, 2026',
    endDate: '30 Agosto, 2026',
    isActive: true
  };

  const TOTAL_NUMEROS = 20000;

  useEffect(() => {
    fetchDados();
  }, []);

  const fetchDados = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bondosos')
      .select('*');

    if (error) {
      console.error("Erro ao buscar dados do Dashboard:", error);
    } else {
      setBondososList(data || []);
    }
    setIsLoading(false);
  };

  // --- MATEMÁTICA DO DASHBOARD ---
  let totalVendidos = 0;
  let totalComRevendedores = 0;
  let totalApurado = 0;
  let blocosVendidos = 0;

  // Mapa para calcular o ranking (soma vendas da mesma pessoa se ela pegar mais de um bloco)
  const rankingMap = new Map<string, number>();

  bondososList.forEach(b => {
    // Descobre quantos números tem no bloco que a pessoa pegou
    let totalNoBloco = 0;
    if (b.range) {
      const [startStr, endStr] = b.range.split(' - ');
      const start = parseInt(startStr, 10) || 0;
      const end = parseInt(endStr, 10) || 0;
      totalNoBloco = (end - start + 1);
    }

    if (b.status === 'paid') {
      totalVendidos += (b.sold_tickets || 0);
      totalApurado += (b.collected_amount || 0);
      blocosVendidos += (totalNoBloco / 12); // Calcula os blocos baseados no intervalo

      // Adiciona ao ranking
      if (b.sold_tickets > 0) {
        const atual = rankingMap.get(b.name) || 0;
        rankingMap.set(b.name, atual + b.sold_tickets);
      }
    } else if (b.status === 'pending') {
      totalComRevendedores += totalNoBloco;
    }
  });

  const disponiveis = Math.max(0, TOTAL_NUMEROS - totalVendidos - totalComRevendedores);

  const chartData = [
    { name: 'Vendidos', value: totalVendidos, color: '#cfa030' },
    { name: 'Com Revendedores', value: totalComRevendedores, color: '#ffffff' },
    { name: 'Disponíveis', value: disponiveis, color: '#1e3a8a' }
  ];

  const salesStats = {
    totalApurado: totalApurado,
    rifasVendidas: totalVendidos,
    blocosVendidos: Math.ceil(blocosVendidos),
  };

  // Transforma o Mapa em Array, ordena do maior pro menor e pega os 3 primeiros
  const topSellers = Array.from(rankingMap.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3)
    .map((seller, index) => ({
      ...seller,
      color: index === 0 ? '#cfa030' : index === 1 ? '#94a3b8' : '#b45309' // Ouro, Prata, Bronze
    }));

  const currentHour = new Date().getHours();
  let greeting = 'Boa noite';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Bom dia';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Boa tarde';

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter'] selection:bg-[#cfa030]/30">

      <header className="bg-[#5e85f0] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-[#cfa030]/20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <Menu className="w-6 h-6 text-[#cfa030]" />
          </button>
          <span className="text-xl font-black tracking-tighter uppercase">RifaoCon</span>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="w-11 h-11 rounded-full border-2 border-[#cfa030] overflow-hidden hover:scale-105 transition-all shadow-md active:scale-95 bg-white"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lindemberg&backgroundColor=1e3a8a"
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 w-full">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tight leading-tight">
            Olá, Lindemberg. <span className="text-[#cfa030] drop-shadow-sm">{greeting}!</span>
          </h1>
        </div>

        <section className="mb-8 bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e3a8a] leading-[1.1] uppercase break-words hyphens-auto">
            {currentRifa.name}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#5e85f0] text-white px-4 py-2.5 rounded-xl font-bold text-sm md:text-base shadow-md">
              <Calendar className="w-5 h-5 text-[#cfa030]" />
              <span>{currentRifa.startDate} — {currentRifa.endDate}</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          <div className="lg:col-span-8 bg-[#5e85f0] p-6 md:p-10 rounded-[2rem] border border-[#cfa030]/20 shadow-lg relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black tracking-widest text-white/50 uppercase">Quantidade de Números</h3>
              <div className="text-right">
                <span className="block text-2xl font-black text-white leading-none">{(TOTAL_NUMEROS / 1000).toFixed(0)}.000</span>
                <span className="text-[10px] font-bold text-[#cfa030] uppercase tracking-widest">Total</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="relative w-64 h-64 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius="65%"
                      outerRadius="100%"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={2}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [value, 'Números']}
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#1e3a8a', fontWeight: 'bold' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white mt-1">{(TOTAL_NUMEROS / 1000).toFixed(0)}k</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-bold text-white uppercase tracking-wide">{item.name}</span>
                    </div>
                    <span className="text-lg font-black text-white">
                      {item.value >= 1000 ? `${(item.value / 1000).toFixed(1).replace('.0', '')}k` : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">

            <div className="bg-[#5e85f0] p-6 rounded-[2rem] shadow-lg relative overflow-hidden group">
              <Wallet className="absolute -right-4 -bottom-4 text-white/5 w-32 h-32 transition-transform group-hover:scale-110 duration-500" />
              <p className="text-xs font-black text-[#cfa030] uppercase tracking-widest mb-1 relative z-10">Total Apurado</p>
              <div className="flex items-baseline gap-2 text-white relative z-10">
                <span className="text-xl font-bold opacity-60">R$</span>
                <span className="text-4xl font-black tracking-tight">
                  {Math.floor(salesStats.totalApurado).toLocaleString('pt-BR')}
                </span>
                <span className="text-lg font-bold opacity-60">
                  ,{salesStats.totalApurado.toFixed(2).split('.')[1]}
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex gap-4 divide-x divide-slate-100">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Rifas Vendidas</p>
                </div>
                <p className="text-2xl font-black text-[#1e3a8a]">{salesStats.rifasVendidas.toLocaleString('pt-BR')}</p>
              </div>

              <div className="flex-1 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Blocos Vendidos</p>
                </div>
                <p className="text-2xl font-black text-[#1e3a8a]">{salesStats.blocosVendidos}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="w-5 h-5 text-[#cfa030]" />
                <h3 className="text-sm font-black text-[#1e3a8a] uppercase tracking-widest">Top Vendedores</h3>
              </div>

              {topSellers.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Nenhuma venda ainda.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {topSellers.map((seller, index) => (
                    <div key={index} className="flex justify-between items-center bg-slate-50 p-3 px-4 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg" style={{ color: seller.color }}>{index + 1}º</span>
                        <span className="text-sm font-bold text-[#1e3a8a]">{seller.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-black text-[#1e3a8a] leading-none">{seller.sold}</span>
                        <span className="text-[9px] uppercase font-bold text-slate-400">rifas</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}