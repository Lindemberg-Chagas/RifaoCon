import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { LogOut, Mail, Shield, FileText, PlusCircle, Layout } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Profile() {
  const [user, setUser] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function getUserData() {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    }
    getUserData();
  }, []);

  // --- FUNCIONALIDADE 1: GERAR PDF ---
  const generateReport = async () => {
    setIsGenerating(true);
    const { data: bondosos } = await supabase.from('bondosos').select('*').order('name');

    if (!bondosos) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');

    // Cabeçalho do PDF
    doc.setFontSize(20);
    doc.setTextColor(30, 58, 138); // Azul do App
    doc.text('Relatório Geral - Rifas Vendidas', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${date}`, 14, 30);

    // Tabela de Dados
    const tableRows = bondosos.map(b => [
      b.name,
      b.range,
      b.status_label,
      b.sold_tickets || 0,
      `R$ ${b.collected_amount?.toFixed(2) || '0,00'}`
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Bondoso', 'Faixa de Números', 'Status', 'Vendidos', 'Valor']],
      body: tableRows,
      headStyles: { fillColor: [30, 58, 138] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
    });

    doc.save(`Relatorio_Rifas_${date.replace(/\//g, '-')}.pdf`);
    setIsGenerating(false);
  };

  // --- FUNCIONALIDADE 2: NOVA RIFA (MODELO) ---
  const handleNewCampaign = () => {
    const confirm = window.confirm(
      "Deseja iniciar uma nova campanha? Isso arquivará os dados atuais para começar do zero."
    );
    if (confirm) {
      // Aqui você poderia chamar uma função para limpar a tabela 'bondosos'
      // ou criar uma nova entrada na tabela 'campanhas'
      alert("Funcionalidade de Banco de Dados: Configure uma nova tabela 'campanhas' no Supabase para gerenciar múltiplos modelos!");
    }
  };

  if (!user) return null;

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-5 pt-10 pb-40 min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <div className="relative">
          <img src={user.user_metadata.avatar_url} className="w-32 h-32 rounded-full border-8 border-[#cfa030] shadow-2xl" alt="Avatar" />
        </div>
        <h2 className="mt-6 text-3xl font-black text-[#1e3a8a] text-center">{user.user_metadata.full_name}</h2>
        <p className="text-[#cfa030] font-black uppercase tracking-widest text-[10px]">Administrador Master</p>
      </div>

      <div className="space-y-6">
        {/* Card de Identidade Digital */}
        <div className="bg-[#5e85f0] p-6 rounded-[2.5rem] shadow-xl text-white">
          <h3 className="text-white/40 text-[10px] font-black uppercase mb-6">Identidade</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="w-5 h-5 text-[#cfa030]" />
              <span className="font-bold text-sm truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-[#cfa030]" />
              <span className="font-bold text-sm uppercase">Acesso Total (DevOps)</span>
            </div>
          </div>
        </div>

        {/* MUDANÇA AQUI: GESTÃO DO SISTEMA NO LUGAR DE CONFIGURAÇÕES */}
        <div className="bg-[#5e85f0] p-6 rounded-[3rem] shadow-xl text-white">
          <h3 className="text-white/40 text-[10px] font-black uppercase mb-6 tracking-widest text-center">Gestão do Sistema</h3>

          <div className="grid grid-cols-1 gap-4">
            {/* Botão Nova Rifa */}
            <button
              onClick={handleNewCampaign}
              className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-3xl transition-all group border border-white/5"
            >
              <div className="flex items-center gap-4">
                <PlusCircle className="w-6 h-6 text-[#cfa030]" />
                <span className="font-black uppercase text-xs tracking-tighter">Criar Nova Rifa</span>
              </div>
              <Layout className="w-4 h-4 opacity-30" />
            </button>

            {/* Botão Relatório PDF */}
            <button
              onClick={generateReport}
              disabled={isGenerating}
              className="flex items-center justify-between p-5 bg-white/10 hover:bg-white/20 rounded-3xl transition-all group border border-white/5"
            >
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 text-[#cfa030]" />
                <span className="font-black uppercase text-xs tracking-tighter">
                  {isGenerating ? "Gerando..." : "Exportar PDF Geral"}
                </span>
              </div>
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-4 p-6 bg-red-500/10 border-2 border-red-500/20 text-red-500 rounded-[2.5rem] font-black uppercase text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all"
        >
          <LogOut className="w-6 h-6" />
          Encerrar Sessão
        </button>
      </div>
    </main>
  );
}