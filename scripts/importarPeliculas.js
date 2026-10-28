const URL_API_TMDB = "https://api.themoviedb.org/3";
const PAGINAS_A_IMPORTAR = 5;
const URL_SUPABASE = process.env.SUPABASE_URL;
const CLAVE_SERVICIO = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TOKEN_TMDB = process.env.TMDB_READ_ACCESS_TOKEN;

function comprobarCredenciales() {
  const faltantes = [];

  if (!URL_SUPABASE) {
    faltantes.push("SUPABASE_URL");
  }

  if (!CLAVE_SERVICIO) {
    faltantes.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!TOKEN_TMDB) {
    faltantes.push("TMDB_READ_ACCESS_TOKEN");
  }

  if (faltantes.length > 0) {
    throw new Error(`Faltan estas variables de entorno: ${faltantes.join(", ")}`);
  }
}

async function consultarTmdb(ruta) {
  const respuesta = await fetch(`${URL_API_TMDB}${ruta}`, {
    headers: {
      Authorization: `Bearer ${TOKEN_TMDB}`,
      accept: "application/json",
    },
  });

  if (!respuesta.ok) {
    throw new Error(`TMDb respondió con el estado ${respuesta.status}.`);
  }

  return respuesta.json();
}

function prepararPelicula(pelicula, nombresGeneros) {
  if (
    !pelicula ||
    typeof pelicula !== "object" ||
    !Number.isInteger(pelicula.id) ||
    typeof pelicula.title !== "string" ||
    !pelicula.title.trim()
  ) {
    return null;
  }

  const puntuacion = Number(pelicula.vote_average);
  const puntuacionValida = Number.isFinite(puntuacion)
    ? Math.min(Math.max(puntuacion, 0), 10)
    : 0;
  const fechaEstreno = /^\d{4}-\d{2}-\d{2}$/.test(pelicula.release_date ?? "")
    ? pelicula.release_date
    : null;
  const idsGenero = Array.isArray(pelicula.genre_ids)
    ? pelicula.genre_ids
    : [];

  return {
    tmdb_id: pelicula.id,
    titulo: pelicula.title.trim(),
    titulo_original: pelicula.original_title ?? null,
    resumen: pelicula.overview || null,
    fecha_estreno: fechaEstreno,
    poster_path: pelicula.poster_path ?? null,
    backdrop_path: pelicula.backdrop_path ?? null,
    puntuacion: puntuacionValida,
    idioma_original: pelicula.original_language ?? null,
    generos: idsGenero
      .map((idGenero) => nombresGeneros.get(idGenero))
      .filter(Boolean),
    actualizado_en: new Date().toISOString(),
  };
}

async function guardarPeliculas(peliculas) {
  const respuesta = await fetch(
    `${URL_SUPABASE}/rest/v1/peliculas?on_conflict=tmdb_id`,
    {
      method: "POST",
      headers: {
        apikey: CLAVE_SERVICIO,
        Authorization: `Bearer ${CLAVE_SERVICIO}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(peliculas),
    },
  );

  if (!respuesta.ok) {
    const detalle = await respuesta.text();
    throw new Error(`Supabase rechazó la importación: ${detalle}`);
  }
}

async function importarPeliculas() {
  comprobarCredenciales();

  const respuestaGeneros = await consultarTmdb("/genre/movie/list?language=es-MX");

  if (!Array.isArray(respuestaGeneros.genres)) {
    throw new Error("TMDb no devolvió la lista de géneros esperada.");
  }

  const nombresGeneros = new Map(
    respuestaGeneros.genres
      .filter(
        (genero) =>
          Number.isInteger(genero?.id) && typeof genero.name === "string",
      )
      .map((genero) => [genero.id, genero.name]),
  );
  const peliculasImportadas = [];

  for (let pagina = 1; pagina <= PAGINAS_A_IMPORTAR; pagina += 1) {
    const respuesta = await consultarTmdb(
      `/discover/movie?language=es-MX&sort_by=popularity.desc&page=${pagina}`,
    );

    if (!Array.isArray(respuesta.results)) {
      throw new Error(`La página ${pagina} de TMDb no contiene una lista de películas.`);
    }

    const peliculasValidas = respuesta.results
      .map((pelicula) => prepararPelicula(pelicula, nombresGeneros))
      .filter(Boolean);

    peliculasImportadas.push(...peliculasValidas);
  }

  if (peliculasImportadas.length === 0) {
    throw new Error("TMDb no devolvió películas válidas para importar.");
  }

  await guardarPeliculas(peliculasImportadas);
  console.log(`Se importaron ${peliculasImportadas.length} películas.`);
}

importarPeliculas().catch((error) => {
  console.error(`No se pudo completar la importación: ${error.message}`);
  process.exitCode = 1;
});
