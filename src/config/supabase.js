import { createClient } from "@supabase/supabase-js";

const direccionSupabase = import.meta.env.VITE_SUPABASE_URL;
const clavePublicaSupabase = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigurado = Boolean(
  direccionSupabase && clavePublicaSupabase,
);

export const supabase = supabaseConfigurado
  ? createClient(direccionSupabase, clavePublicaSupabase)
  : null;
