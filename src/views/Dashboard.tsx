import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, ChevronRight, Calendar, Menu } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export function Dashboard({ setActiveTab }: DashboardProps) {

  // Dados da rifa (Simulados)
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
    { name: 'Vendidos', value: 10000, color: '#cfa030' },
    { name: 'Com Revendedores', value: 5000, color: '#ffffff' },
    { name: 'Disponíveis', value: 5000, color: '#1e3a8a' }
  ];

  // Lógica de saudação dinâmica
  const currentHour = new Date().getHours();
  let greeting = 'Boa noite';
  if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Bom dia';
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Boa tarde';
  }

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter']">

      {/* Barra de Navegação Superior */}
      <header className="bg-[#1e3a8a] text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-4">
          <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-xl font-black tracking-tight uppercase">RifaoCon</span>
        </div>

        {/* Foto de Perfil - Clique para Admin */}
        <button
          onClick={() => setActiveTab('admin')}
          className="w-10 h-10 rounded-full border-2 border-[#cfa030] overflow-hidden hover:scale-105 transition-transform shadow-lg"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lindemberg&backgroundColor=1e3a8a"
            alt="Perfil"
            className="w-full h-full object-cover bg-white"
          />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-32 md:pb-16 w-full">

        {/* Saudação Minimalista */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-[#1e3a8a] tracking-tight leading-tight">
            Olá, Lindemberg.<br className="md:hidden" /> <span className="text-[#cfa030] font-medium">{greeting}!</span>
          </h1>
        </div>

        {/* Secção do Rifão - Responsiva e Limpa */}
        <section className="mb-8 md:mb-12 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-start w-full">
          <div className="w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase text-[#1e3a8a] leading-[1.1] break-words overflow-hidden">
              {currentRifa.name}
            </h2>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-white font-medium bg-[#1e3a8a] w-fit px-3 md:px-4 py-2 md:py-2.5 rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#cfa030]" />
            <span>{currentRifa.startDate}</span>
            <span className="text-white/40 mx-0.5">—</span>
            <span>{currentRifa.endDate}</span>
          </div>
        </section>

        {/* Grelha Técnica (Gráfico e Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Donut Chart */}
          <div className="lg:col-span-8 p-6 md:p-8 lg:p-10 rounded-3xl relative overflow-hidden bg-[#1e3a8a] border border-[#cfa030]/20 shadow-lg">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-xs md:text-sm font-bold tracking-[0.15em] text-white/50 uppercase">Distribuição de Números</h3>
              <div className="text-right">
                <span className="block text-xl md:text-2xl font-black text-white leading-none">20.000</span>
                <span className="text-[10px] font-bold text-[#cfa030] uppercase tracking-widest">Total</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="relative w-52 h-52 md:w-64 md:h-64 flex-shrink-0 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius="65%"
                      outerRadius="100%"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth={2}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#fff', color: '#1e3a8a' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white mt-1">20k</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full">
                {chartData.map((item, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm font-bold text-white/80 uppercase tracking-wide">{item.name}</span>
                    </div>
                    <span className="font-black text-white">{(item.value / 1000).toFixed(1)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Laterais */}
          <div className="lg:col-span-4 grid grid-cols-1 gap-6">
            <button className="flex flex-col items-center justify-center p-8 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] rounded-3xl shadow-xl transition-transform active:scale-95 group">
              <span className="text-xs uppercase tracking-widest mb-1 font-black opacity-70">Operação</span>
              <span className="text-xl font-black flex items-center gap-2">Registrar Venda <ChevronRight className="w-5 h-5" /></span>
            </button>

            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Meta Financeira</p>
              <div className="flex items-baseline gap-1 text-[#1e3a8a]">
                <span className="text-lg font-bold opacity-50">R$</span>
                <span className="text-3xl font-black tracking-tight">75k</span>
              </div>
              <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-[#cfa030] h-full w-[66%] rounded-full"></div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
              <Package className="absolute -right-4 -bottom-4 text-slate-100 w-24 h-24" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Blocos Impressos</p>
              <div className="text-[#1e3a8a]">
                <span className="text-3xl font-black">833</span>
                <span className="text-sm font-bold opacity-40 ml-1">unid.</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}