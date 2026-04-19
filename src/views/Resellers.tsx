import { Search, Plus, MessageCircle, Ticket, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Resellers() {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [activeRaffle, setActiveRaffle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAlert, setCustomAlert] = useState<string | null>(null);

  // AJUSTE: Estado para detectar o teclado no mobile
  const [isSearching, setIsSearching] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBlockCount, setNewBlockCount] = useState('');
  const [newRangeStart, setNewRangeStart] = useState('');

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedBondoso, setSelectedBondoso] = useState<any>(null);
  const [soldTickets, setSoldTickets] = useState('');
  const [collectedAmount, setCollectedAmount] = useState('');

  const NUMEROS_POR_BLOCO = 12;

  useEffect(() => {
    fetchActiveRaffleAndBondosos();
  }, []);

  const fetchActiveRaffleAndBondosos = async () => {
    setIsLoading(true);
    try {
      const { data: raffle } = await supabase.from('raffles').select('*').eq('is_active', true).single();
      if (raffle) {
        setActiveRaffle(raffle);
        const { data: bondosos, error } = await supabase.from('bondosos').select('*').eq('raffle_id', raffle.id).order('created_at', { ascending: false });
        if (error) throw error;
        setBondososList(bondosos || []);
      }
    } catch (error) {
      console.error("Erro ao sincronizar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formattedValue = value;
    if (value.length > 2) formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    setNewPhone(formattedValue);
  };

  const handleOpenModal = () => {
    if (!activeRaffle) return setCustomAlert("Erro: Nenhuma rifa ativa encontrada.");
    let maxEndNum = 0;
    if (bondososList.length > 0) {
      maxEndNum = Math.max(...bondososList.map(b => parseInt(b.range?.split(' - ')[1], 10) || 0));
    }
    setNewRangeStart((Math.ceil((maxEndNum + 1) / NUMEROS_POR_BLOCO) * NUMEROS_POR_BLOCO).toString());
    setIsModalOpen(true);
  };

  const handleAddBondoso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRaffle) return;
    const startNum = parseInt(newRangeStart, 10);
    const endNum = startNum + (parseInt(newBlockCount, 10) * NUMEROS_POR_BLOCO) - 1;
    const { data, error } = await supabase.from('bondosos').insert([{
      name: newName, phone: newPhone.replace(/\D/g, ''),
      range: `${String(startNum).padStart(5, '0')} - ${String(endNum).padStart(5, '0')}`,
      raffle_id: activeRaffle.id, status: 'pending', status_label: 'Pendente',
      sold_tickets: 0, collected_amount: 0
    }]).select();
    if (!error && data) { setBondososList([data[0], ...bondososList]); setIsModalOpen(false); }
  };

  const handleAccountabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('bondosos').update({
      status: 'paid', status_label: 'Tudo Pago',
      sold_tickets: parseInt(soldTickets, 10),
      collected_amount: parseFloat(collectedAmount.replace(',', '.'))
    }).eq('id', selectedBondoso.id).select();
    if (!error && data) { setBondososList(bondososList.map(b => b.id === selectedBondoso.id ? data[0] : b)); setIsAccountModalOpen(false); }
  };

  const filteredBondosos = bondososList.filter((b) => {
    const s = searchTerm.toLowerCase().trim();
    return !s || b.name.toLowerCase().includes(s) || (b.phone && b.phone.includes(s)) || (b.range && b.range.includes(s));
  });

  const previewText = `${String(parseInt(newRangeStart, 10) || 0).padStart(5, '0')} - ${String((parseInt(newRangeStart, 10) || 0) + (parseInt(newBlockCount, 10) || 0) * 12 - 1).padStart(5, '0')}`;

  return (
    // AJUSTE: Padding-bottom aumenta dinamicamente quando você está pesquisando (isSearching)
    <main className={`flex-1 w-full max-w-5xl mx-auto px-5 pt-10 min-h-screen transition-all duration-300 ${isSearching ? 'pb-[70vh]' : 'pb-40'}`}>
      <div className="mb-6">
        <h2 className="text-5xl font-black tracking-tight text-[#1e3a8a]">Bondosos</h2>
        <p className="text-[#cfa030] font-black uppercase text-xs mt-2 bg-[#1e3a8a]/5 px-4 py-2 rounded-full w-fit">Campanha: {activeRaffle?.name || '...'}</p>
      </div>

      {/* AJUSTE: Barra de Busca STICKY (Fixa no topo ao rolar) */}
      <div className="sticky top-[80px] z-30 mb-10 bg-[#5e85f0] p-6 md:p-10 rounded-[2rem] shadow-xl text-white">
        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-3">Busca Rápida</label>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-6 h-6" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // AJUSTE: Detecta quando o teclado abre/fecha
            onFocus={() => setIsSearching(true)}
            onBlur={() => setTimeout(() => setIsSearching(false), 200)}
            className="w-full bg-[#5e85f0] border border-white/20 rounded-xl py-4 pl-14 pr-6 text-xl font-bold outline-none placeholder:text-white/30"
            placeholder="Número ou nome..."
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? <div className="text-center py-20 font-black opacity-30 animate-pulse">Sincronizando...</div> : filteredBondosos.map((reseller) => (
          <div key={reseller.id} className="p-8 bg-[#5e85f0] rounded-[3rem] border border-white/10 shadow-lg flex flex-col gap-8 text-white animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#cfa030] text-[#1e3a8a] flex items-center justify-center font-black text-3xl uppercase">{reseller.name.charAt(0)}</div>
              <div className="overflow-hidden">
                <p className="font-black text-2xl leading-tight truncate">{reseller.name}</p>
                <div className="flex items-center gap-3 text-[#cfa030] mt-2"><Ticket className="w-6 h-6" /><span className="font-bold text-xl">{reseller.range}</span></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => window.open(`https://wa.me/55${reseller.phone}`, '_blank')} className="flex-1 bg-white/10 border border-white/10 py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase text-sm tracking-widest">WhatsApp</button>
              {reseller.status === 'pending' ? (
                <button onClick={() => { setSelectedBondoso(reseller); setIsAccountModalOpen(true); }} className="flex-1 bg-[#cfa030] text-[#1e3a8a] py-6 rounded-3xl font-black uppercase text-sm tracking-widest">Dar Baixa</button>
              ) : <div className="flex-1 bg-emerald-500/10 text-emerald-400 py-6 rounded-3xl flex items-center justify-center font-black uppercase text-sm tracking-widest">Pago ✓</div>}
            </div>
          </div>
        ))}
      </div>

      {/* AJUSTE: Ocultar o botão + enquanto pesquisa para liberar visão */}
      {!isSearching && (
        <button onClick={handleOpenModal} className="fixed bottom-32 right-6 w-20 h-20 bg-[#cfa030] text-[#1e3a8a] rounded-3xl shadow-2xl flex items-center justify-center border-4 border-white transition-all active:scale-95"><Plus className="w-10 h-10 stroke-[3]" /></button>
      )}

      {/* --- MODAIS E ALERTAS MANTIDOS IGUAIS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#5e85f0] px-8 py-6 flex items-center justify-between text-white"><h3 className="text-2xl font-black uppercase">Novo Bondoso</h3><button onClick={() => setIsModalOpen(false)}><X /></button></div>
            <form onSubmit={handleAddBondoso} className="p-8 space-y-6">
              <div><label className="block text-[#1e3a8a] text-xs font-black uppercase mb-2">Nome Completo</label><input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl text-[#1e3a8a] font-black outline-none focus:border-[#cfa030]" required /></div>
              <div><label className="block text-[#1e3a8a] text-xs font-black uppercase mb-2">WhatsApp</label><input type="tel" value={newPhone} onChange={handlePhoneChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl text-[#1e3a8a] font-black outline-none focus:border-[#cfa030]" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-[#1e3a8a] text-xs font-black uppercase mb-2">Blocos</label><input type="number" value={newBlockCount} onChange={(e) => setNewBlockCount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl text-[#1e3a8a] font-black outline-none" required /></div>
                <div><label className="block text-[#1e3a8a] text-xs font-black uppercase mb-2">Nº Inicial</label><input type="number" value={newRangeStart} onChange={(e) => setNewRangeStart(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl text-[#1e3a8a] font-black outline-none border-[#cfa030]" required /></div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 flex justify-between items-center"><span className="text-sm font-black text-[#1e3a8a] uppercase">Faixa</span><span className="text-2xl font-black text-[#1e3a8a] font-mono">{previewText}</span></div>
              <div className="flex gap-4 mt-10"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-slate-100 text-[#1e3a8a] font-black rounded-2xl uppercase">Cancelar</button><button type="submit" className="flex-1 py-6 bg-[#cfa030] text-[#1e3a8a] font-black rounded-2xl uppercase shadow-lg">Salvar</button></div>
            </form>
          </div>
        </div>
      )}

      {isAccountModalOpen && selectedBondoso && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 overflow-hidden">
            <div className="bg-emerald-600 px-8 py-6 flex items-center justify-between text-white"><h3 className="text-2xl font-black uppercase">Baixa</h3><button onClick={() => setIsAccountModalOpen(false)}><X /></button></div>
            <form onSubmit={handleAccountabilitySubmit} className="p-10 space-y-6 text-[#1e3a8a]">
              <div><p className="text-3xl font-black leading-tight">{selectedBondoso.name}</p><p className="font-black text-lg opacity-60">Bloco: {selectedBondoso.range}</p></div>
              <div><label className="block text-xs font-black uppercase mb-2">Vendidos</label><input type="number" value={soldTickets} onChange={(e) => setSoldTickets(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-black" required /></div>
              <div><label className="block text-xs font-black uppercase mb-2">Recebido (R$)</label><input type="text" value={collectedAmount} onChange={(e) => setCollectedAmount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-black" required /></div>
              <button type="submit" className="w-full mt-10 py-6 bg-emerald-600 text-white font-black rounded-3xl uppercase text-lg flex items-center justify-center gap-4"><CheckCircle2 className="w-8 h-8" /> Confirmar</button>
            </form>
          </div>
        </div>
      )}

      {customAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95"><p className="text-[#1e3a8a] text-2xl font-black leading-relaxed mb-6">{customAlert}</p><button onClick={() => setCustomAlert(null)} className="w-full py-6 bg-[#cfa030] text-[#1e3a8a] font-black rounded-2xl uppercase tracking-widest shadow-md">Entendido</button></div>
        </div>
      )}

      <div className="mt-8 text-center pb-8 opacity-30 italic font-bold text-[#1e3a8a] uppercase text-xs">Fim da Lista Ativa</div>
    </main>
  );
}