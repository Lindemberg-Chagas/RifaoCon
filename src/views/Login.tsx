import { Loader2 } from 'lucide-react';
import { useState } from 'react';
// Certifique-se de que a imagem está nesta pasta
import brasaoImg from '../assets/brasao-paroquia.png';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simula o tempo de autenticação e transição
    setTimeout(() => {
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#1e3a8a] flex flex-col items-center justify-between p-6 md:p-12 font-['Inter'] relative overflow-hidden text-white">

      {/* Elementos decorativos de fundo (Blur) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#cfa030]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#cfa030]/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* Branding - RifasCon */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(207,160,48,0.1)] p-2">
            <img
              src={brasaoImg}
              alt="Brasão Paróquia"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">RifasCon</h1>
          <p className="text-white/70 text-sm md:text-base font-medium max-w-[280px] leading-relaxed">
            Ação entre Amigos<br />
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Acesso Administrativo</span>
          </p>
        </div>

        {/* Componentes de Login */}
        <div className="w-full flex flex-col items-center gap-4">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 text-[#1e3a8a] h-14 rounded-full flex items-center justify-center gap-3 font-bold text-base md:text-lg transition-all active:scale-95 shadow-xl disabled:opacity-90 disabled:scale-100 relative overflow-hidden"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 text-[#cfa030] animate-spin" />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                <span>Entrar com Google</span>
              </>
            )}
          </button>

          <button className="text-[#cfa030] hover:text-[#e0b754] bg-transparent border border-[#cfa030]/30 hover:border-[#cfa030] hover:bg-[#cfa030]/5 rounded-full px-6 py-3 text-xs font-bold transition-all w-full tracking-wide">
            Dificuldades no acesso? Contrate o suporte
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-center flex flex-col gap-2 items-center w-full animate-in fade-in duration-1000 delay-300">
        <p className="text-[9px] md:text-[10px] font-semibold tracking-[0.15em] uppercase opacity-40">
          Paróquia Nossa Senhora de Fátima - Genibaú
        </p>
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-8 bg-white/10"></span>
          <span className="text-[10px] font-mono font-bold bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/50">v1.0.0</span>
          <span className="h-[1px] w-8 bg-white/10"></span>
        </div>
      </div>
    </div>
  );
}