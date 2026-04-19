import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Atenção: Faltam as variáveis de ambiente do Supabase (.env.local)");
}

export const supabase = createClient(
  supabaseUrl || 'https://sua-url-padrao-aqui.supabase.co',
  supabaseAnonKey || 'sua-chave-padrao-aqui'
);