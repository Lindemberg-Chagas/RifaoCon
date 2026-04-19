import { createClient } from '@supabase/supabase-js';

// Coloque suas chaves reais DENTRO das aspas abaixo!
const supabaseUrl = https://wkoqrqodwlnpmurfwrhj.supabase.co; 
const supabaseAnonKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb3FycW9kd2xucG11cmZ3cmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjQ1MjAsImV4cCI6MjA5MjE0MDUyMH0.6py7UxJrVb_FCMwZcwmBF8VFP4YITEJ1GlCk1GDL0s0;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);