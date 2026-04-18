import { Plus, Edit2, Trash2, LogOut, User, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface Rifa {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface AdminProps {
  setActiveTab: (tab: string) => void;
}

export function Admin({ setActiveTab }: AdminProps) {
  const [rifas, setRifas] = useState<Rifa[]>([
    { id: 1, name: 'Rifão de Inverno', startDate: '15 Junho, 2026', endDate: '30 Agosto, 2026', isActive: true },
    { id: 2, name: 'Ação de Páscoa', startDate: '01 Março, 2026', endDate: '05 Abril, 2026', isActive: false }
  ]);

  const handleCreateNew = () => {
    const name = window.prompt('Digite o nome da nova Ação/Rifa:');
    if (name) {
      const newRifa: Rifa = {
        id: Date.now(),
        name: name,
        startDate: new Date().toLocaleDateString('pt-BR'),
        endDate: 'Definir',
        isActive: true
      };
      const updatedRifas = rifas.map(r => ({ ...r, isActive: false }));
      setRifas([newRifa, ...updatedRifas]);
    }
  };

  const handleEditName = (id: number, currentName: string) => {
    const newName = window.prompt('Editar nome da Rifa:', currentName);
    if (newName && newName.trim() !== '') {
      setRifas(rifas.map(r => r.id === id ? { ...r, name: newName } : r));
    }
  };

  const handleDelete = (id: number, name: string) => {
    if (rifas.length === 1) {
      window.alert('Você não pode apagar a única rifa do sistema.');
      return;
    }
    const confirm = window.confirm(`Tem certeza que deseja apagar "${name}"? Todo o histórico será perdido.`);
    if (confirm) {
      setRifas(rifas.filter(r => r.id !== id));
    }
  };

  const handleActivate = (id: number) => {
    setRifas(rifas.map(r => ({ ...r, isActive: r.id === id })));
  };

  return (
    <main className="max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-32 md:pb-16 w-full">

      {/* Botão de Voltar */}
      <button
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-2 text-[#1e3a8a] font-bold mb-6 hover:opacity-70 transition-opacity"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para o Painel
      </button>

      {/* Cabeçalho de Perfil */}
      <div className="bg-[#1e3a8a] rounded-3xl p-6 md:p-8 shadow-lg text-white mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#cfa030]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lindemberg&backgroundColor=1e3a8a"
              alt="Perfil do Usuário"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Lindemberg</h1>
            <p className="text-[#cfa030] text-sm font-bold uppercase tracking-widest mb-4">Administrador do Sistema</p>
            <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mx-auto md:mx-0 bg-white/10 px-4 py-2 rounded-full">
              <LogOut className="w-4 h-4" />
              Sair da conta
            </button>
          </div>
        </div>
      </div>

      {/* Seção de Gerenciamento de Rifas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-[#1e3a8a]">Histórico de Ações</h2>
        <button
          onClick={handleCreateNew}
          className="flex items-center justify-center gap-2 bg-[#1e3a8a] hover:bg-[#152a66] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-colors w-full md:w-auto"
        >
          <Plus className="w-4 h-4 text-[#cfa030]" />
          Nova Rifa
        </button>
      </div>

      {/* Lista de Rifas */}
      <div className="flex flex-col gap-4">
        {rifas.map(rifa => (
          <div key={rifa.id} className={`bg-white rounded-2xl p-5 border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${rifa.isActive ? 'border-[#1e3a8a]' : 'border-slate-200'}`}>

            <div>
              <div className="flex items-center gap-2 mb-1">
                {rifa.isActive ? (
                  <span className="bg-[#1e3a8a] text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#cfa030] rounded-full animate-pulse"></span>
                    Ativa
                  </span>
                ) : (
                  <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider">Encerrada</span>
                )}
              </div>
              <h3 className={`text-lg font-black ${rifa.isActive ? 'text-[#1e3a8a]' : 'text-slate-600'}`}>{rifa.name}</h3>
              <p className="text-sm text-slate-500 font-medium">{rifa.startDate} — {rifa.endDate}</p>
            </div>

            <div className="flex items-center gap-2">
              {!rifa.isActive && (
                <button
                  onClick={() => handleActivate(rifa.id)}
                  className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors flex items-center gap-2 md:px-4"
                  title="Tornar Rifa Ativa"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-bold hidden md:inline">Ativar</span>
                </button>
              )}
              <button
                onClick={() => handleEditName(rifa.id, rifa.name)}
                className="p-2.5 text-[#1e3a8a] bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                title="Editar Nome"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(rifa.id, rifa.name)}
                className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                title="Apagar Rifa"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </main>
  );
}