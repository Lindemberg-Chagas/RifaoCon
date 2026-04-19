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

  // Começamos com vazio para ter certeza que mudou
  const [userName, setUserName] = useState('...');
  const [userAvatar, setUserAvatar] = useState('');

  const TOTAL_NUMEROS = 20000;

  useEffect(() => {
    fetchDadosIniciais();
  }, []);

  const fetchDadosIniciais = async () => {
    setIsLoading(true);

    // BUSCA OS DADOS REAIS DO GOOGLE
    const { data: { user } } = await supabase.auth.getUser();
    console.log("Usuário logado:", user); // Isso vai aparecer no seu F12

    if (user) {
      const fullName = user.user_metadata?.full_name || 'Usuário';
      setUserName(fullName.split(' ')[0]);
      setUserAvatar(user.user_metadata?.avatar_url || '');
    }

    const { data } = await supabase.from('bondosos').select('*');
    setBondososList(data || []);
    setIsLoading(false);
  };

  // CÁLCULOS
  let totalVendidos = 0;
  let totalComRevendedores = 0;
  let totalApurado = 0;
  const rankingMap = new Map<string, number>();

  bondososList.forEach(b => {
    let totalNoBloco = 0;
    if (b.range) {
      const [s, e] = b.range.split(' - ').map(Number);
      totalNoBloco = (e - s + 1);
    }
    if (b.status === 'paid') {
      totalVendidos += (b.sold_tickets || 0);
      totalApurado += (b.collected_amount || 0);
      if (b.sold_tickets > 0) {
        rankingMap.set(b.name, (rankingMap.get(b.name) || 0) + b.sold_tickets);
      }
    } else {
      totalComRevendedores += totalNoBloco;
    }
  });

  const chartData = [
    { name: 'Vendidos', value: totalVendidos, color: '#cfa030' },
    { name: 'Com Revendedores', value: totalComRevendedores, color: '#ffffff' },
    { name: 'Disponíveis', value: Math.max(0, TOTAL_NUMEROS - totalVendidos - totalComRevendedores), color: '#1e3a8a' }
  ];

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter']">
      <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <Menu className="w-6 h-6 text-[#cfa030]" />
          <span className="text-xl font-black tracking-tighter uppercase">RifaoCon</span>
        </div>

        <button onClick={() => setActiveTab('admin')} className="w-10 h-10 rounded-full border-2 border-[#cfa030] overflow-hidden bg-white/10 flex items-center justify-center">
          {userAvatar ? (
            <img src={userAvatar} alt="Foto Google" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-[#cfa030]">{userName.charAt(0)}</span>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a]">
            Olá, {userName}. <br />
            <span className="text-[#cfa030]">{greeting}!</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card do Gráfico - Ajustado para tirar o erro do console */}
          <div className="lg:col-span-8 bg-[#5e85f0] p-6 md:p-10 rounded-[2rem] shadow-lg text-white">
            <h3 className="text-sm font-black tracking-widest opacity-50 uppercase mb-8">Status das Rifas</h3>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-64 h-64 relative"> {/* Altura fixa aqui resolve o erro do console */}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius="70%" outerRadius="100%" stroke="none" dataKey="value">
                      {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center font-black text-2xl">20k</div>
              </div>
              <div className="flex flex-col gap-3 w-full">
                {chartData.map((item, i) => (
                  <div key={i} className="flex justify-between p-3 rounded-xl bg-white/10 border border-white/10">
                    <span className="text-xs font-bold uppercase">{item.name}</span>
                    <span className="font-black">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1e3a8a] p-6 rounded-[2rem] shadow-lg text-white">
              <p className="text-xs font-black text-[#cfa030] uppercase tracking-widest mb-1">Total Apurado</p>
              <span className="text-4xl font-black">R$ {totalApurado.toLocaleString('pt-BR')}</span>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#cfa030]" />
                <h3 className="text-xs font-black text-[#1e3a8a] uppercase tracking-widest">Ranking</h3>
              </div>
              {Array.from(rankingMap.entries()).slice(0, 3).map(([name, sold], i) => (
                <div key={i} className="flex justify-between p-2 mb-2 bg-slate-50 rounded-lg text-sm font-bold text-[#1e3a8a]">
                  <span>{i + 1}º {name}</span>
                  <span>{sold}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}