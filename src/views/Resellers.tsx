import { Search, Plus, MessageCircle, MoreHorizontal, Ticket } from 'lucide-react';

export function Resellers() {
  const resellersList = [
    { name: 'Anderson Silva', range: '00500 - 00512', status: 'paid', statusLabel: 'Tudo Pago' },
    { name: 'Beatriz Santos', range: '01050 - 01070', status: 'pending', statusLabel: 'Pendente' },
    { name: 'Carlos Eduardo', range: '03110 - 03130', status: 'paid', statusLabel: 'Tudo Pago' },
    { name: 'Daniela Moreira', range: '04000 - 04025', status: 'pending', statusLabel: 'Pendente' },
    { name: 'Fábio Júnior', range: '08900 - 08910', status: 'paid', statusLabel: 'Tudo Pago' },
  ];

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-32 md:pb-16 min-h-screen relative text-white">
      {/* Section Header */}
      <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
        <div>
          <span className="text-[#60a5fa] font-label text-xs md:text-sm tracking-[0.15em] uppercase font-bold mb-2 block">Gerenciamento // v2.4</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">Revendedores</h2>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="bg-[#1e3a8a] px-4 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-sm border border-white/20">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white"></span>
            <span className="text-xs md:text-sm font-bold tracking-tight uppercase text-white">Ativos 24</span>
          </div>
          <div className="bg-[#1e3a8a] px-4 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-sm border border-[#cfa030]/50">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#cfa030]"></span>
            <span className="text-xs md:text-sm font-bold tracking-tight uppercase text-[#cfa030]">Pendentes 08</span>
          </div>
        </div>
      </div>

      {/* Main Specialized Search Field */}
      <div className="mb-8 md:mb-10 bg-[#1e3a8a] p-6 md:p-8 rounded-xl shadow-lg border border-white/20">
        <label className="text-xs md:text-sm font-black text-white/70 uppercase tracking-widest block mb-3">Busca Rápida de Número</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none">
            <Search className="text-white/50 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <input 
            className="w-full bg-[#1e3a8a] border border-white/20 rounded-xl py-4 md:py-5 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg focus:ring-2 focus:ring-[#cfa030] transition-all duration-200 placeholder:text-white/30 outline-none block font-medium text-white shadow-inner" 
            placeholder="Digite o número (ex: 00508) para checar o revendedor..." 
            type="text"
          />
        </div>
      </div>

      {/* CRM List */}
      <div className="space-y-3 md:space-y-4">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#cfa030] border-b border-[#cfa030]/20 mb-2">
          <div className="col-span-4">Nome do Revendedor</div>
          <div className="col-span-3">Números Alocados</div>
          <div className="col-span-3 text-left pl-2">Status</div>
          <div className="col-span-2 text-right pr-2">Ações</div>
        </div>

        {resellersList.map((reseller, i) => (
          <div key={i} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-4 md:px-5 py-4 bg-[#1e3a8a] rounded-xl border border-white/20 hover:border-[#cfa030]/50 transition-all shadow-sm group">
            
            <div className="w-full md:col-span-4 flex items-center gap-3 mb-3 md:mb-0">
              <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white border border-white/30 group-hover:border-[#cfa030]/50 flex items-center justify-center font-bold text-lg shrink-0 transition-colors">
                {reseller.name.charAt(0)}
              </div>
              <p className="font-bold text-base text-white truncate">{reseller.name}</p>
            </div>
            
            <div className="w-full md:col-span-3 flex items-center mb-3 md:mb-0">
              <div className="flex items-center gap-2 bg-[#1e3a8a] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 font-mono text-sm max-w-fit">
                <Ticket className="w-4 h-4 text-[#cfa030]" />
                {reseller.range}
              </div>
            </div>
            
            <div className="w-full md:col-span-3 flex items-center mb-3 md:mb-0 md:pl-2">
              <span className={`px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg border ${reseller.status === 'paid' ? 'bg-transparent text-white border-white/40' : 'bg-[#cfa030] text-[#1e3a8a] border-[#cfa030]'}`}>
                {reseller.statusLabel}
              </span>
            </div>

            <div className="w-full md:col-span-2 flex justify-end gap-2 border-t border-white/10 md:border-none pt-3 md:pt-0">
              <button 
                className="flex flex-1 md:flex-none justify-center items-center gap-2 px-3 py-2 bg-[#1e3a8a] border border-[#cfa030]/30 hover:border-[#cfa030] hover:bg-[#cfa030]/10 text-[#cfa030] rounded-lg transition-all font-bold text-xs uppercase"
                title="Mensagem no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="md:hidden">Lembrar</span>
              </button>
              <button className="flex items-center justify-center px-2 py-2 bg-[#1e3a8a] border border-white/10 hover:bg-white/10 text-white/70 rounded-lg transition-all" title="Mais opções">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Empty State Tip */}
      <div className="mt-8 md:mt-12 text-center pb-8 md:pb-0">
        <p className="text-xs md:text-sm font-bold text-white/30 tracking-[0.1em] uppercase">Fim da Lista — 32 Registros</p>
      </div>

      {/* FAB: Floating Action Button */}
      <button 
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] rounded-2xl md:rounded-full shadow-[0_10px_25px_rgba(207,160,48,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-40 border border-[#b58b29]"
        aria-label="Adicionar novo revendedor"
        title="Entregar Novo Bloco"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
      </button>
    </main>
  );
}
