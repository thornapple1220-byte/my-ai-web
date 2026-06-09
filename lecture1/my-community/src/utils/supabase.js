import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://zhsgrijtbgfrflwwgwwp.supabase.co';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpoc2dyaWp0YmdmcmZsd3dnd3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTczODEsImV4cCI6MjA5NjQzMzM4MX0.FiE8krEBr4pqOdUx7k3_Sh4sqfOO7fB0H8sfr2Yfbbo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
