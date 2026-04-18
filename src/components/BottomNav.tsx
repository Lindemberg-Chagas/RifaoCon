import { LayoutDashboard, Users, Search } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#1e3a8a] border-t border-white/15 shadow-[0_-5px_15px_rgba(0,0,0,0.2)] md:hidden font-['Inter']">
      <div className="flex justify-around items-center pt-2 pb-safe-offset-4 px-2 min-h-[75px]">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl w-1/3 min-h-[60px] ${activeTab === 'dashboard' ? 'text-[#cfa030]' : 'text-white/60 hover:text-white'} active:scale-95 transition-all duration-200`}
        >
          <LayoutDashboard className={`w-6 h-6 mb-1.5 ${activeTab === 'dashboard' ? 'stroke-2 text-[#cfa030]' : 'stroke-[1.5]'}`} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Visão Geral</span>
        </button>

        <button 
          onClick={() => setActiveTab('resellers')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl w-1/3 min-h-[60px] ${activeTab === 'resellers' ? 'text-[#cfa030]' : 'text-white/60 hover:text-white'} active:scale-95 transition-all duration-200`}
        >
          <Users className={`w-6 h-6 mb-1.5 ${activeTab === 'resellers' ? 'stroke-2 text-[#cfa030]' : 'stroke-[1.5]'}`} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Revendedores</span>
        </button>

        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex flex-col items-center justify-center p-2 rounded-2xl w-1/3 min-h-[60px] ${activeTab === 'inventory' ? 'text-[#cfa030]' : 'text-white/60 hover:text-white'} active:scale-95 transition-all duration-200`}
        >
          <Search className={`w-6 h-6 mb-1.5 ${activeTab === 'inventory' ? 'stroke-2 text-[#cfa030]' : 'stroke-[1.5]'}`} />
          <span className="text-[10px] font-bold tracking-wide uppercase">Busca</span>
        </button>
      </div>
    </nav>
  );
}
