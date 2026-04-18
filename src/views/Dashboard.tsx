import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Package, Banknote, UserPlus, ChevronRight, Calendar, Settings } from 'lucide-react';

export function Dashboard() {
  const chartData = [
    { name: 'Vendidos', value: 10000, color: '#cfa030' },
    { name: 'Com Revendedores', value: 5000, color: '#ffffff' },
    { name: 'Disponíveis', value: 5000, color: '#1e3a8a' }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-32 md:pb-16 w-full text-white">
      {/* Header Section - Rifão Ativo & Total Arrecadado */}
      <section className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2 md:mb-3">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#cfa030] animate-pulse shadow-[0_0_8px_rgba(207,160,48,0.5)]"></span>
            <span className="text-[#cfa030] font-bold text-sm md:text-base tracking-[0.15em] uppercase mt-0.5">Edição Ativa</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase mb-3 md:mb-4 text-[#1e3a8a]">
            Rifão de Inverno
          </h2>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm md:text-base text-white/80 font-medium bg-[#1e3a8a] w-fit px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-white/20">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
            <span>15 Junho, 2026</span>
            <span className="text-white/50 mx-1">—</span>
            <span>30 Agosto, 2026</span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end bg-[#1e3a8a] p-5 md:p-6 rounded-2xl border border-[#cfa030]/50 shadow-lg md:min-w-[300px] text-white">
          <p className="text-xs md:text-sm font-black text-[#cfa030] uppercase tracking-widest mb-1 md:mb-2 text-left md:text-right w-full">Total Arrecadado</p>
          <div className="flex items-baseline gap-1 md:gap-2 text-left md:text-right w-full justify-start md:justify-end">
            <span className="text-2xl md:text-3xl font-medium text-white/80">R$</span>
            <span className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-md">50.0k</span>
          </div>
          <div className="text-sm md:text-base text-white/70 font-medium mt-1 text-left md:text-right w-full">R$ 50.000,00</div>
          <div className="mt-4 md:mt-5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="bg-[#cfa030] h-full w-[66%] rounded-full shadow-[0_0_10px_rgba(207,160,48,0.5)]"></div>
          </div>
        </div>
      </section>

      {/* Technical Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pie Chart Section (Technical Monolith) */}
        <div className="lg:col-span-8 sleek-card p-6 md:p-8 lg:p-10 relative overflow-hidden group border border-[#cfa030]/20 shadow-lg">

          <div className="flex justify-between items-start mb-8 md:mb-10">
            <h3 className="text-sm md:text-base font-bold tracking-[0.15em] text-white/60 uppercase">Distribuição do Rifão</h3>
            <div className="bg-[#1e3a8a] text-white px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold border border-white/20 flex flex-col items-end shadow-sm">
              <span className="uppercase tracking-wider opacity-80 text-[10px] md:text-xs">Unidade Simples</span>
              <span className="text-lg md:text-2xl font-black text-white">20.000 <span className="text-xs md:text-sm font-bold uppercase opacity-80 font-mono">Números</span></span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* The Chart - Recharts Donut */}
            <div className="relative w-52 h-52 md:w-60 md:h-60 lg:w-72 lg:h-72 flex-shrink-0 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="100%"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={2}
                    paddingAngle={2}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', backgroundColor: '#1e3a8a', color: '#fff' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white mt-2">20k</span>
                <span className="text-xs md:text-sm font-bold text-white/60 uppercase tracking-[0.1em] mt-1 text-center leading-tight">Total<br className="hidden md:block" /> de Números</span>
              </div>
            </div>

            {/* Legend - Detailed Bento Style */}
            <div className="flex flex-col gap-3 md:gap-4 w-full z-10">

              <div className="bg-[#1e3a8a] p-4 rounded-xl border border-[#cfa030]/40 hover:border-[#cfa030] transition-colors shadow-sm cursor-default">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#cfa030] shadow-[0_0_8px_rgba(207,160,48,0.6)] transform scale-125"></div>
                    <p className="text-sm md:text-base font-bold text-white uppercase tracking-wide">Vendidos / Pagos</p>
                  </div>
                  <span className="text-base md:text-lg font-black text-[#cfa030]">50%</span>
                </div>
                <div className="pl-6 md:pl-7 flex gap-4 md:gap-6 mt-1">
                  <div>
                    <span className="block text-xl md:text-2xl font-black text-white leading-none">10.000</span>
                    <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-wider">Números</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a8a] p-4 rounded-xl border border-white/40 hover:border-white transition-colors shadow-sm cursor-default">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-white shadow-sm transform scale-125"></div>
                    <p className="text-sm md:text-base font-bold text-white uppercase tracking-wide">Com Revendedores</p>
                  </div>
                  <span className="text-base md:text-lg font-black text-white">25%</span>
                </div>
                <div className="pl-6 md:pl-7 flex gap-4 md:gap-6 mt-1">
                  <div>
                    <span className="block text-xl md:text-2xl font-black text-white leading-none">5.000</span>
                    <span className="text-[10px] md:text-xs font-bold text-white/50 uppercase tracking-wider">Números</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1e3a8a] p-4 rounded-xl border border-white/10 hover:border-white/30 transition-colors shadow-sm cursor-default">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#1e3a8a] border border-white/50 shadow-sm transform scale-125"></div>
                    <p className="text-sm md:text-base font-bold text-white/60 uppercase tracking-wide">Disponíveis</p>
                  </div>
                  <span className="text-base md:text-lg font-black text-white/50">25%</span>
                </div>
                <div className="pl-6 md:pl-7 flex gap-4 md:gap-6 mt-1">
                  <div>
                    <span className="block text-xl md:text-2xl font-black text-white/70 leading-none">5.000</span>
                    <span className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-wider">Números</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards / Goal */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-4 md:gap-6">
          <button className="flex flex-col items-center justify-center p-6 md:p-8 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] font-black rounded-xl md:rounded-2xl shadow-xl transition-all active:scale-95 group">
            <span className="text-sm md:text-base uppercase tracking-[0.15em] mb-2 font-bold opacity-80">Ação Rápida</span>
            <span className="text-xl md:text-2xl flex items-center gap-2">Registrar Venda <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </button>

          {/* Meta */}
          <div className="sleek-card p-5 md:p-6 flex flex-col justify-center border-white/10 bg-[#1e3a8a]">
            <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2 md:mb-3">Meta da Rifa</p>
            <div className="flex items-baseline gap-1">
              <span className="text-lg md:text-xl font-medium text-white/60">R$</span>
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white">75k</span>
            </div>
          </div>

          {/* Blocos */}
          <div className="sleek-card p-5 md:p-6 flex flex-col justify-center relative overflow-hidden border-white/10 bg-[#1e3a8a]">
            <Package className="absolute -right-2 -bottom-2 text-white/5 w-20 h-20 md:w-24 md:h-24 stroke-[1.5]" />
            <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2 md:mb-3 relative z-10">Total de Blocos</p>
            <div className="flex items-baseline gap-1 relative z-10">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-white">833</span>
              <span className="text-sm font-medium text-white/60">x</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
