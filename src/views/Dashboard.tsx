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

  // NOVOS ESTADOS PARA O USUÁRIO REAL
  const [userName, setUserName] = useState('Usuário');
  const [userAvatar, setUserAvatar] = useState('');

  const currentRifa = {
    id: 1,
    name: 'Rifão de Inverno',
    startDate: '15 Junho, 2026',
    endDate: '30 Agosto, 2026',
    isActive: true
  };

  const TOTAL_NUMEROS = 20000;

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  const fetchDadosIniciais = async () => {
    setIsLoading(true);

    // 1. BUSCA OS DADOS DO USUÁRIO LOGADO NO GOOGLE
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Pega o nome vindo do Google (metadata)
      const fullName = user.user_metadata?.full_name || 'Usuário';
      // Pega apenas o primeiro nome para o "Olá, Nome"
      const firstName = fullName.split(' ')[0];

      setUserName(firstName);
      setUserAvatar(user.user_metadata?.avatar_url || '');
    }

    // 2. BUSCA OS DADOS DOS BONDOSOS
    const { data, error } = await supabase.from('bondosos').select('*');
    if (error) console.error("Erro:", error);
    else setBondososList(data || []);

    setIsLoading(false);
  };

  // --- LÓGICA DE CÁLCULOS (Mantida a mesma) ---
  let totalVendidos = 0;
  let totalComRevendedores = 0;
  let totalApurado = 0;
  let blocosVendidos = 0;
  const rankingMap = new Map<string, number>();

  bondososList.forEach(b => {
    let totalNoBloco = 0;
    if (b.range) {
      const [, endStr] = b.range.split(' - ');
      const end = parseInt(endStr, 10) || 0;
      const start = parseInt(b.range.split(' - ')[0], 10) || 0;
      totalNoBloco = (end - start + 1);
    }

    if (b.status === 'paid') {
      totalVendidos += (b.sold_tickets || 0);
      totalApurado += (b.collected_amount || 0);
      blocosVendidos += (totalNoBloco / 12);
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

  const topSellers = Array.from(rankingMap.entries())
    .map(([name, sold]) => ({ name, sold }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 3)
    .map((seller, index) => ({
      ...seller,
      color: index === 0 ? '#cfa030' : index === 1 ? '#94a3b8' : '#b45309'
    }));

  const currentHour = new Date().getHours();
  let greeting = 'Boa noite';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Bom dia';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Boa tarde';

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter'] selection:bg-[#cfa030]/30">

      {/* HEADER ATUALIZADO COM SUA FOTO */}
      <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-[#cfa030]" />
          <span className="text-xl font-black tracking-tighter uppercase">RifaoCon</span>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="w-10 h-10 rounded-full border-2 border-[#cfa030] overflow-hidden shadow-md active:scale-95 transition-transform"
        >
          {userAvatar ? (
            <img src={userAvatar} alt="Sua Foto" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#5e85f0] flex items-center justify-center text-xs font-bold">
              {userName.charAt(0)}
            </div>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 w-full">

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tight leading-tight">
            Olá, <span className="text-[#1e3a8a]">{userName}.</span> <br />
            <span className="text-[#cfa030] drop-shadow-sm">{greeting}!</span>
          </h1>
        </div>

        {/* --- Restante do Dashboard (Gráficos e Cards) --- */}
        <section className="mb-8 bg-white p-6 md:p-10 rounded-[2rem] shadow-sm border border-slate-200">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e3a8a] leading-[1.1] uppercase">
            {currentRifa.name}
          </h2>
          <div className="mt-6 flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-xl font-bold text-sm w-fit">
            <Calendar className="w-5 h-5 text-[#cfa030]" />
            <span>{currentRifa.startDate} — {currentRifa.endDate}</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card Principal do Gráfico */}
          <div className="lg:col-span-8 bg-[#5e85f0] p-6 md:p-10 rounded-[2rem] border border-[#cfa030]/20 shadow-lg">
            <div className="flex justify-between items-center mb-10 text-white">
              <h3 className="text-sm font-black tracking-widest opacity-50 uppercase">Quantidade de Números</h3>
              <div className="text-right">
                <span className="block text-2xl font-black leading-none">20.000</span>
                <span className="text-[10px] font-bold text-[#cfa030] uppercase tracking-widest">Total</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-64 h-64 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius="65%" outerRadius="100%" stroke="none" dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white pointer-events-none">
                  <span className="text-3xl font-black">20k</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold uppercase tracking-wide">{item.name}</span>
                    </div>
                    <span className="text-lg font-black">
                      {item.value >= 1000 ? `${(item.value / 1000).toFixed(1)}k` : item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1e3a8a] p-6 rounded-[2rem] shadow-lg text-white">
              <p className="text-xs font-black text-[#cfa030] uppercase tracking-widest mb-1">Total Apurado</p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold opacity-50">R$</span>
                <span className="text-4xl font-black tracking-tight">{totalApurado.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#cfa030]" />
                  <h3 className="text-xs font-black text-[#1e3a8a] uppercase tracking-widest">Ranking</h3>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {topSellers.map((s, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-[#1e3a8a]">{i + 1}º {s.name}</span>
                    <span className="text-sm font-black text-[#1e3a8a]">{s.sold} <span className="text-[10px] text-slate-400">RIFAS</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}