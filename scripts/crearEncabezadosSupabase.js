export function crearEncabezadosSupabase(clavePrivada) {
  if (!clavePrivada) {
    throw new Error("Falta configurar una clave privada de Supabase.");
  }

  if (clavePrivada.startsWith("sb_publishable_")) {
    throw new Error(
      "La clave pública no puede usarse aquí. Usa una clave sb_secret_ en el importador.",
    );
  }

  const encabezados = {
    apikey: clavePrivada,
    "Content-Type": "application/json",
    Prefer: "resolution=merge-duplicates",
  };

  if (!clavePrivada.startsWith("sb_secret_")) {
    encabezados.Authorization = `Bearer ${clavePrivada}`;
  }

  return encabezados;
}
