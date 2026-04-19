import { LayoutGrid, Users, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard', label: 'Início', icon: LayoutGrid },
    { id: 'resellers', label: 'Bondosos', icon: Users },
    { id: 'profile', label: 'Meu Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e3a8a] border-t-2 border-white/5 px-4 pt-5 pb-10 flex items-center justify-around z-50 backdrop-blur-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-2 transition-all duration-300 relative min-w-[100px] ${isActive ? 'text-[#cfa030] scale-110' : 'text-white/40 hover:text-white/60'
              }`}
          >
            {/* Ícones ligeiramente maiores para facilitar identificação */}
            <Icon className={`w-8 h-8 ${isActive ? 'stroke-[2.8px]' : 'stroke-[2px]'}`} />

            {/* TEXTO AUMENTADO EM 10% (de 13px para 15px) */}
            <span className="text-[15px] font-black uppercase tracking-wider">
              {tab.label}
            </span>

            {isActive && (
              <div className="absolute -bottom-3 w-2.5 h-2.5 bg-[#cfa030] rounded-full shadow-[0_0_15px_#cfa030]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}