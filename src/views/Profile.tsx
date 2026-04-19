import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Mail, Shield, FileText, PlusCircle, Layout, CheckCircle, X } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [raffles, setRaffles] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isNewRaffleModalOpen, setIsNewRaffleModalOpen] = useState(false);

  // Estado para o Alerta Customizado padronizado
  const [customAlert, setCustomAlert] = useState<string | null>(null);

  // Estados para nova rifa
  const [raffleName, setRaffleName] = useState('');
  const [raffleSize, setRaffleSize] = useState('20000');

  useEffect(() => {
    fetchUserData();
    fetchRaffles();
  }, []);

  async function fetchUserData() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
  }

  async function fetchRaffles() {
    const { data } = await supabase.from('raffles').select('*').order('created_at', { ascending: false });
    setRaffles(data || []);
  }

  // --- ALTERAR RIFA ATIVA (Atualizado com Alerta Customizado) ---
  const setActiveRaffle = async (id: string) => {
    try {
      // 1. Desativar todas
      await supabase.from('raffles').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      // 2. Ativar a selecionada
      const { error } = await supabase.from('raffles').update({ is_active: true }).eq('id', id);

      if (error) throw error;

      fetchRaffles();
      // Em vez do alert() do navegador, usamos o nosso estado
      setCustomAlert("Campanha alterada com sucesso! O Dashboard será atualizado.");
    } catch (error: any) {
      setCustomAlert("Erro ao alterar campanha: " + error.message);
    }
  };

  // --- CRIAR NOVA RIFA ---
  const handleCreateRaffle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('raffles').insert([
      { name: raffleName, total_tickets: parseInt(raffleSize, 10), is_active: false }
    ]).select();

    if (error) {
      setCustomAlert("Erro ao criar modelo: " + error.message);
    } else if (data) {
      setRaffles([data[0], ...raffles]);
      setIsNewRaffleModalOpen(false);
      setRaffleName('');
      setCustomAlert("Novo modelo '" + raffleName + "' criado com sucesso!");
    }
  };

  // --- GERAR PDF ---
  const generateReport = async () => {
    setIsGenerating(true);
    const activeRaffle = raffles.find(r => r.is_active);
    const { data: bondosos } = await supabase
      .from('bondosos')
      .select('*')
      .eq('raffle_id', activeRaffle?.id)
      .order('name');

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');

    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138);
    doc.text(`Relatório: ${activeRaffle?.name || 'Geral'}`, 14, 22);

    const tableRows = (bondosos || []).map(b => [
      b.name, b.range, b.status_label, b.sold_tickets || 0, `R$ ${b.collected_amount?.toFixed(2) || '0,00'}`
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Bondoso', 'Faixa', 'Status', 'Vendas', 'Valor']],
      body: tableRows,
      headStyles: { fillColor: [94, 133, 240] },
    });

    doc.save(`Relatorio_${activeRaffle?.name || 'Rifas'}.pdf`);
    setIsGenerating(false);
  };

  if (!user) return null;

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-5 pt-10 pb-40 min-h-screen">
      <div className="flex flex-col items-center mb-10">
        <img src={user.user_metadata.avatar_url} className="w-32 h-32 rounded-full border-8 border-[#cfa030] shadow-2xl" alt="Avatar" />
        <h2 className="mt-6 text-3xl font-black text-[#1e3a8a]">{user.user_metadata.full_name}</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-[#5e85f0] p-8 rounded-[3rem] shadow-xl text-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-white/40 text-[10px] font-black uppercase tracking-widest">Modelos de Rifas</h3>
            <button onClick={() => setIsNewRaffleModalOpen(true)} className="bg-white/20 p-2 rounded-full hover:bg-white/40 transition-all">
              <PlusCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            {raffles.map((r) => (
              <div
                key={r.id}
                onClick={() => setActiveRaffle(r.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${r.is_active ? 'border-[#cfa030] bg-white/10' : 'border-white/5 bg-black/5'}`}
              >
                <div>
                  <p className="font-black text-sm uppercase">{r.name}</p>
                  <p className="text-[10px] font-bold opacity-60">{r.total_tickets.toLocaleString()} Números</p>
                </div>
                {r.is_active && <CheckCircle className="text-[#cfa030] w-6 h-6" />}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={generateReport}
          className="w-full p-8 bg-[#1e3a8a] rounded-[3rem] text-white font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4 shadow-xl"
        >
          <FileText className="w-6 h-6 text-[#cfa030]" />
          {isGenerating ? "Gerando..." : "Gerar Relatório PDF"}
        </button>

        <button onClick={() => supabase.auth.signOut()} className="w-full p-6 bg-red-500/10 text-red-500 rounded-[2rem] font-black uppercase text-xs tracking-widest border border-red-500/20">
          Encerrar Sessão
        </button>
      </div>

      {/* Modal Nova Rifa */}
      {isNewRaffleModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 text-[#1e3a8a]">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-8 animate-in zoom-in-95 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tighter">Novo Modelo</h3>
              <button onClick={() => setIsNewRaffleModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleCreateRaffle} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase mb-2">Nome da Campanha</label>
                <input value={raffleName} onChange={(e) => setRaffleName(e.target.value)} className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#5e85f0]" placeholder="Ex: Rifa de Pascoa" required />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase mb-2">Total de Números</label>
                <input type="number" value={raffleSize} onChange={(e) => setRaffleSize(e.target.value)} className="w-full bg-slate-100 p-5 rounded-2xl font-bold outline-none" required />
              </div>
              <button type="submit" className="w-full p-6 bg-[#5e85f0] text-white font-black rounded-3xl uppercase tracking-widest shadow-lg active:scale-95 transition-all">Criar Modelo</button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE ALERTA CUSTOMIZADO PADRONIZADO --- */}
      {customAlert && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4 text-center">
          <div className="bg-white rounded-[3rem] w-full max-w-md shadow-2xl p-10 animate-in zoom-in-95 duration-200 border-t-8 border-[#cfa030]">
            <p className="text-[#1e3a8a] text-2xl font-black leading-relaxed mb-10">{customAlert}</p>
            <button
              onClick={() => setCustomAlert(null)}
              className="w-full py-6 bg-[#cfa030] hover:bg-[#b58b29] text-[#1e3a8a] font-black rounded-2xl uppercase tracking-widest shadow-md text-lg transition-all active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </main>
  );
}