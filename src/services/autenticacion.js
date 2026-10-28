import { supabase } from "../config/supabase.js";

export async function iniciarSesionConGoogle() {
  if (!supabase) {
    throw new Error("Falta configurar la conexión con Supabase.");
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });

  if (error) {
    throw error;
  }
}

export async function cerrarSesion() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}
