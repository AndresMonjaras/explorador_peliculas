import { supabase } from "../config/supabase.js";

const PROVEEDORES_OAUTH_VALIDOS = ["google", "discord"];

export async function iniciarSesionConOAuth(proveedor) {
  if (!supabase) {
    throw new Error("Falta configurar la conexión con Supabase.");
  }

  if (!PROVEEDORES_OAUTH_VALIDOS.includes(proveedor)) {
    throw new Error("El proveedor de inicio de sesión no es compatible.");
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
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
