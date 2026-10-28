export function eliminarPeliculasDuplicadas(peliculas) {
  const peliculasPorId = new Map();

  for (const pelicula of peliculas) {
    peliculasPorId.set(pelicula.tmdb_id, pelicula);
  }

  return Array.from(peliculasPorId.values());
}
