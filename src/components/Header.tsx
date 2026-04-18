import { Menu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="bg-[#1e3a8a] text-white fixed top-0 w-full z-[60] flex justify-between items-center px-4 md:px-8 h-16 md:h-20 transition-all duration-200 border-b border-white/15 font-['Inter']">
      <div className="flex items-center gap-3 md:gap-4">
        <button className="p-2 md:p-3 hover:bg-white/5 transition-all rounded-xl active:scale-95" id="menu-btn" aria-label="Menu principal">
          <Menu className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </button>
        <h1 className="text-xl md:text-2xl tracking-tight font-black text-white flex items-center gap-1">
          RifaoCon
        </h1>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <nav className="hidden md:flex gap-4 lg:gap-6 items-center">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`text-sm tracking-wide font-bold uppercase ${activeTab === 'dashboard' ? 'text-[#1e3a8a] bg-[#cfa030] shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'} px-5 py-2.5 rounded-xl transition-all`}
          >
            Visão Geral
          </button>
          <button 
            onClick={() => setActiveTab('resellers')}
            className={`text-sm tracking-wide font-bold uppercase ${activeTab === 'resellers' ? 'text-[#1e3a8a] bg-[#cfa030] shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'} px-5 py-2.5 rounded-xl transition-all`}
          >
            Revendedores
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`text-sm tracking-wide font-bold uppercase ${activeTab === 'inventory' ? 'text-[#1e3a8a] bg-[#cfa030] shadow-sm' : 'text-white/70 hover:text-white hover:bg-white/10'} px-5 py-2.5 rounded-xl transition-all`}
          >
            Busca
          </button>
        </nav>
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 bg-[#cfa030]/20 overflow-hidden border border-[#cfa030] shadow-sm cursor-pointer hover:border-white transition-colors">
          <img 
            alt="Foto de perfil" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD_VdbQaf2kB4H5HHVqSBM5SoN8NdsKPLfIBgecqIDU8y-D6o8JHOCJSN3rn2SBa4Hamsogb0wc6JRKC9hQcC-bcfZzAo4ob6s3mv93UjB3Sy4Hh50tmIP4dfUhS00nMr4tE6p_ZxZEi3OfdD92QV_RvLGgvwqH1_TryGksDbx7blQvSWw6y1wUCxoZMM3CPAEuHTGile_Gxa7f1qH95d1jI9ONDlUKid8oJz3SdjA5cy9S1UsI1kf8dJ86xlCSc9XzOFZMQBWez3g"
          />
        </div>
      </div>
    </header>
  );
}
