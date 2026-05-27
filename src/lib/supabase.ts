import { createClient } from '@supabase/supabase-js';

// ATENÇÃO: Substitua os valores abaixo pelas credenciais reais do seu projeto Supabase.
// Você encontra essas chaves em: Project Settings -> API
// O ideal é colocar isso em um arquivo .env (ex: VITE_SUPABASE_URL)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozthopuhhjjqoullnsnd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_EsqJDE46gPZpszpTCIYsbg_JDBqaXBn';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
