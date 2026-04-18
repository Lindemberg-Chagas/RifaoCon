import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simula o tempo de autenticação e transição do Login
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-between p-6 md:p-12 font-['Inter'] relative overflow-hidden text-white">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#cfa030]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cfa030]/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Branding */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Brasão Placeholder */}
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(207,160,48,0.15)]">
            <span className="text-[#cfa030] font-serif italic text-2xl font-bold opacity-80">Logo</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Elo Fátima</h1>
          <p className="text-white/70 text-sm md:text-base font-medium max-w-[260px]">
            Acesso exclusivo para a Comissão Organizadora
          </p>
        </div>

        {/* Login Components */}
        <div className="w-full flex flex-col items-center gap-6">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 text-[#1e3a8a] h-14 rounded-full flex items-center justify-center gap-3 font-bold text-base md:text-lg transition-all active:scale-95 shadow-lg disabled:opacity-90 disabled:scale-100 relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-[#cfa030] animate-spin" />
            ) : (
              <>
                {/* Official SVG Google Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                </svg>
                <span>Entrar com Google</span>
              </>
            )}
          </button>

          <button className="text-[#cfa030] hover:text-[#e0b754] bg-transparent border border-[#cfa030] hover:bg-[#cfa030]/10 rounded-full px-6 py-3 text-sm font-bold transition-colors w-full">
            Dificuldades no acesso? Contrate o suporte
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-center flex flex-col gap-1 items-center opacity-60 w-full animate-in fade-in duration-1000 delay-300">
        <p className="text-[10px] md:text-xs font-medium tracking-wide uppercase">
          Ação entre Amigos - Paróquia Nossa Senhora de Fátima
        </p>
        <span className="text-[10px] font-mono font-bold bg-white/10 px-2 py-0.5 rounded-md">v1.0.0</span>
      </div>
    </div>
  );
}
