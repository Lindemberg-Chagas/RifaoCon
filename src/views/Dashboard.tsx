import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, ChevronRight, Calendar, Menu } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {

  const currentRifa = {
    id: 1,
    name: 'Rifão de Inverno',
    startDate: '15 Junho, 2026',
    endDate: '30 Agosto, 2026',
    collected: 50000,
    goal: 75000,
    isActive: true
  };

  const chartData = [
    { name: 'Vendidos', value: 12000, color: '#cfa030' },
    { name: 'Com Revendedores', value: 5000, color: '#1e3a8a' },
    { name: 'Disponíveis', value: 3000, color: '#e2e8f0' }
  ];

  const currentHour = new Date().getHours();
  let greeting = 'Boa noite';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Bom dia';
  else if (currentHour >= 12 && currentHour < 18) greeting = 'Boa tarde';

  return (
    <div className="min-h-screen bg-slate-100 font-['Inter'] selection:bg-[#cfa030]/30">

      {/* Navbar Superior de Alto Contraste */}
      <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-lg border-b border-[#cfa030]/20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <Menu className="w-6 h-6 text-[#cfa030]" />
          </button>
          <span className="text-xl font-black tracking-tighter uppercase">RifaoCon</span>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="w-11 h-11 rounded-full border-2 border-[#cfa030] overflow-hidden hover:scale-105 transition-all shadow-md active:scale-95"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lindemberg&backgroundColor=1e3a8a"
            alt="Perfil"
            className="w-full h-full object-cover bg-white"
          />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-24 w-full">

        {/* Saudação */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#1e3a8a] tracking-tight leading-tight">
            Olá, Lindemberg. <span className="text-[#cfa030] drop-shadow-sm">{greeting}!</span>
          </h1>
        </div>

        {/* Secção do Título - Fundo Claro e Texto Escuro (Máximo Contraste) */}
        <section className="mb-8 bg-white p-6 md:p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1e3a8a] leading-[1.1] uppercase break-words hyphens-auto">
            {currentRifa.name}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#1e3a8a] text-white px-4 py-2.5 rounded-xl font-bold text-sm md:text-base shadow-md">
              <Calendar className="w-5 h-5 text-[#cfa030]" />
              <span>{currentRifa.startDate} — {currentRifa.endDate}</span>
            </div>
          </div>
        </section>

        {/* Bento Grid Técnico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Gráfico Principal com Fundo Branco */}
          <div className="lg:col-span-8 bg-white p-6 md:p-10 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-sm font-black tracking-widest text-slate-400 uppercase">Distribuição de Números</h3>
              <div className="bg-[#1e3a8a] text-white px-4 py-2 rounded-lg">
                <span className="text-xl font-black">20.000</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="relative w-64 h-64 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius="70%"
                      outerRadius="100%"
                      strokeWidth={0}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#1e3a8a]">20k</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-md" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-black text-[#1e3a8a] uppercase tracking-wide">{item.name}</span>
                    </div>
                    <span className="text-lg font-black text-[#1e3a8a] italic">
                      {((item.value / 20000) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna de Ações e Metas */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            <button className="flex flex-col items-center justify-center p-8 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] rounded-[2rem] shadow-lg shadow-[#cfa030]/20 transition-all active:scale-95 group border-b-4 border-black/10">
              <span className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-60">Operação</span>
              <span className="text-2xl font-black flex items-center gap-2">VENDER <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
            </button>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Meta da Edição</p>
              <div className="flex items-baseline gap-2 text-[#1e3a8a] mb-4">
                <span className="text-4xl font-black">75k</span>
                <span className="text-lg font-bold opacity-30">EUR/BRL</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                <div className="bg-[#cfa030] h-full w-[66%] rounded-full shadow-[0_0_12px_rgba(207,160,48,0.4)]"></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
              <Package className="absolute -right-6 -bottom-6 text-slate-100 w-32 h-32 transition-transform group-hover:scale-110 duration-500" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 relative z-10">Stock de Blocos</p>
              <div className="text-[#1e3a8a] relative z-10">
                <span className="text-4xl font-black tracking-tighter">833</span>
                <span className="text-md font-bold opacity-30 ml-2">unid.</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}