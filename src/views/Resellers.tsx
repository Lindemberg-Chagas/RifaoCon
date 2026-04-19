import { Search, Plus, MessageCircle, Ticket, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Resellers() {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Novo Estado para o Campo de Busca
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do Modal de Cadastro
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBlockCount, setNewBlockCount] = useState('');
  const [newRangeStart, setNewRangeStart] = useState('');

  // Estados do Modal de Prestação de Contas
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [selectedBondoso, setSelectedBondoso] = useState<any>(null);
  const [soldTickets, setSoldTickets] = useState('');
  const [collectedAmount, setCollectedAmount] = useState('');

  const NUMEROS_POR_BLOCO = 12;

  useEffect(() => {
    fetchBondosos();
  }, []);

  const fetchBondosos = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bondosos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("Erro ao buscar dados:", error);
    else setBondososList(data || []);
    setIsLoading(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formattedValue = value;
    if (value.length > 2) formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    setNewPhone(formattedValue);
  };

  const handleAddBondoso = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = newPhone.replace(/\D/g, '');

    if (!newName || !phoneDigits || !newBlockCount || !newRangeStart) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (phoneDigits.length < 10) {
      alert("Por favor, insira um número válido com DDD.");
      return;
    }

    const startNum = parseInt(newRangeStart, 10);
    const blocks = parseInt(newBlockCount, 10);
    const endNum = startNum + (blocks * NUMEROS_POR_BLOCO) - 1;
    const startFormatted = String(startNum).padStart(5, '0');
    const endFormatted = String(endNum).padStart(5, '0');

    const newBondoso = {
      name: newName,
      phone: phoneDigits,
      range: `${startFormatted} - ${endFormatted}`,
      status: 'pending',
      status_label: 'Pendente',
      sold_tickets: 0,
      collected_amount: 0
    };

    const { data, error } = await supabase.from('bondosos').insert([newBondoso]).select();

    if (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar no banco de dados.");
    } else if (data) {
      setBondososList([data[0], ...bondososList]);
      setNewName(''); setNewPhone(''); setNewBlockCount(''); setNewRangeStart('');
      setIsModalOpen(false);
    }
  };

  const openAccountability = (bondoso: any) => {
    setSelectedBondoso(bondoso);
    setSoldTickets('');
    setCollectedAmount('');
    setIsAccountModalOpen(true);
  };

  const handleAccountabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!soldTickets || !collectedAmount) {
      alert("Preencha a quantidade vendida e o valor recebido.");
      return;
    }

    const sold = parseInt(soldTickets, 10);
    const amount = parseFloat(collectedAmount.replace(',', '.'));

    const { data, error } = await supabase
      .from('bondosos')
      .update({
        status: 'paid',
        status_label: 'Tudo Pago',
        sold_tickets: sold,
        collected_amount: amount
      })
      .eq('id', selectedBondoso.id)
      .select();

    if (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao salvar a prestação de contas.");
    } else if (data) {
      setBondososList(bondososList.map(b => b.id === selectedBondoso.id ? data[0] : b));
      setIsAccountModalOpen(false);
      setSelectedBondoso(null);
    }
  };

  // --- LÓGICA DE FILTRAGEM (MOTOR DE BUSCA) ---
  const filteredBondosos = bondososList.filter((bondoso) => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true; // Se não tiver busca, mostra todos

    // 1. Tenta achar no Nome do Bondoso
    if (bondoso.name.toLowerCase().includes(searchLower)) return true;

    // 2. Tenta achar no Número de WhatsApp
    if (bondoso.phone && bondoso.phone.includes(searchLower)) return true;

    // 3. Tenta achar se o número digitado está dentro da faixa do bondoso (ex: 508 dentro de 500-511)
    const searchNum = parseInt(searchLower, 10);
    if (!isNaN(searchNum) && bondoso.range) {
      const [startStr, endStr] = bondoso.range.split(' - ');
      if (startStr && endStr) {
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (searchNum >= start && searchNum <= end) return true;
      }
    }

    return false;
  });

  const previewStart = parseInt(newRangeStart, 10) || 0;
  const previewBlocks = parseInt(newBlockCount, 10) || 0;
  const previewEnd = previewBlocks > 0 ? previewStart + (previewBlocks * NUMEROS_POR_BLOCO) - 1 : 0;
  const previewText = (newRangeStart && newBlockCount)
    ? `${String(previewStart).padStart(5, '0')} - ${String(previewEnd).padStart(5, '0')}`
    : '00000 - 00000';

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 pt-28 md:pt-36 pb-32 md:pb-16 min-h-screen relative text-white">

      <div className="mb-8 md:mb-10 flex flex-col gap-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white">Bondosos</h2>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <div className="bg-[#1e3a8a] px-4 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-sm border border-white/20">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-white"></span>
            <span className="text-xs md:text-sm font-bold tracking-tight uppercase text-white">
              Finalizado {bondososList.filter(b => b.status === 'paid').length}
            </span>
          </div>
          <div className="bg-[#1e3a8a] px-4 py-2.5 md:py-3 rounded-xl flex items-center gap-2 shadow-sm border border-[#cfa030]/50">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#cfa030]"></span>
            <span className="text-xs md:text-sm font-bold tracking-tight uppercase text-[#cfa030]">
              Pendentes {bondososList.filter(b => b.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-8 md:mb-10 bg-[#1e3a8a] p-6 md:p-8 rounded-xl shadow-lg border border-white/20">
        <label className="text-xs md:text-sm font-black text-white/70 uppercase tracking-widest block mb-3">Busca Rápida de Número</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 md:left-5 flex items-center pointer-events-none">
            <Search className="text-white/50 w-5 h-5 md:w-6 md:h-6" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e3a8a] border border-white/20 rounded-xl py-4 md:py-5 pl-12 md:pl-16 pr-4 md:pr-6 text-base md:text-lg focus:ring-2 focus:ring-[#cfa030] transition-all duration-200 placeholder:text-white/30 outline-none block font-medium text-white shadow-inner"
            placeholder="Digite o número (ex: 00508) ou o nome do bondoso..."
            type="text"
          />
        </div>
      </div>

      <div className="space-y-3 md:space-y-4">
        <div className="hidden md:grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[#cfa030] border-b border-[#cfa030]/20 mb-2">
          <div className="col-span-4">Nome do Bondoso</div>
          <div className="col-span-3">Números Alocados</div>
          <div className="col-span-3 text-left pl-2">Status</div>
          <div className="col-span-2 text-right pr-2">Ações</div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-[#cfa030] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/50 font-bold uppercase tracking-widest text-xs">Carregando do banco...</p>
          </div>
        ) : filteredBondosos.length === 0 ? (
          <div className="text-center py-10 bg-[#1e3a8a] rounded-xl border border-white/10">
            <p className="text-white/50 font-bold uppercase tracking-widest text-sm">
              {searchTerm ? 'Nenhum bondoso encontrado para esta busca.' : 'Nenhum bondoso cadastrado ainda.'}
            </p>
          </div>
        ) : (
          filteredBondosos.map((reseller, i) => (
            <div key={reseller.id || i} className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-4 md:px-5 py-4 bg-[#1e3a8a] rounded-xl border border-white/20 hover:border-[#cfa030]/50 transition-all shadow-sm group">

              <div className="w-full md:col-span-4 flex items-center gap-3 mb-3 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white border border-white/30 group-hover:border-[#cfa030]/50 flex items-center justify-center font-bold text-lg shrink-0 transition-colors uppercase">
                  {reseller.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <p className="font-bold text-base text-white truncate">{reseller.name}</p>
                  {reseller.status === 'paid' && reseller.sold_tickets > 0 && (
                    <span className="text-[10px] text-[#cfa030] font-black uppercase tracking-widest">
                      Vendeu {reseller.sold_tickets} núm.
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full md:col-span-3 flex items-center mb-3 md:mb-0">
                <div className="flex items-center gap-2 bg-[#1e3a8a] border border-white/10 px-3 py-1.5 rounded-lg text-white/80 font-mono text-sm max-w-fit">
                  <Ticket className="w-4 h-4 text-[#cfa030]" />
                  {reseller.range}
                </div>
              </div>

              <div className="w-full md:col-span-3 flex items-center mb-3 md:mb-0 md:pl-2">
                <span className={`px-3 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-lg border ${reseller.status === 'paid' ? 'bg-transparent text-white border-white/40' : 'bg-[#cfa030] text-[#1e3a8a] border-[#cfa030]'}`}>
                  {reseller.status_label}
                </span>
              </div>

              <div className="w-full md:col-span-2 flex justify-end gap-2 border-t border-white/10 md:border-none pt-3 md:pt-0">
                <button
                  onClick={() => window.open(`https://wa.me/55${reseller.phone}?text=Olá ${reseller.name}, estou entrando em contato sobre a rifa...`, '_blank')}
                  className="flex flex-1 md:flex-none justify-center items-center gap-2 px-3 py-2 bg-[#1e3a8a] border border-[#cfa030]/30 hover:border-[#cfa030] hover:bg-[#cfa030]/10 text-[#cfa030] rounded-lg transition-all font-bold text-xs uppercase"
                  title="Mensagem no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                {reseller.status === 'pending' && (
                  <button
                    onClick={() => openAccountability(reseller)}
                    className="flex items-center justify-center px-3 py-2 bg-emerald-600/20 border border-emerald-500/50 hover:bg-emerald-500 hover:text-white text-emerald-400 rounded-lg transition-all"
                    title="Prestar Contas"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 md:mt-12 text-center pb-8 md:pb-0">
        <p className="text-xs md:text-sm font-bold text-white/30 tracking-[0.1em] uppercase">Fim da Lista — {filteredBondosos.length} Registros</p>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 md:bottom-8 right-4 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] rounded-2xl md:rounded-full shadow-[0_10px_25px_rgba(207,160,48,0.3)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 z-40 border border-[#b58b29]"
        title="Entregar Novo Bloco"
      >
        <Plus className="w-6 h-6 md:w-8 md:h-8 stroke-[2.5]" />
      </button>

      {/* --- MODAL 1: CADASTRAR NOVO BONDOSO --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1e3a8a] px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Novo Bondoso</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddBondoso} className="p-6">
              <div className="mb-4">
                <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">Nome Completo</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: João da Silva" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-[#cfa030] focus:ring-1 focus:ring-[#cfa030] transition-all" required />
              </div>
              <div className="mb-5">
                <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">WhatsApp</label>
                <input type="tel" value={newPhone} onChange={handlePhoneChange} placeholder="Ex: (85) 99999-9999" maxLength={15} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-[#cfa030] focus:ring-1 focus:ring-[#cfa030] transition-all" required />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">Qtd. de Blocos</label>
                  <input type="number" value={newBlockCount} onChange={(e) => setNewBlockCount(e.target.value)} placeholder="Ex: 2" min="1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-[#cfa030] focus:ring-1 focus:ring-[#cfa030] transition-all" required />
                </div>
                <div>
                  <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">Número Inicial</label>
                  <input type="number" value={newRangeStart} onChange={(e) => setNewRangeStart(e.target.value)} placeholder="Ex: 500" min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-[#cfa030] focus:ring-1 focus:ring-[#cfa030] transition-all" required />
                </div>
              </div>
              <div className="mb-8 bg-slate-100 rounded-xl py-3 px-4 flex items-center justify-between border border-slate-200 border-dashed">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Faixa Gerada</span>
                <span className="text-[#1e3a8a] font-mono font-black text-sm">{previewText}</span>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] font-black rounded-xl transition-colors shadow-md">Salvar Bondoso</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: PRESTAÇÃO DE CONTAS --- */}
      {isAccountModalOpen && selectedBondoso && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-black text-white">Prestação de Contas</h3>
              <button onClick={() => setIsAccountModalOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 pb-2 border-b border-slate-100">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Revendedor</p>
              <p className="text-2xl font-black text-[#1e3a8a]">{selectedBondoso.name}</p>
              <p className="text-sm font-mono text-slate-500 mt-1">Bloco: {selectedBondoso.range}</p>
            </div>

            <form onSubmit={handleAccountabilitySubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">
                  Qtd. de Números Vendidos
                </label>
                <input
                  type="number"
                  value={soldTickets}
                  onChange={(e) => setSoldTickets(e.target.value)}
                  placeholder="Ex: 12"
                  min="0"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="mb-8">
                <label className="block text-[#1e3a8a] text-xs font-bold uppercase tracking-widest mb-2">
                  Valor Total Recebido (R$)
                </label>
                <input
                  type="text"
                  value={collectedAmount}
                  onChange={(e) => setCollectedAmount(e.target.value)}
                  placeholder="Ex: 120.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#1e3a8a] font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Confirmar Baixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}