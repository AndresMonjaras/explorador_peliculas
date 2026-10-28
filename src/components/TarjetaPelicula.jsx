import { useState } from "react";

export function TarjetaPelicula({ pelicula, onAbrir }) {
  const [posterFallido, setPosterFallido] = useState(false);
  const poster = pelicula.poster_path
    ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
    : null;
  const anio = pelicula.fecha_estreno ? pelicula.fecha_estreno.slice(0, 4) : "—";
  const mostrarPoster = poster && !posterFallido;

  return (
    <article className="tarjeta">
      <button
        type="button"
        className="tarjeta__boton"
        onClick={() => onAbrir(pelicula.tmdb_id)}
        aria-label={`Ver detalles de ${pelicula.titulo}`}
      >
        {mostrarPoster ? (
          <img
            className="tarjeta__poster"
            src={poster}
            alt={pelicula.titulo}
            loading="lazy"
            onError={() => setPosterFallido(true)}
          />
        ) : (
          <div className="tarjeta__poster tarjeta__poster--vacio" aria-hidden="true">
            <span>Sin póster</span>
          </div>
        )}
        <div className="tarjeta__info">
          <h3 className="tarjeta__titulo">{pelicula.titulo}</h3>
          <span className="tarjeta__meta">
            <span>{anio}</span>
            <span aria-label="Puntuación de TMDB">
              ★ {pelicula.puntuacion ?? "—"}
            </span>
          </span>
        </div>
      </button>
    </article>
  );
}
