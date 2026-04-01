import { createClient } from '@supabase/supabase-js';
import Replicate from 'replicate';

// Inicialización de Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);

// Inicialización de Replicate
export const replicate = new Replicate({ 
  auth: process.env.REPLICATE_API_TOKEN 
});