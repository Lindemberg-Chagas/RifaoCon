import { Search, Plus, MessageCircle, Ticket, X, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Resellers() {
  const [bondososList, setBondososList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customAlert, setCustomAlert] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newBlockCount, setNewBlockCount] = useState('');
  const [newRangeStart, setNewRangeStart] = useState('');

  // Account states
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

    if (error) console.error("Erro:", error);
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

  const handleAddBondoso = async (e: React.FormEvent) => {
    e.preventDefault();
    const phoneDigits = newPhone.replace(/\D/g, '');
    if (!newName || !phoneDigits || !newBlockCount || !newRangeStart) {
      setCustomAlert("Preencha todos os campos.");
      return;
    }
    const startNum = parseInt(newRangeStart, 10);
    const blocks = parseInt(newBlockCount, 10);
    const endNum = startNum + (blocks * NUMEROS_POR_BLOCO) - 1;
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

    if (error) setCustomAlert("Erro ao salvar.");
    else if (data) {
      setBondososList([data[0], ...bondososList]);
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
    const sold = parseInt(soldTickets, 10);
    const amount = parseFloat(collectedAmount.replace(',', '.'));
    const { data, error } = await supabase
      .from('bondosos')
      .update({ status: 'paid', status_label: 'Tudo Pago', sold_tickets: sold, collected_amount: amount })
      .eq('id', selectedBondoso.id)
      .select();

    if (error) setCustomAlert("Erro ao atualizar.");
    else if (data) {
      setBondososList(bondososList.map(b => b.id === selectedBondoso.id ? data[0] : b));
      setIsAccountModalOpen(false);
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

      {/* Busca Gigante */}
      <div className="mb-12 bg-[#1e3a8a] p-8 md:p-10 rounded-3xl shadow-xl border border-white/10">
        <label className="text-sm font-black text-white/50 uppercase tracking-widest block mb-4">Busca Rápida</label>
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 w-8 h-8" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e3a8a] border border-white/20 rounded-2xl py-6 pl-16 pr-6 text-2xl focus:ring-4 focus:ring-[#cfa030]/20 transition-all placeholder:text-white/20 outline-none font-bold"
            placeholder="Número ou nome..."
          />
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-20 animate-pulse font-bold text-xl uppercase tracking-widest text-white/30">Carregando...</div>
        ) : filteredBondosos.map((reseller) => (
          <div key={reseller.id} className="p-8 bg-[#1e3a8a] rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-[#cfa030] text-[#1e3a8a] flex items-center justify-center font-black text-3xl">
                {reseller.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-2xl leading-tight">{reseller.name}</p>
                <div className="flex items-center gap-2 text-[#cfa030] mt-1">
                  <Ticket className="w-5 h-5" />
                  <span className="font-bold text-lg">{reseller.range}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.open(`https://wa.me/55${reseller.phone}`, '_blank')}
                className="flex-1 bg-white/5 border border-white/10 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-6 h-6" /> WhatsApp
              </button>
              {reseller.status === 'pending' ? (
                <button
                  onClick={() => openAccountability(reseller)}
                  className="flex-1 bg-[#cfa030] text-[#1e3a8a] py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest hover:bg-[#b58b29] transition-all"
                >
                  <CheckCircle2 className="w-6 h-6" /> Baixa
                </button>
              ) : (
                <div className="flex-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-sm tracking-widest">
                  Tudo Pago
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Adicionar Flutuante Maior */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-32 right-6 w-20 h-20 bg-[#cfa030] text-[#1e3a8a] rounded-3xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40 border-4 border-[#1e3a8a]"
      >
        <Plus className="w-10 h-10 stroke-[3]" />
      </button>

      {/* Modais omitidos aqui por brevidade, mas devem ter inputs py-5 e text-xl */}
      {/* ... (Inserir aqui o código dos modais de Resellers.tsx com classes py-5 e text-xl nos inputs) */}
    </main>
  );
}