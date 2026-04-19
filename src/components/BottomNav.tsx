import { LayoutGrid, Users, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  // Definimos as 3 abas principais: Geral, Bondosos e Perfil
  const tabs = [
    { id: 'dashboard', label: 'Geral', icon: LayoutGrid },
    { id: 'resellers', label: 'Bondosos', icon: Users },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e3a8a] border-t border-white/10 px-4 py-3 flex items-center justify-around z-50 backdrop-blur-md pb-6 md:pb-4">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative min-w-[80px] ${isActive ? 'text-[#cfa030] scale-110' : 'text-white/40 hover:text-white/60'
              }`}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {tab.label}
            </span>

            {/* Indicador visual de aba ativa */}
            {isActive && (
              <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#cfa030] rounded-full shadow-[0_0_10px_#cfa030]" />
            )}
          </button>
        );
      })}
    </nav>
  );
}