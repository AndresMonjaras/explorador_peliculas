import { supabase } from "../config/supabase.js";

const TAMANO_PAGINA = 12;

export async function consultarPeliculas({ busqueda = "", pagina = 1 } = {}) {
  if (!supabase) {
    throw new Error("Falta configurar la conexión con Supabase.");
  }

  const desde = (pagina - 1) * TAMANO_PAGINA;
  const hasta = desde + TAMANO_PAGINA - 1;

  let consulta = supabase
    .from("peliculas")
    .select(
      "tmdb_id, titulo, titulo_original, resumen, fecha_estreno, poster_path, backdrop_path, puntuacion, idioma_original, generos",
      { count: "exact" },
    )
    .order("fecha_estreno", { ascending: false, nullsFirst: false })
    .range(desde, hasta);

  if (busqueda.trim()) {
    consulta = consulta.ilike("titulo", `%${busqueda.trim()}%`);
  }

  const { data, error, count } = await consulta;

  if (error) {
    throw error;
  }

  return {
    peliculas: data ?? [],
    total: count ?? 0,
    paginas: Math.ceil((count ?? 0) / TAMANO_PAGINA),
  };
}

export async function consultarPeliculaPorId(idTmdb) {
  if (!supabase) {
    throw new Error("Falta configurar la conexión con Supabase.");
  }

  const { data, error } = await supabase
    .from("peliculas")
    .select(
      "tmdb_id, titulo, titulo_original, resumen, fecha_estreno, poster_path, backdrop_path, puntuacion, idioma_original, generos",
    )
    .eq("tmdb_id", idTmdb)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
