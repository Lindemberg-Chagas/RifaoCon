import { Search, ChevronRight, Package, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ text: string; type: 'paid' | 'reseller' | 'available' | 'error' } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm) return;
    
    setIsSearching(true);
    setResult(null);
    
    // Mock Search Simulation
    setTimeout(() => {
      setIsSearching(false);
      const num = parseInt(searchTerm);
      if (isNaN(num)) {
        setResult({ text: 'Entrada inválida', type: 'error' });
        return;
      }
      
      if (num > 20000 || num < 1) {
        setResult({ text: 'Fora do intervalo', type: 'error' });
      } else if (num < 1000) {
        setResult({ text: 'Vendido / Pago', type: 'paid' });
      } else if (num < 5000) {
        setResult({ text: 'Com Revendedor: Daniela M.', type: 'reseller' });
      } else if (num < 10000) {
        setResult({ text: 'Disponível na Igreja', type: 'available' });
      } else {
        setResult({ text: 'Vendido / Pago', type: 'paid' });
      }
    }, 600);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-32 md:pb-16 min-h-screen flex flex-col items-center text-white">
      
      {/* Title */}
      <section className="mb-10 text-center w-full">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">Busca Universal</h1>
        <p className="text-white/60 font-medium text-sm md:text-base max-w-lg mx-auto">Consulte instantaneamente o paradeiro de qualquer bilhete ou confira os blocos que retornaram à paróquia.</p>
      </section>

      {/* Big Search Input */}
      <section className="w-full mb-12">
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.15)] group">
          <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
            <Search className="text-[#cfa030] w-6 h-6 md:w-8 md:h-8" />
          </div>
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e3a8a] border-2 border-[#cfa030]/50 rounded-2xl py-5 md:py-6 pl-14 md:pl-20 pr-4 md:pr-6 text-white placeholder:text-white/30 focus:ring-4 focus:ring-[#cfa030]/20 focus:border-[#cfa030] transition-all duration-300 font-mono text-2xl md:text-3xl outline-none text-center shadow-lg" 
            placeholder="Ex: 12345" 
            type="text"
            inputMode="numeric"
            maxLength={5}
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="absolute inset-y-2 right-2 bg-[#cfa030] text-[#1e3a8a] px-6 md:px-8 rounded-xl font-black uppercase tracking-wider text-sm hover:bg-[#b58b29] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[100px]"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Buscar'}
          </button>
        </form>
      </section>

      {/* Result Card */}
      {result && (
        <section className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 mb-16">
          <div className={`p-6 md:p-8 rounded-2xl border text-center flex flex-col items-center justify-center gap-3 shadow-xl ${
            result.type === 'paid' ? 'bg-[#1e3a8a] border-[#cfa030] shadow-[0_0_20px_rgba(207,160,48,0.15)]' : 
            result.type === 'reseller' ? 'bg-[#1e3a8a] border-white' : 
            result.type === 'available' ? 'bg-[#1e3a8a] border border-white/20' : 
            'bg-[#1e3a8a] border-red-500/50 text-red-100'
          }`}>
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
              result.type === 'paid' ? 'bg-[#cfa030]/20' : 
              result.type === 'reseller' ? 'bg-white/10' : 
              result.type === 'available' ? 'bg-white/5 border border-white/20' : 
              'bg-red-500/20'
            }`}>
              {result.type === 'error' ? 
                <AlertCircle className="w-8 h-8 text-red-400" /> : 
                <Package className={`w-8 h-8 ${result.type === 'paid' ? 'text-[#cfa030]' : 'text-white'}`} />
              }
            </div>
            
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Status do Bilhete {searchTerm}</span>
            <h3 className={`text-xl md:text-2xl font-black ${result.type === 'paid' ? 'text-[#cfa030]' : 'text-white'}`}>
              {result.text}
            </h3>
          </div>
        </section>
      )}

      {/* Orphão Blocks List */}
      <section className="w-full text-left max-w-4xl opacity-90">
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-xl md:text-2xl font-black text-white">Blocos Órfãos / Devolvidos</h3>
          <span className="bg-[#cfa030] text-[#1e3a8a] text-xs font-bold px-2.5 py-1 rounded-full">3 Blocos</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#1e3a8a] p-5 rounded-xl border border-white/20 flex flex-col items-start gap-4 hover:border-white transition-colors cursor-pointer group">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-mono text-white font-bold tracking-widest border border-white/10">01201 - 01220</div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Motivo do Retorno</p>
              <p className="text-sm font-medium text-white">Devolvido sem tentativa de venda por D. Marta.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-[#cfa030] group-hover:text-white mt-2 flex items-center gap-1 transition-colors">Reatribuir <ChevronRight className="w-4 h-4"/></button>
          </div>
          
          <div className="bg-[#1e3a8a] p-5 rounded-xl border border-white/20 flex flex-col items-start gap-4 hover:border-white transition-colors cursor-pointer group">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-mono text-white font-bold tracking-widest border border-white/10">08950 - 08970</div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Motivo do Retorno</p>
              <p className="text-sm font-medium text-white">Revendedor ausente, transferido para secretaria.</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-[#cfa030] group-hover:text-white mt-2 flex items-center gap-1 transition-colors">Reatribuir <ChevronRight className="w-4 h-4"/></button>
          </div>
          
          <div className="bg-[#1e3a8a] p-5 rounded-xl border border-white/20 flex flex-col items-start gap-4 hover:border-white transition-colors cursor-pointer group">
            <div className="bg-white/10 px-3 py-1.5 rounded-lg text-sm font-mono text-white font-bold tracking-widest border border-white/10">14500 - 14520</div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Motivo do Retorno</p>
              <p className="text-sm font-medium text-white">Vendas muito lentas (11 sobrando).</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-[#cfa030] group-hover:text-white mt-2 flex items-center gap-1 transition-colors">Reatribuir <ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </section>

    </main>
  );
}
