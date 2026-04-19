import { Search, Plus, MessageCircle, Ticket, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Resellers() {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para o Alerta Customizado (Acessibilidade +40)
  const [customAlert, setCustomAlert] = useState<string | null>(null);

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

  const handleOpenModal = () => {
    let nextAvailableStart = 0;
    if (bondososList.length > 0) {
      const maxEndNum = Math.max(...bondososList.map(b => {
        if (!b.range) return 0;
        const [, endStr] = b.range.split(' - ');
        return parseInt(endStr, 10) || 0;
      }));
      nextAvailableStart = maxEndNum + 1;
    }
    const alignedStart = Math.ceil(nextAvailableStart / NUMEROS_POR_BLOCO) * NUMEROS_POR_BLOCO;
    setNewRangeStart(alignedStart.toString());
    setNewBlockCount('1');
    setNewName('');
    setNewPhone('');
    setIsModalOpen(true);
  };

  // --- FUNÇÃO RESTAURADA: SALVAR NO BANCO ---
  const handleAddBondoso = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = newPhone.replace(/\D/g, '');

    if (!newName || !phoneDigits || !newBlockCount || !newRangeStart) {
      setCustomAlert("Por favor, preencha todos os campos.");
      return;
    }

    const startNum = parseInt(newRangeStart, 10);
    const blocks = parseInt(newBlockCount, 10);

    // Validação de múltiplo de 12
    if (startNum % NUMEROS_POR_BLOCO !== 0) {
      setCustomAlert(`O número inicial deve ser um múltiplo de ${NUMEROS_POR_BLOCO} (Ex: 0, 12, 24, 36...).`);
      return;
    }

    const endNum = startNum + (blocks * NUMEROS_POR_BLOCO) - 1;

    // Validação de Colisão (Sobreposição)
    const isOverlapping = bondososList.some(bondoso => {
      if (!bondoso.range) return false;
      const [exStart, exEnd] = bondoso.range.split(' - ').map(Number);
      return startNum <= exEnd && endNum >= exStart;
    });

    if (isOverlapping) {
      setCustomAlert("Estes números já foram entregues a outro bondoso!");
      return;
    }

    const startFormatted = String(startNum).padStart(5, '0');
    const endFormatted = String(endNum).padStart(5, '0');

    const { data, error } = await supabase.from('bondosos').insert([{
      name: newName,
      phone: phoneDigits,
      range: `${startFormatted} - ${endFormatted}`,
      status: 'pending',
      status_label: 'Pendente',
      sold_tickets: 0,
      collected_amount: 0
    }]).select();

    if (error) {
      setCustomAlert("Erro ao guardar no banco de dados.");
    } else if (data) {
      setBondososList([data[0], ...bondososList]);
      setIsModalOpen(false);
    }
  };

  // --- FUNÇÃO RESTAURADA: PRESTAR CONTAS (UPDATE) ---
  const handleAccountabilitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!soldTickets || !collectedAmount) {
      setCustomAlert("Preencha as vendas e o valor.");
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
      setCustomAlert("Erro ao salvar prestação de contas.");
    } else if (data) {
      setBondososList(bondososList.map(b => b.id === selectedBondoso.id ? data[0] : b));
      setIsAccountModalOpen(false);
      setSelectedBondoso(null);
    }
  };

  const filteredBondosos = bondososList.filter((bondoso) => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    if (bondoso.name.toLowerCase().includes(searchLower)) return true;
    if (bondoso.phone && bondoso.phone.includes(searchLower)) return true;
    const searchNum = parseInt(searchLower, 10);
    if (!isNaN(searchNum) && bondoso.range) {
      const [startStr, endStr] = bondoso.range.split(' - ');
      return searchNum >= parseInt(startStr, 10) && searchNum <= parseInt(endStr, 10);
    }
    return false;
  });

  const previewStart = parseInt(newRangeStart, 10) || 0;
  const previewBlocks = parseInt(newBlockCount, 10) || 0;
  const previewEnd = previewBlocks > 0 ? previewStart + (previewBlocks * NUMEROS_POR_BLOCO) - 1 : 0;
  const previewText = `${String(previewStart).padStart(5, '0')} - ${String(previewEnd).padStart(5, '0')}`;

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-5 md:px-8 pt-10 pb-40 text-white min-h-screen">
      <h2 className="text-5xl font-black mb-10 tracking-tight">Bondosos</h2>

      {/* Busca Gigante para facilitar leitura */}
      <div className="mb-12 bg-[#1e3a8a] p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-white/10">
        <label className="text-sm font-black text-white/50 uppercase tracking-widest block mb-4">Busca de Número ou Nome</label>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-8 h-8" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e3a8a] border border-white/20 rounded-2xl py-6 pl-16 pr-6 text-2xl focus:ring-4 focus:ring-[#cfa030]/20 transition-all placeholder:text-white/20 outline-none font-bold"
            placeholder="Ex: 00508 ou João..."
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 font-bold text-xl uppercase tracking-widest text-white/30">A carregar...</div>
        ) : filteredBondosos.map((reseller) => (
          <div key={reseller.id} className="p-8 bg-[#1e3a8a] rounded-[3rem] border border-white/10 shadow-lg flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#cfa030] text-[#1e3a8a] flex items-center justify-center font-black text-3xl shrink-0 uppercase">
                {reseller.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-2xl leading-tight truncate">{reseller.name}</p>
                <div className="flex items-center gap-3 text-[#cfa030] mt-2">
                  <Ticket className="w-6 h-6" />
                  <span className="font-bold text-xl">{reseller.range}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.open(`https://wa.me/55${reseller.phone}`, '_blank')}
                className="flex-1 bg-white/5 border border-white/10 py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-7 h-7" /> WhatsApp
              </button>
              {reseller.status === 'pending' ? (
                <button
                  onClick={() => openAccountability(reseller)}
                  className="flex-1 bg-[#cfa030] text-[#1e3a8a] py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase text-sm tracking-widest hover:bg-[#b58b29] transition-all"
                >
                  <CheckCircle2 className="w-7 h-7" /> Dar Baixa
                </button>
              ) : (
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase text-sm tracking-widest">
                  Pago ✓
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botão Flutuante +40 */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-32 right-6 w-20 h-20 bg-[#cfa030] text-[#1e3a8a] rounded-3xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-[#1e3a8a]"
      >
        <Plus className="w-10 h-10 stroke-[3]" />
      </button>

      {/* MODAL 1: CADASTRAR NOVO (RESTAURADO) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1e3a8a] px-8 py-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase">Novo Bondoso</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleAddBondoso} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[#1e3a8a] text-xs font-black uppercase tracking-widest mb-2">Nome Completo</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-xl text-[#1e3a8a] font-bold outline-none focus:border-[#cfa030]" required />
                </div>
                <div>
                  <label className="block text-[#1e3a8a] text-xs font-black uppercase tracking-widest mb-2">WhatsApp</label>
                  <input type="tel" value={newPhone} onChange={handlePhoneChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-xl text-[#1e3a8a] font-bold outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#1e3a8a] text-xs font-black uppercase tracking-widest mb-2">Blocos</label>
                    <input type="number" value={newBlockCount} onChange={(e) => setNewBlockCount(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-xl font-bold" required />
                  </div>
                  <div>
                    <label className="block text-[#1e3a8a] text-xs font-black uppercase tracking-widest mb-2">Nº Inicial</label>
                    <input type="number" value={newRangeStart} onChange={(e) => setNewRangeStart(e.target.value)} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-xl font-bold border-[#cfa030]" required />
                  </div>
                </div>
                <div className="bg-slate-100 p-5 rounded-2xl border-2 border-dashed border-slate-200 flex justify-between items-center">
                  <span className="text-xs font-black text-slate-400 uppercase">Faixa Gerada</span>
                  <span className="text-2xl font-black text-[#1e3a8a] font-mono">{previewText}</span>
                </div>
              </div>
              <div className="flex gap-4 mt-10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-[#cfa030] text-[#1e3a8a] font-black rounded-2xl uppercase tracking-widest shadow-lg">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRESTAÇÃO DE CONTAS (RESTAURADO) */}
      {isAccountModalOpen && selectedBondoso && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 px-8 py-6 flex items-center justify-between rounded-t-[3rem]">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">Baixa de Números</h3>
              <button onClick={() => setIsAccountModalOpen(false)} className="text-white/70 hover:text-white"><X className="w-8 h-8" /></button>
            </div>
            <form onSubmit={handleAccountabilitySubmit} className="p-10">
              <div className="mb-10">
                <p className="text-[#1e3a8a] text-3xl font-black mb-1">{selectedBondoso.name}</p>
                <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">Bloco: {selectedBondoso.range}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[#1e3a8a] text-sm font-black uppercase mb-2">Vendidos</label>
                  <input type="number" value={soldTickets} onChange={(e) => setSoldTickets(e.target.value)} placeholder="Qtd. Vendida" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-black text-[#1e3a8a]" required />
                </div>
                <div>
                  <label className="block text-[#1e3a8a] text-sm font-black uppercase mb-2">Valor Recebido (R$)</label>
                  <input type="text" value={collectedAmount} onChange={(e) => setCollectedAmount(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-black text-[#1e3a8a]" required />
                </div>
              </div>
              <button type="submit" className="w-full mt-10 py-6 bg-emerald-600 text-white font-black rounded-3xl uppercase tracking-[0.2em] shadow-xl text-lg flex items-center justify-center gap-4">
                <CheckCircle2 className="w-8 h-8" /> Confirmar Pagamento
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ALERTA PERSONALIZADO */}
      {customAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1e3a8a] px-8 py-5 flex items-center justify-between">
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">Sistema RifaoCon diz:</h3>
              <button onClick={() => setCustomAlert(null)} className="text-white/70 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 text-center">
              <p className="text-[#1e3a8a] text-xl font-bold leading-relaxed">{customAlert}</p>
              <button onClick={() => setCustomAlert(null)} className="mt-10 w-full py-5 bg-[#cfa030] text-[#1e3a8a] font-black rounded-2xl uppercase tracking-widest shadow-md text-lg">Entendido</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}